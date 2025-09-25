#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import generate from '@babel/generator';
import * as t from '@babel/types';

// Telescope-style phases: scan -> model -> print -> write

const PKG_DIR = path.resolve(__dirname, '..');
// Operators YAML source is now outside of src so it isn't published.
// Default location: <pkg>/operators (gitignored, local-only)
const OPERATORS_DIR = path.join(PKG_DIR, 'operators');
const OUTPUT_DIR = path.join(PKG_DIR, 'src', 'generated');
// No separate 'operators.ts' file anymore; we put version metadata into generated/index.ts
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

// Deprecated: previously used to emit src/generated/operators.ts (ids + versions). We now
// inject this data into the aggregator (generated/index.ts).
function buildModuleAst(_models: OperatorModel[]): t.File {
  return t.file(t.program([]));
}

function main() {
  const rawModels = scanOperators();
  const typeMap = buildGvkToTypeMap();
  const models = annotateTypes(rawModels, typeMap);
  ensureDir(OUTPUT_DIR);
  // No longer writing operators.ts
  // Write per-operator object modules and aggregator (with versions metadata).
  emitOperatorObjectModules(typeMap, models);
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
  // Include all docs, including Namespace (so generated bundles are self-sufficient)
  const defaultDocs = (op.default || []);
  // Note: we intentionally do not embed versioned docs in generated objects anymore.

  // Import types actually used
  const typeNames = new Set<string>();
  const collect = (docs?: Doc[]) => {
    for (const d of docs || []) {
      const name = typeOfDoc(d, typeMap);
      if (name) typeNames.add(name);
    }
  };
  collect(defaultDocs);

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
  const toExprNoCast = (doc: Doc): t.Expression => {
    return valueToAst(doc, 0);
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

  // default: emit named typed objects + resources array
  if (defaultDocs.length) {
    const used = new Set<string>();
    const names: string[] = [];
    for (const doc of defaultDocs) {
      const constName = makeConstName(doc, used);
      names.push(constName);
      const tn = typeOfDoc(doc, typeMap) || 'KubernetesResource';
      const decl = t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier(constName), toExprNoCast(doc)),
      ]);
      // add explicit type annotation on id for readability
      (decl.declarations[0].id as t.Identifier).typeAnnotation = t.tsTypeAnnotation(
        t.tsTypeReference(t.identifier(tn))
      );
      body.push(t.exportNamedDeclaration(decl, []));
    }
    const arr = t.arrayExpression(names.map((n) => t.identifier(n)));
    const id = t.identifier('resources');
    (id as any).typeAnnotation = t.tsTypeAnnotation(
      t.tsTypeReference(
        t.identifier('ReadonlyArray'),
        t.tsTypeParameterInstantiation([t.tsTypeReference(t.identifier('KubernetesResource'))])
      )
    );
    const decl = t.variableDeclaration('const', [t.variableDeclarator(id as unknown as t.LVal, arr)]);
    body.push(t.exportNamedDeclaration(decl, []));
  }

  // default export helper
  const defaultExportObj: t.ObjectExpression = t.objectExpression([
    ...(defaultDocs.length ? [t.objectProperty(t.identifier('resources'), t.identifier('resources'))] : []),
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

function emitOperatorObjectModules(typeMap: Map<string, string>, models?: OperatorModel[]) {
  const ops = scanOperatorDocs();
  const outDir = OUTPUT_DIR; // emit directly into src/generated
  ensureDir(outDir);
  // Remove legacy './objects' dir if present
  const legacyDir = path.join(outDir, 'objects');
  if (fs.existsSync(legacyDir)) {
    try { fs.rmSync(legacyDir, { recursive: true, force: true }); } catch {}
  }
  const emitted: string[] = [];
  for (const op of ops) {
    const ast = buildOperatorObjectsAst(op, typeMap);
    const { code } = generate(ast, { retainLines: false, compact: false, jsescOption: { minimal: true } });
    const filePath = path.join(outDir, `${op.id}.ts`);
    fs.writeFileSync(filePath, code + '\n');
    console.log(`Generated ${path.relative(PKG_DIR, filePath)}`);
    emitted.push(op.id);
  }
  // aggregator index.ts via AST only
  const indexBody: t.Statement[] = [];
  // Header comment
  const header = `* Auto-generated aggregator of operator objects`;
  // import type { KubernetesResource } from '@interweb/interwebjs'
  const typeImport = t.importDeclaration(
    [t.importSpecifier(t.identifier('KubernetesResource'), t.identifier('KubernetesResource'))],
    t.stringLiteral('@interweb/interwebjs')
  );
  typeImport.importKind = 'type';
  indexBody.push(typeImport);
  // default (PascalCase) imports for each operator file
  const toPascal = (s: string) => {
    const parts = String(s)
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    const joined = parts.join('');
    return joined || 'Unnamed';
  };
  const importNames: string[] = [];
  emitted.sort().forEach((id) => {
    const importName = toPascal(id);
    importNames.push(importName);
    indexBody.push(
      t.importDeclaration([
        t.importDefaultSpecifier(t.identifier(importName)),
      ], t.stringLiteral(`./${id}`))
    );
  });

  // export interface OperatorObjectModule { resources?: ReadonlyArray<KubernetesResource>; }
  const ifaceProps: t.TSPropertySignature[] = [];
  const resourcesProp = t.tsPropertySignature(t.identifier('resources'));
  resourcesProp.optional = true;
  resourcesProp.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('ReadonlyArray'),
      t.tsTypeParameterInstantiation([t.tsTypeReference(t.identifier('KubernetesResource'))])
    )
  );
  ifaceProps.push(resourcesProp);
  indexBody.push(
    t.exportNamedDeclaration(
      t.tsInterfaceDeclaration(t.identifier('OperatorObjectModule'), null, [], t.tsInterfaceBody(ifaceProps))
    )
  );
  // export const OPERATOR_OBJECTS: Record<string, OperatorObjectModule> = { ... }
  const objProps = emitted.sort().map((id) =>
    t.objectProperty(t.stringLiteral(id), t.identifier(toPascal(id)))
  );
  const objId = t.identifier('OPERATOR_OBJECTS');
  (objId as any).typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('Record'),
      t.tsTypeParameterInstantiation([t.tsStringKeyword(), t.tsTypeReference(t.identifier('OperatorObjectModule'))])
    )
  );
  const objDecl = t.variableDeclaration('const', [t.variableDeclarator(objId as unknown as t.LVal, t.objectExpression(objProps))]);
  indexBody.push(t.exportNamedDeclaration(objDecl, []));

  // export const OPERATOR_IDS: ReadonlyArray<string>
  const operatorIds = (models || []).map((m) => m.id).sort();
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
  indexBody.push(t.exportNamedDeclaration(idsVar, []));

  // export const OPERATOR_VERSIONS: Record<string, ReadonlyArray<string>>
  const versionsProps = (models || [])
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((m) => {
      const versions = m.versions ? Object.keys(m.versions).sort() : [];
      return t.objectProperty(idOrString(m.id), arrayLiteral(versions, (v) => t.stringLiteral(v)));
    });
  const versionsDeclId = t.identifier('OPERATOR_VERSIONS');
  const versionsDecl = t.variableDeclaration('const', [
    t.variableDeclarator(versionsDeclId, t.objectExpression(versionsProps)),
  ]);
  indexBody.push(t.exportNamedDeclaration(versionsDecl, []));

  // export const OPERATOR_MAP: Record<string, { resources: ReadonlyArray<KubernetesResource>; versions: ReadonlyArray<string> }>
  const mapObjProps = (models || []).sort((a,b)=>a.id.localeCompare(b.id)).map((m) => {
    const id = m.id;
    const pascal = toPascal(id);
    const versions = m.versions ? Object.keys(m.versions).sort() : [];
    const props: t.ObjectProperty[] = [
      t.objectProperty(t.identifier('versions'), arrayLiteral(versions, (v) => t.stringLiteral(v)))
    ];
    // add resources reference if available on the default import
    props.push(
      t.objectProperty(
        t.identifier('resources'),
        t.memberExpression(t.identifier(pascal), t.identifier('resources'))
      )
    );
    return t.objectProperty(t.stringLiteral(id), t.objectExpression(props));
  });
  const mapId = t.identifier('OPERATOR_MAP');
  (mapId as any).typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('Record'),
      t.tsTypeParameterInstantiation([
        t.tsStringKeyword(),
        t.tsTypeLiteral([
          t.tsPropertySignature(t.identifier('resources'), t.tsTypeAnnotation(
            t.tsTypeReference(
              t.identifier('ReadonlyArray'),
              t.tsTypeParameterInstantiation([t.tsTypeReference(t.identifier('KubernetesResource'))])
            )
          )),
          t.tsPropertySignature(t.identifier('versions'), t.tsTypeAnnotation(
            t.tsTypeReference(
              t.identifier('ReadonlyArray'),
              t.tsTypeParameterInstantiation([t.tsStringKeyword()])
            )
          )),
        ])
      ])
    )
  );
  const mapDecl = t.variableDeclaration('const', [
    t.variableDeclarator(mapId as unknown as t.LVal, t.objectExpression(mapObjProps))
  ]);
  indexBody.push(t.exportNamedDeclaration(mapDecl, []));
  const indexAst = t.file(t.program(indexBody));
  if (indexBody.length > 0) {
    indexBody[0].leadingComments = [{ type: 'CommentBlock', value: header } as any];
  }
  const { code: indexCode } = generate(indexAst, { retainLines: false, compact: false, jsescOption: { minimal: true } });
  fs.writeFileSync(path.join(outDir, 'index.ts'), indexCode + '\n');
  console.log(`Generated ${path.relative(PKG_DIR, path.join(outDir, 'index.ts'))}`);
}
