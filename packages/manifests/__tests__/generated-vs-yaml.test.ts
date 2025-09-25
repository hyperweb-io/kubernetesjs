import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';

import {
  OPERATOR_OBJECTS,
  OPERATOR_IDS,
  OPERATOR_VERSIONS,
  OPERATOR_MAP,
} from '../src/generated';

type K8s = { apiVersion?: string; kind?: string; metadata?: { name?: string; namespace?: string } };

function loadYamlDocsIfExists(file: string): K8s[] | undefined {
  if (!fs.existsSync(file)) return undefined;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const docs = (yaml.loadAll(raw) as K8s[]).filter((d) => d && typeof d === 'object');
    // codegen skips Namespace docs; align the comparison by filtering those out here too
    return docs.filter((d) => d.kind !== 'Namespace');
  } catch {
    return undefined;
  }
}

describe('@interweb/manifests generated artifacts', () => {
  it('exports consistent IDs and map shape', () => {
    const idsFromObjects = Object.keys(OPERATOR_OBJECTS).sort();
    const idsFromIds = (OPERATOR_IDS || []).slice().sort();
    expect(idsFromIds).toEqual(idsFromObjects);

    for (const id of idsFromObjects) {
      const mod = (OPERATOR_OBJECTS as any)[id];
      expect(mod).toBeDefined();
      expect(Array.isArray(mod.resources) || mod.resources === undefined).toBe(true);
      const mapEntry = (OPERATOR_MAP as any)[id];
      expect(mapEntry).toBeDefined();
      if (mod.resources) {
        expect(mapEntry.resources.length).toBe(mod.resources.length);
      }
      const versions = (OPERATOR_VERSIONS as any)[id] || [];
      expect(Array.isArray(mapEntry.versions)).toBe(true);
      expect(mapEntry.versions).toEqual(versions);
    }
  });

  it('generated.resources items have apiVersion/kind/metadata.name', () => {
    for (const id of Object.keys(OPERATOR_OBJECTS)) {
      const mod = (OPERATOR_OBJECTS as any)[id];
      if (!mod.resources) continue;
      for (const obj of mod.resources as K8s[]) {
        expect(obj.apiVersion).toBeTruthy();
        expect(obj.kind).toBeTruthy();
        expect(obj.metadata && obj.metadata.name).toBeTruthy();
      }
    }
  });

  it('parity with YAML (if operators/ is present)', () => {
    const operatorsDir = path.resolve(__dirname, '..', 'operators');
    const hasOperators = fs.existsSync(operatorsDir);
    if (!hasOperators) {
      console.info('operators/ not found; skipping YAML parity checks.');
      return;
    }

    for (const id of Object.keys(OPERATOR_OBJECTS)) {
      const unversioned = path.join(operatorsDir, `${id}.yaml`);
      const docs = loadYamlDocsIfExists(unversioned);
      if (!docs) continue; // skip if not available
      const mod = (OPERATOR_OBJECTS as any)[id];
      const genCount = (mod.resources ? mod.resources.length : 0);
      expect(genCount).toBeGreaterThan(0);
      expect(genCount).toBe(docs.length);
    }
  });
});

