#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import generate from '@babel/generator';
import * as t from '@babel/types';

// Telescope-style phases: scan -> model -> print -> write

const PKG_DIR = path.resolve(__dirname, '..');
const OPERATORS_DIR = path.join(PKG_DIR, 'src', 'operators');
const OUTPUT_DIR = path.join(PKG_DIR, 'src', 'generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'operators.ts');
const INTERWEB_INDEX_PATH = path.join(PKG_DIR, '..', 'interwebjs', 'src', 'index.ts');

type Doc = Record<string, any>;

type GVKRef = {
  group: string;
  version: string;
  kind: string;
  gvk: string;
  typeName?: string;
};

type OperatorModel = {
  id: string;
  default?: GVKRef[];
  versions?: Record<string, GVKRef[]>;
};

type OperatorDocs = {
  id: string;
  default?: Doc[];
  versions?: Record<string, Doc[]>;
};

// Utilities
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readYaml(filePath: string): Doc[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  const docs = yaml.loadAll(raw) as Doc[];
  return docs.filter((d) => d && typeof d === 'object');
}

function toGVKRef(doc: Doc): GVKRef | undefined {
  const apiVersion = doc?.apiVersion;
  const kind = doc?.kind;
  if (!apiVersion || !kind || typeof apiVersion !== 'string' || typeof kind !== 'string') return undefined;
  const [groupMaybe, versionMaybe] = apiVersion.includes('/')
    ? (apiVersion.split('/') as [string, string])
    : (['core', apiVersion] as [string, string]);
  const group = groupMaybe || 'core';
  const version = versionMaybe;
  const gvk = `${group}/${version}/${kind}`;
  return { group, version, kind, gvk };
}

function uniqSorted<T>(arr: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = key(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out.sort((a, b) => key(a).localeCompare(key(b)));
}

// Scan interwebjs ResourceTypeMap for available type names (gvk -> typeName)
function buildGvkToTypeMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(INTERWEB_INDEX_PATH)) return map;
  const content = fs.readFileSync(INTERWEB_INDEX_PATH, 'utf8');
  const ifaceRegex = /export\s+interface\s+ResourceTypeMap\s*{([\s\S]*?)}/m;
  const body = ifaceRegex.exec(content)?.[1];
  if (!body) return map;
  const lineRegex = /"([^"]+)"\s*:\s*([A-Za-z0-9_]+)/g;
  let m: RegExpExecArray | null;
  while ((m = lineRegex.exec(body))) {
    const gvk = m[1];
    const typeName = m[2];
    map.set(gvk, typeName);
  }
  return map;
}

// Scan operators dir -> Model
function scanOperators(): OperatorModel[] {
  const entries = fs
    .readdirSync(OPERATORS_DIR, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const byId = new Map<string, OperatorModel>();
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.yaml')) {
      const id = entry.name.replace(/\.yaml$/i, '');
      const docs = readYaml(path.join(OPERATORS_DIR, entry.name));
      const gvk = uniqSorted(
        docs.map(toGVKRef).filter(Boolean) as GVKRef[],
        (x) => x.gvk
      );
      const model = byId.get(id) || { id };
      model.default = gvk;
      byId.set(id, model);
      continue;
    }

    if (entry.isDirectory()) {
      const id = entry.name;
      const dir = path.join(OPERATORS_DIR, id);
      const versionFiles = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith('.yaml'))
        .sort((a, b) => a.name.localeCompare(b.name));
      if (versionFiles.length === 0) continue;
      const model = byId.get(id) || { id };
      model.versions = model.versions || {};
      for (const f of versionFiles) {
        const version = f.name.replace(/\.yaml$/i, '');
        const docs = readYaml(path.join(dir, f.name));
        const gvk = uniqSorted(
          docs.map(toGVKRef).filter(Boolean) as GVKRef[],
          (x) => x.gvk
        );
        model.versions[version] = gvk;
      }
      byId.set(id, model);
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.id.localeCompare(b.id));
}

// Enrich model with typeName from interwebjs map
function annotateTypes(models: OperatorModel[], gvkToType: Map<string, string>): OperatorModel[] {
  const annotateArray = (arr?: GVKRef[]) =>
    arr?.map((x) => ({ ...x, typeName: gvkToType.get(x.gvk) || undefined }));
  return models.map((m) => ({
    id: m.id,
    default: annotateArray(m.default),
    versions: m.versions
      ? Object.fromEntries(
          Object.entries(m.versions).map(([ver, arr]) => [ver, annotateArray(arr) as GVKRef[]])
        )
      : undefined,
  }));
}

// AST printing helpers
function idOrString(key: string): t.Identifier | t.StringLiteral {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? t.identifier(key) : t.stringLiteral(key);
}

function gvkRefToAst(x: GVKRef): t.ObjectExpression {
  const props: t.ObjectProperty[] = [
    t.objectProperty(t.identifier('group'), t.stringLiteral(x.group)),
    t.objectProperty(t.identifier('version'), t.stringLiteral(x.version)),
    t.objectProperty(t.identifier('kind'), t.stringLiteral(x.kind)),
    t.objectProperty(t.identifier('gvk'), t.stringLiteral(x.gvk)),
  ];
  if (x.typeName) props.push(t.objectProperty(t.identifier('typeName'), t.stringLiteral(x.typeName)));
  return t.objectExpression(props);
}

function arrayLiteral<T>(items: T[], map: (x: T) => t.Expression): t.ArrayExpression {
  return t.arrayExpression(items.map(map));
}

function buildModuleAst(models: OperatorModel[]): t.File {
  // Types
  const body: t.Statement[] = [];

  // Header
  const header = `* This file is auto-generated by scripts/codegen-operators.ts\n * Source: src/operators/*.yaml (+ versioned subfolders)\n * Purpose: compact discovery data (ids, versions, GVKs).`;

  // GVKRef interface
  const gvkSig = (name: string, type: t.TSType): t.TSPropertySignature => {
    const p = t.tsPropertySignature(t.identifier(name));
    p.typeAnnotation = t.tsTypeAnnotation(type);
    return p;
  };
  const GVKRefIface = t.tsInterfaceDeclaration(
    t.identifier('GVKRef'),
    null,
    [],
    t.tsInterfaceBody([
      gvkSig('group', t.tsStringKeyword()),
      gvkSig('version', t.tsStringKeyword()),
      gvkSig('kind', t.tsStringKeyword()),
      gvkSig('gvk', t.tsStringKeyword()),
      (() => {
        const p = gvkSig('typeName', t.tsStringKeyword());
        p.optional = true;
        return p;
      })(),
    ])
  );

  // Operator bundle types
  const entryType = t.tsTypeAliasDeclaration(
    t.identifier('OperatorGvkEntry'),
    undefined,
    t.tsTypeLiteral([
      (() => {
        const p = t.tsPropertySignature(t.identifier('default'));
        p.optional = true;
        p.typeAnnotation = t.tsTypeAnnotation(t.tsArrayType(t.tsTypeReference(t.identifier('GVKRef'))));
        return p;
      })(),
      (() => {
        const p = t.tsPropertySignature(t.identifier('versions'));
        p.optional = true;
        p.typeAnnotation = t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier('Record'),
            t.tsTypeParameterInstantiation([t.tsStringKeyword(), t.tsArrayType(t.tsTypeReference(t.identifier('GVKRef')))])
          )
        );
        return p;
      })(),
    ])
  );

  const mapType = t.tsTypeAliasDeclaration(
    t.identifier('OperatorGvkMap'),
    undefined,
    t.tsTypeReference(
      t.identifier('Record'),
      t.tsTypeParameterInstantiation([t.tsStringKeyword(), t.tsTypeReference(t.identifier('OperatorGvkEntry'))])
    )
  );

  body.push(GVKRefIface, entryType, mapType);

  // OPERATOR_IDS (as const)
  const operatorIds = models.map((m) => m.id).sort();
  const idsVarId = t.identifier('OPERATOR_IDS');
  (idsVarId as any).typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('ReadonlyArray'),
      t.tsTypeParameterInstantiation([t.tsStringKeyword()])
    )
  );
  const idsVar = t.variableDeclaration('const', [
    t.variableDeclarator(idsVarId as unknown as t.LVal, arrayLiteral(operatorIds, (id) => t.stringLiteral(id))),
  ]);
  const idsExport = t.exportNamedDeclaration(idsVar, []);
  // Type OperatorId = 'a' | 'b' | ...
  const operatorIdType = t.tsTypeAliasDeclaration(
    t.identifier('OperatorId'),
    undefined,
    operatorIds.length
      ? t.tsUnionType(operatorIds.map((id) => t.tsLiteralType(t.stringLiteral(id))))
      : t.tsNeverKeyword()
  );

  // OPERATOR_VERSIONS
  const versionsProps = models
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((m) => {
      const versions = m.versions ? Object.keys(m.versions).sort() : [];
      return t.objectProperty(idOrString(m.id), arrayLiteral(versions, (v) => t.stringLiteral(v)));
    });
  const versionsDeclId = t.identifier('OPERATOR_VERSIONS');
  const versionsDecl = t.variableDeclaration('const', [
    t.variableDeclarator(versionsDeclId, t.objectExpression(versionsProps)),
  ]);
  const versionsExport = t.exportNamedDeclaration(versionsDecl, []);

  // OPERATOR_GVKS
  const gvkMapProps = models
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((m) => {
      const props: t.ObjectProperty[] = [];
      if (m.default) {
        props.push(
          t.objectProperty(
            t.identifier('default'),
            arrayLiteral(m.default, (x) => gvkRefToAst(x))
          )
        );
      }
      if (m.versions) {
        const vProps = Object.entries(m.versions)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([ver, arr]) => t.objectProperty(idOrString(ver), arrayLiteral(arr, (x) => gvkRefToAst(x))));
        props.push(t.objectProperty(t.identifier('versions'), t.objectExpression(vProps)));
      }
      return t.objectProperty(idOrString(m.id), t.objectExpression(props));
    });
  const gvkDeclId = t.identifier('OPERATOR_GVKS');
  const gvkDecl = t.variableDeclaration('const', [
    t.variableDeclarator(gvkDeclId, t.objectExpression(gvkMapProps)),
  ]);
  (gvkDecl.declarations[0].id as t.Identifier).typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(t.identifier('OperatorGvkMap'))
  );
  const gvkExport = t.exportNamedDeclaration(gvkDecl, []);

  body.push(idsExport, operatorIdType, versionsExport, gvkExport);

  const program = t.program(body, [], 'module');
  const file = t.file(program);
  program.body[0].leadingComments = [{ type: 'CommentBlock', value: header } as any];
  return file;
}

function main() {
  const rawModels = scanOperators();
  const typeMap = buildGvkToTypeMap();
  const models = annotateTypes(rawModels, typeMap);
  ensureDir(OUTPUT_DIR);
  const ast = buildModuleAst(models);
  const { code } = generate(ast, { retainLines: false, compact: false, jsescOption: { minimal: true } });
  const banner = '// Auto-generated. Run `pnpm -w --filter @interweb/manifests run codegen` to regenerate.\n\n';
  fs.writeFileSync(OUTPUT_FILE, banner + code + '\n');
  console.log(`Generated ${path.relative(PKG_DIR, OUTPUT_FILE)}`);
  // Also emit per-operator object modules
  emitOperatorObjectModules(typeMap);
}

main();

// ————— Additional: emit TS objects for each operator —————
function scanOperatorDocs(): OperatorDocs[] {
  const entries = fs
    .readdirSync(OPERATORS_DIR, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const byId = new Map<string, OperatorDocs>();
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.yaml')) {
      const id = entry.name.replace(/\.yaml$/i, '');
      const docs = readYaml(path.join(OPERATORS_DIR, entry.name));
      const model = byId.get(id) || { id };
      model.default = docs;
      byId.set(id, model);
      continue;
    }
    if (entry.isDirectory()) {
      const id = entry.name;
      const dir = path.join(OPERATORS_DIR, id);
      const versionFiles = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith('.yaml'))
        .sort((a, b) => a.name.localeCompare(b.name));
      if (versionFiles.length === 0) continue;
      const model = byId.get(id) || { id };
      model.versions = model.versions || {};
      for (const f of versionFiles) {
        const version = f.name.replace(/\.yaml$/i, '');
        model.versions[version] = readYaml(path.join(dir, f.name));
      }
      byId.set(id, model);
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.id.localeCompare(b.id));
}

function objectKeysOrdered(obj: Record<string, any>, depth: number): string[] {
  const keys = Object.keys(obj);
  if (depth > 0) return keys.sort((a, b) => a.localeCompare(b));
  const preferred = ['apiVersion', 'kind', 'metadata', 'spec', 'data', 'stringData', 'type'];
  const set = new Set(preferred);
  const rest = keys.filter((k) => !set.has(k)).sort((a, b) => a.localeCompare(b));
  return preferred.filter((k) => keys.includes(k)).concat(rest);
}

function valueToAst(value: any, depth = 0): t.Expression {
  if (Array.isArray(value)) return t.arrayExpression(value.map((v) => valueToAst(v, depth + 1)));
  if (value === null) return t.nullLiteral();
  switch (typeof value) {
    case 'string':
      return t.stringLiteral(value);
    case 'number':
      return Number.isFinite(value) ? t.numericLiteral(value) : t.stringLiteral(String(value));
    case 'boolean':
      return t.booleanLiteral(value);
    case 'object': {
      const keys = objectKeysOrdered(value, depth);
      const props = keys
        .filter((k) => value[k] !== undefined)
        .map((k) => t.objectProperty(idOrString(k), valueToAst(value[k], depth + 1)));
      return t.objectExpression(props);
    }
    default:
      return t.identifier('undefined');
  }
}

function typeOfDoc(doc: Doc, typeMap: Map<string, string>): string | undefined {
  const gvk = toGVKRef(doc)?.gvk;
  return gvk ? typeMap.get(gvk) : undefined;
}

function buildOperatorObjectsAst(op: OperatorDocs, typeMap: Map<string, string>): t.File {
  const body: t.Statement[] = [];
  // Import types used
  const typeNames = new Set<string>();
  const collect = (docs?: Doc[]) => {
    for (const d of docs || []) {
      const name = typeOfDoc(d, typeMap);
      if (name) typeNames.add(name);
    }
  };
  collect(op.default);
  for (const arr of Object.values(op.versions || {})) collect(arr);

  const specifiers: t.ImportSpecifier[] = Array.from(typeNames)
    .sort()
    .map((n) => t.importSpecifier(t.identifier(n), t.identifier(n)));
  specifiers.unshift(
    t.importSpecifier(t.identifier('KubernetesResource'), t.identifier('KubernetesResource'))
  );
  const importDecl = t.importDeclaration(specifiers, t.stringLiteral('@interweb/interwebjs'));
  importDecl.importKind = 'type';
  body.push(importDecl);

  const toTypedExpr = (doc: Doc): t.TSAsExpression => {
    const expr = valueToAst(doc, 0);
    const tn = typeOfDoc(doc, typeMap) || 'KubernetesResource';
    return t.tsAsExpression(expr, t.tsTypeReference(t.identifier(tn)));
  };

  const toPascal = (s: string) => {
    // Split on non-alphanumeric boundaries and capitalize each part
    const parts = String(s)
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    const joined = parts.join('');
    return joined || 'Unnamed';
  };
  const makeConstName = (doc: Doc, used: Set<string>) => {
    const kind = String(doc?.kind || 'Resource');
    const name = String(doc?.metadata?.name || 'noname');
    const pascal = toPascal(name);
    let base = `${kind}_${pascal}`;
    if (!/^[A-Za-z_$]/.test(base)) base = '_' + base;
    let unique = base;
    let i = 1;
    while (used.has(unique)) {
      unique = `${base}__${i++}`;
    }
    used.add(unique);
    return unique;
  };

  // default: emit named typed objects + Resources array
  if (op.default && op.default.length) {
    const used = new Set<string>();
    const names: string[] = [];
    for (const doc of op.default) {
      const constName = makeConstName(doc, used);
      names.push(constName);
      const tn = typeOfDoc(doc, typeMap) || 'KubernetesResource';
      const decl = t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier(constName), toTypedExpr(doc)),
      ]);
      // add explicit type annotation on id for readability
      (decl.declarations[0].id as t.Identifier).typeAnnotation = t.tsTypeAnnotation(
        t.tsTypeReference(t.identifier(tn))
      );
      body.push(t.exportNamedDeclaration(decl, []));
    }
    const arr = t.arrayExpression(names.map((n) => t.identifier(n)));
    const id = t.identifier('Resources');
    (id as any).typeAnnotation = t.tsTypeAnnotation(
      t.tsTypeReference(
        t.identifier('ReadonlyArray'),
        t.tsTypeParameterInstantiation([t.tsTypeReference(t.identifier('KubernetesResource'))])
      )
    );
    const decl = t.variableDeclaration('const', [t.variableDeclarator(id as unknown as t.LVal, arr)]);
    body.push(t.exportNamedDeclaration(decl, []));
  }

  // versions
  if (op.versions && Object.keys(op.versions).length > 0) {
    const vProps = Object.entries(op.versions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ver, docs]) => t.objectProperty(idOrString(ver), t.arrayExpression(docs.map(toTypedExpr))));
    const verDecl = t.variableDeclaration('const', [
      t.variableDeclarator(t.identifier('versions'), t.objectExpression(vProps)),
    ]);
    body.push(t.exportNamedDeclaration(verDecl, []));
  }

  // default export helper
  const defaultExportObj: t.ObjectExpression = t.objectExpression([
    ...(op.default && op.default.length ? [t.objectProperty(t.identifier('Resources'), t.identifier('Resources'))] : []),
    ...(op.versions && Object.keys(op.versions).length > 0
      ? [t.objectProperty(t.identifier('versions'), t.identifier('versions'))]
      : []),
  ]);
  body.push(t.exportDefaultDeclaration(defaultExportObj));

  const program = t.program(body, [], 'module');
  const file = t.file(program);
  program.body[0].leadingComments = [
    {
      type: 'CommentBlock',
      value: `* Auto-generated typed resources for operator: ${op.id}`,
    } as any,
  ];
  return file;
}

function emitOperatorObjectModules(typeMap: Map<string, string>) {
  const ops = scanOperatorDocs();
  const outDir = path.join(OUTPUT_DIR, 'objects');
  ensureDir(outDir);
  const emitted: string[] = [];
  for (const op of ops) {
    const ast = buildOperatorObjectsAst(op, typeMap);
    const { code } = generate(ast, { retainLines: false, compact: false, jsescOption: { minimal: true } });
    const filePath = path.join(outDir, `${op.id}.ts`);
    fs.writeFileSync(filePath, '// Auto-generated. Do not edit.\n\n' + code + '\n');
    console.log(`Generated ${path.relative(PKG_DIR, filePath)}`);
    emitted.push(op.id);
  }
  // aggregator index.ts
  const imports = emitted
    .sort()
    .map((id) => `import * as ${id.replace(/[-.]/g, '_')} from './${id}';`) 
    .join('\n');
  const entries = emitted
    .sort()
    .map((id) => `  ${JSON.stringify(id)}: ${id.replace(/[-.]/g, '_')},`)
    .join('\n');
  const indexSrc = `// Auto-generated. Do not edit.\n\n` +
    `import type { KubernetesResource } from '@interweb/interwebjs';\n` +
    `${imports}\n\n` +
    `export interface OperatorObjectModule {\n` +
    `  Resources?: ReadonlyArray<KubernetesResource>;\n` +
    `  versions?: Record<string, ReadonlyArray<KubernetesResource>>;\n` +
    `}\n` +
    `export const OPERATOR_OBJECTS: Record<string, OperatorObjectModule> = {\n${entries}\n};\n`;
  fs.writeFileSync(path.join(outDir, 'index.ts'), indexSrc);
  console.log(`Generated ${path.relative(PKG_DIR, path.join(outDir, 'index.ts'))}`);
}
