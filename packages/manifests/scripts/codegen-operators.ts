#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import generate from '@babel/generator';
import * as t from '@babel/types';

type KubernetesResource = Record<string, any>;

type ManifestResource = {
  value: KubernetesResource;
  typeName?: string;
};

type OperatorEntry = {
  default?: ManifestResource[];
  versions?: Record<string, ManifestResource[]>;
};

const ROOT_DIR = path.resolve(__dirname, '..');
const OPERATORS_DIR = path.join(ROOT_DIR, 'src', 'operators');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'operators.ts');
const INTERWEB_INDEX_PATH = path.join(ROOT_DIR, '..', 'interwebjs', 'src', 'index.ts');

function loadAvailableTypeNames(): Set<string> {
  const content = fs.readFileSync(INTERWEB_INDEX_PATH, 'utf8');
  const regex = /^export interface (\w+)/gm;
  const names = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content))) {
    names.add(match[1]);
  }
  return names;
}

const availableTypeNames = loadAvailableTypeNames();
const referencedTypeNames = new Set<string>();

function inferTypeName(resource: KubernetesResource): string | undefined {
  const kind = resource?.kind;
  if (!kind || typeof kind !== 'string') {
    return undefined;
  }

  const candidate = kind.replace(/[^A-Za-z0-9_$]/g, '');
  if (candidate && availableTypeNames.has(candidate)) {
    referencedTypeNames.add(candidate);
    return candidate;
  }

  return undefined;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readYamlDocuments(filePath: string): KubernetesResource[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  const docs = yaml.loadAll(raw) as KubernetesResource[];
  return docs.filter((doc) => doc && typeof doc === 'object');
}

function collectOperators(): Record<string, OperatorEntry> {
  const result: Record<string, OperatorEntry> = {};
  const entries = fs
    .readdirSync(OPERATORS_DIR, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.yaml')) {
      const name = entry.name.replace(/\.yaml$/i, '');
      const docs = readYamlDocuments(path.join(OPERATORS_DIR, entry.name));
      const existing = result[name] || (result[name] = {});
      existing.default = docs.map((doc) => ({
        value: doc,
        typeName: inferTypeName(doc),
      }));
      continue;
    }

    if (entry.isDirectory()) {
      const dirPath = path.join(OPERATORS_DIR, entry.name);
      const versionFiles = fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter((child) => child.isFile() && child.name.endsWith('.yaml'))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (versionFiles.length === 0) {
        continue;
      }

      const existing = result[entry.name] || (result[entry.name] = {});
      existing.versions = existing.versions || {};

      for (const file of versionFiles) {
        const versionName = file.name.replace(/\.yaml$/i, '');
        existing.versions[versionName] = readYamlDocuments(path.join(dirPath, file.name)).map((doc) => ({
          value: doc,
          typeName: inferTypeName(doc),
        }));
      }
    }
  }

  return result;
}

function literalKey(key: string): t.Identifier | t.StringLiteral {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? t.identifier(key) : t.stringLiteral(key);
}

function valueToAst(value: any): t.Expression {
  if (Array.isArray(value)) {
    return t.arrayExpression(value.map((item) => valueToAst(item)));
  }

  if (value === null) {
    return t.nullLiteral();
  }

  switch (typeof value) {
    case 'string':
      return t.stringLiteral(value);
    case 'number':
      return Number.isFinite(value) ? t.numericLiteral(value) : t.stringLiteral(String(value));
    case 'boolean':
      return t.booleanLiteral(value);
    case 'object': {
      const entries = Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b));
      const properties = entries.map(([propKey, propValue]) =>
        t.objectProperty(literalKey(propKey), valueToAst(propValue))
      );
      return t.objectExpression(properties);
    }
    default:
      return t.identifier('undefined');
  }
}

function manifestResourceToExpression(resource: ManifestResource): t.Expression {
  const expression = valueToAst(resource.value);
  if (!t.isObjectExpression(expression) && !t.isArrayExpression(expression)) {
    // Top-level Kubernetes documents should always be objects; fall back to type assertion otherwise.
  }
  const typeName = resource.typeName || 'KubernetesResource';
  return t.tsAsExpression(expression, t.tsTypeReference(t.identifier(typeName)));
}

function manifestArrayExpression(resources: ManifestResource[] = []): t.ArrayExpression {
  return t.arrayExpression(resources.map((resource) => manifestResourceToExpression(resource)));
}

function operatorEntryToExpression(entry: OperatorEntry): t.ObjectExpression {
  const properties: t.ObjectProperty[] = [];

  if (entry.default && entry.default.length > 0) {
    properties.push(t.objectProperty(t.identifier('default'), manifestArrayExpression(entry.default)));
  }

  if (entry.versions) {
    const versionProps = Object.entries(entry.versions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([version, resources]) =>
        t.objectProperty(literalKey(version), manifestArrayExpression(resources))
      );

    if (versionProps.length > 0) {
      properties.push(t.objectProperty(t.identifier('versions'), t.objectExpression(versionProps)));
    }
  }

  return t.objectExpression(properties);
}

function buildModuleAst(map: Record<string, OperatorEntry>): t.File {
  const body: t.Statement[] = [];

  const sortedTypeNames = Array.from(referencedTypeNames).sort();
  if (sortedTypeNames.length > 0) {
    const typeSpecifiers = sortedTypeNames.map((name) =>
      t.importSpecifier(t.identifier(name), t.identifier(name))
    );
    const interwebImport = t.importDeclaration(typeSpecifiers, t.stringLiteral('@interweb/interwebjs'));
    interwebImport.importKind = 'type';
    body.push(interwebImport);
  }

  const typeImport = t.importDeclaration(
    [t.importSpecifier(t.identifier('KubernetesResource'), t.identifier('KubernetesResource'))],
    t.stringLiteral('../index')
  );
  typeImport.importKind = 'type';
  body.push(typeImport);

  const entryType = t.tsTypeAliasDeclaration(
    t.identifier('OperatorManifestEntry'),
    undefined,
    t.tsTypeLiteral([
      (() => {
        const signature = t.tsPropertySignature(t.identifier('default'));
        signature.optional = true;
        signature.typeAnnotation = t.tsTypeAnnotation(
          t.tsArrayType(t.tsTypeReference(t.identifier('KubernetesResource')))
        );
        return signature;
      })(),
      (() => {
        const signature = t.tsPropertySignature(t.identifier('versions'));
        signature.optional = true;
        signature.typeAnnotation = t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier('Record'),
            t.tsTypeParameterInstantiation([
              t.tsStringKeyword(),
              t.tsArrayType(t.tsTypeReference(t.identifier('KubernetesResource'))),
            ])
          )
        );
        return signature;
      })(),
    ])
  );

  const mapType = t.tsTypeAliasDeclaration(
    t.identifier('OperatorManifestsMap'),
    undefined,
    t.tsTypeReference(
      t.identifier('Record'),
      t.tsTypeParameterInstantiation([
        t.tsStringKeyword(),
        t.tsTypeReference(t.identifier('OperatorManifestEntry')),
      ])
    )
  );

  body.push(entryType, mapType);

  const manifestProperties = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([operatorName, entry]) =>
      t.objectProperty(literalKey(operatorName), operatorEntryToExpression(entry))
    );

  const manifestsExpression = t.objectExpression(manifestProperties);
  const declarator = t.variableDeclarator(t.identifier('operatorManifests'), manifestsExpression);
  (declarator.id as t.Identifier).typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(t.identifier('OperatorManifestsMap'))
  );
  const manifestDeclaration = t.variableDeclaration('const', [declarator]);
  const exportDecl = t.exportNamedDeclaration(manifestDeclaration, []);
  body.push(exportDecl);
  body.push(t.exportDefaultDeclaration(t.identifier('operatorManifests')));

  const program = t.program(body, [], 'module');
  const file = t.file(program);
  const comment = `* This file is auto-generated by scripts/codegen-operators.ts\n * Do not edit directly.`;
  if (program.body.length > 0) {
    program.body[0].leadingComments = [
      {
        type: 'CommentBlock',
        value: comment,
      },
    ];
  }
  return file;
}

function main() {
  const operators = collectOperators();
  ensureDir(OUTPUT_DIR);
  const ast = buildModuleAst(operators);
  const { code } = generate(ast, {
    retainLines: false,
    compact: false,
    jsescOption: { minimal: true },
  });
  const banner = '// Auto-generated file. Run `npm run codegen` inside @interweb/manifests to regenerate.\n\n';
  fs.writeFileSync(OUTPUT_FILE, banner + code + '\n');
  console.log(`Generated ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
}

main();
