import { execFile } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

type AnyObject = Record<string, any>;

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.split('=');
      const key = k.replace(/^--/, '');
      if (typeof v === 'string') args[key] = v;
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) args[key] = argv[++i];
      else args[key] = true;
    }
  }
  return args;
}

async function kubectlRaw(path: string): Promise<AnyObject> {
  const { stdout } = await execFileAsync('kubectl', ['get', '--raw', path], { maxBuffer: 1024 * 1024 * 200 });
  return JSON.parse(stdout.toString());
}

async function main() {
  const args = parseArgs(process.argv);
  const outPath = (args.out as string) || __dirname + '/swagger.v2.json';
  const endpoint = (args.index as string) || '/openapi/v2';

  console.log(`[info] fetching OpenAPI v2: ${endpoint}`);
  const doc = await kubectlRaw(endpoint);

  if (doc.openapi) {
    console.warn('[warn] Received OpenAPI v3 document at /openapi/v2?');
  }
  if (doc.swagger !== '2.0') {
    console.warn(`[warn] Expected swagger "2.0", got: ${doc.swagger || 'unknown'}`);
  }

  const pathsCount = doc.paths ? Object.keys(doc.paths).length : 0;
  const defsCount = doc.definitions ? Object.keys(doc.definitions).length : 0;
  console.log(`[info] fetched: ${pathsCount} paths, ${defsCount} definitions`);

  writeFileSync(outPath, JSON.stringify(doc, null, 2));
  console.log(`[info] wrote ${outPath}`);
}

main().catch(err => {
  console.error('[error] ' + (err?.stack || err?.message || String(err)));
  process.exit(1);
});
