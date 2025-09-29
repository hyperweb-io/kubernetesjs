#!/usr/bin/env ts-node
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as yaml from 'js-yaml';

type Source =
  | {
      type: 'urls';
      version: string;
      urls: string[];
      outputName?: string; // optional alternate filename per version
    }
  | {
      type: 'helm';
      version: string;
      repo: string; // e.g. https://charts.jetstack.io
      repoName: string; // e.g. jetstack
      chart: string; // e.g. cert-manager
      namespace?: string;
      values?: Record<string, any>;
      extraArgs?: string[];
    };

type OperatorConfig = {
  name: string;
  sources: Source[]; // multiple versions allowed
  combineUrls?: boolean; // for urls type: concatenate into single file (default true)
};

// Configure supported operators and versions.
// Keep explicit URLs for reliability and reproducibility.
const OPERATORS: OperatorConfig[] = [
  {
    name: 'minio-operator',
    sources: [
      {
        type: 'helm',
        // Helm chart version for MinIO Operator (pinned for reproducibility)
        version: '7.1.1',
        repo: 'https://operator.min.io',
        repoName: 'minio-operator',
        chart: 'operator',
        namespace: 'minio-operator',
      },
    ],
  },
  {
    name: 'cloudnative-pg',
    sources: [
      {
        type: 'urls',
        version: '1.25.2',
        urls: [
          // Matches scripts/01-install-operators.sh
          'https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.25/releases/cnpg-1.25.2.yaml',
        ],
      },
    ],
  },
  {
    name: 'knative-serving',
    sources: [
      {
        type: 'urls',
        version: 'v1.15.0',
        urls: [
          'https://github.com/knative/serving/releases/download/knative-v1.15.0/serving-crds.yaml',
          'https://github.com/knative/serving/releases/download/knative-v1.15.0/serving-core.yaml',
          'https://github.com/knative/net-kourier/releases/download/knative-v1.15.0/kourier.yaml',
        ],
      },
    ],
  },
  {
    name: 'cert-manager',
    sources: [
      {
        type: 'helm',
        version: 'v1.17.0',
        repo: 'https://charts.jetstack.io',
        repoName: 'jetstack',
        chart: 'cert-manager',
        namespace: 'cert-manager',
        values: { installCRDs: true, global: { leaderElection: { namespace: 'cert-manager' } } },
      },
    ],
  },
  {
    name: 'ingress-nginx',
    sources: [
      {
        type: 'helm',
        // Chart 4.11.2 corresponds to controller 1.11.1 (matches existing yaml)
        version: '4.11.2',
        repo: 'https://kubernetes.github.io/ingress-nginx',
        repoName: 'ingress-nginx',
        chart: 'ingress-nginx',
        namespace: 'ingress-nginx',
        values: {
          controller: {
            metrics: { enabled: true },
            podAnnotations: { 'prometheus.io/scrape': 'true', 'prometheus.io/port': '10254' },
          },
        },
      },
    ],
  },
  {
    name: 'kube-prometheus-stack',
    sources: [
      {
        type: 'helm',
        version: '77.5.0',
        repo: 'https://prometheus-community.github.io/helm-charts',
        repoName: 'prometheus-community',
        chart: 'kube-prometheus-stack',
        namespace: 'monitoring',
        values: {
          prometheus: {
            prometheusSpec: {
              retention: '7d',
              storageSpec: {
                volumeClaimTemplate: { spec: { resources: { requests: { storage: '10Gi' } } } },
              },
            },
          },
          grafana: {
            adminPassword: 'admin',
            persistence: { enabled: true, size: '5Gi' },
          },
        },
      },
    ],
  }
];

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Handle redirects
          return resolve(fetchUrl(res.headers.location));
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function helmTemplate(args: string[], cwd?: string): string {
  const { stdout, stderr, status, error } = spawnSync('helm', args, {
    encoding: 'utf8',
    cwd,
    // Large charts (e.g., kube-prometheus-stack with --include-crds) can exceed default buffer.
    maxBuffer: 64 * 1024 * 1024, // 64 MB
  });
  if (error) {
    throw new Error(`helm ${args.join(' ')} error: ${error.message}`);
  }
  if (status !== 0) {
    throw new Error(`helm ${args.join(' ')} failed: ${stderr || stdout}`);
  }
  return stdout;
}

function hasNamespaceDoc(yamlText: string, namespace: string): boolean {
  try {
    const docs = yaml.loadAll(yamlText) as any[];
    return docs.some((d) => d && d.kind === 'Namespace' && d.metadata?.name === namespace);
  } catch {
    // If parse fails, fall back to a string heuristic
    const pattern = new RegExp(`kind:\\s*Namespace[\\s\\S]*?name:\\s*${namespace}\\b`);
    return pattern.test(yamlText);
  }
}

function prependNamespaceDoc(yamlText: string, namespace: string): string {
  const nsDoc = [
    `# Added by pull-manifests.ts to ensure namespace exists`,
    `apiVersion: v1`,
    `kind: Namespace`,
    `metadata:`,
    `  name: ${namespace}`,
    `  labels:`,
    `    app.kubernetes.io/name: ${namespace}`,
    ``,
  ].join('\n');
  const rest = yamlText.trim();
  return `---\n${nsDoc}\n---\n${rest}\n`;
}

// function yamlDocsFrom(text: string): any[] {
//   try {
//     return (yaml.loadAll(text) as any[]).filter((d) => d && typeof d === 'object');
//   } catch {
//     return [];
//   }
// }

function docKey(d: any): string {
  const apiVersion = d?.apiVersion || 'core';
  const kind = d?.kind || '';
  const name = d?.metadata?.name || '';
  const ns = d?.metadata?.namespace || '';
  return `${apiVersion}|${kind}|${name}|${ns}`;
}

// function dumpDocs(docs: any[]): string {
//   return docs.map((d) => yaml.dump(d).trim()).join('\n---\n') + '\n';
// }

function toValuesArgs(values?: Record<string, any>): string[] {
  if (!values) return [];
  const args: string[] = [];
  const flatten = (obj: any, prefix = '') => {
    Object.entries(obj).forEach(([k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) flatten(v, key);
      else args.push('--set', `${key}=${Array.isArray(v) ? v.join(',') : String(v)}`);
    });
  };
  flatten(values);
  return args;
}

function normalizeVersion(v: string): string {
  return v.startsWith('v') ? v.slice(1) : v;
}

function pickLatest(versions: string[]): string {
  // naive semver compare (x.y.z), ignoring pre-releases
  const parse = (v: string) => normalizeVersion(v).split('.').map((n) => parseInt(n, 10) || 0);
  return versions.sort((a, b) => {
    const pa = parse(a), pb = parse(b);
    for (let i = 0; i < 3; i++) {
      if (pa[i] !== pb[i]) return pb[i] - pa[i];
    }
    return 0;
  })[0];
}

async function pullOperator(op: OperatorConfig, version?: string, outDir = path.resolve(__dirname, '..', 'operators')) {
  const sources = version ? op.sources.filter((s) => s.version === version) : op.sources;
  if (sources.length === 0) throw new Error(`No sources for ${op.name}${version ? `@${version}` : ''}`);

  for (const src of sources) {
    const targetDir = path.join(outDir, op.name);
    const versionTag = src.version;
    const fileName = `${versionTag}.yaml`;
    const targetFile = path.join(targetDir, fileName);

    if (src.type === 'urls') {
      // Fetch and combine raw YAML documents while de-duplicating by logical identity.
      // Preserve original formatting/comments by NOT re-serializing via js-yaml.
      const seen = new Set<string>();
      const outPieces: string[] = [];

      for (const url of src.urls) {
        // eslint-disable-next-line no-await-in-loop
        const content = await fetchUrl(url);
        const docsRaw = content
          .split(/\n---\s*\n/gm) // split on standalone doc separators
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        let wroteHeaderForSource = false;
        for (const raw of docsRaw) {
          let key = '';
          try {
            const parsed = yaml.load(raw) as any;
            key = docKey(parsed);
          } catch {
            // If parse fails, keep a content hash as a fallback key
            key = `raw:${Buffer.from(raw).toString('base64').slice(0, 24)}`;
          }
          if (seen.has(key)) continue;
          seen.add(key);

          if (!wroteHeaderForSource) {
            outPieces.push(`# Source: ${url}`);
            wroteHeaderForSource = true;
          }
          outPieces.push(raw);
        }
      }

      const combined = outPieces.join('\n---\n') + '\n';
      writeFile(targetFile, combined);
      // Also update unversioned latest pointer (copy) if this is highest version
    } else if (src.type === 'helm') {
      // Ensure repo
      helmTemplate(['repo', 'add', src.repoName, src.repo]);
      helmTemplate(['repo', 'update']);

      const args = [
        'template',
        op.name,
        `${src.repoName}/${src.chart}`,
        '--include-crds',
        '--version',
        src.version,
      ];
      if (src.namespace) args.push('-n', src.namespace, '--create-namespace');
      args.push(...toValuesArgs(src.values));
      if (src.extraArgs) args.push(...src.extraArgs);

      let rendered = helmTemplate(args).trim();
      // If a namespace was specified for the chart and the rendered output does not
      // include a Namespace resource for it, prepend one so apply can create the ns.
      if (src.namespace && !hasNamespaceDoc(rendered, src.namespace)) {
        rendered = prependNamespaceDoc(rendered, src.namespace);
      }

      writeFile(
        targetFile,
        `# Source: ${src.repoName}/${src.chart}@${src.version}\n${rendered}\n`
      );
    }
  }

  // Update unversioned file to latest version available
  const versions = op.sources.map((s) => s.version);
  const latest = pickLatest(versions);
  const latestFile = path.join(outDir, op.name, `${latest}.yaml`);
  const unversionedFile = path.join(outDir, `${op.name}.yaml`);
  if (fs.existsSync(latestFile)) {
    writeFile(unversionedFile, fs.readFileSync(latestFile, 'utf8'));
  }
}

function parseArgs(argv: string[]) {
  const args = { all: false, operator: undefined as string | undefined, version: undefined as string | undefined, out: undefined as string | undefined };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') args.all = true;
    else if (a === '--list') args.operator = '::list';
    else if (a === '--operator' && argv[i + 1]) args.operator = argv[++i];
    else if (a === '--version' && argv[i + 1]) args.version = argv[++i];
    else if (a === '--out' && argv[i + 1]) args.out = argv[++i];
  }
  return args;
}

async function main() {
  const { all, operator, version, out } = parseArgs(process.argv);
  if (operator === '::list') {
    console.log('Available operators and versions:');
    for (const o of OPERATORS) {
      console.log(`- ${o.name}: ${o.sources.map((s) => s.version).join(', ')}`);
    }
    process.exit(0);
  }

  const outDir = out ? path.resolve(out) : path.resolve(__dirname, '..', 'operators');
  ensureDir(outDir);

  if (all) {
    for (const op of OPERATORS) {
      await pullOperator(op, undefined, outDir);
    }
    console.log(`Pulled all operators into ${outDir}`);
    return;
  }

  if (!operator) {
    console.error('Usage: ts-node scripts/pull-manifests.ts --all | --operator <name> [--version <v>] [--out <dir>] | --list');
    process.exit(1);
  }

  const op = OPERATORS.find((o) => o.name === operator);
  if (!op) {
    console.error(`Unknown operator: ${operator}`);
    process.exit(1);
  }
  await pullOperator(op, version, outDir);
  console.log(`Pulled ${operator}${version ? '@' + version : ''} into ${path.join(outDir, operator)}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
