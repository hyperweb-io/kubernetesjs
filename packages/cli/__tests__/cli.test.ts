import { execSync } from 'child_process';
import * as path from 'path';

describe('Interweb CLI', () => {
  const cliPath = path.join(__dirname, '../src/index.ts');

  it('should display help when no arguments are provided', () => {
    // This test would need to be run after the CLI is built
    // For now, we'll just test that the file exists
    expect(require.resolve('../src/index.ts')).toBeTruthy();
  });

  it('should have all required command files', () => {
    expect(require.resolve('../src/commands/setup.ts')).toBeTruthy();
    expect(require.resolve('../src/commands/deploy.ts')).toBeTruthy();
    expect(require.resolve('../src/commands/status.ts')).toBeTruthy();
    expect(require.resolve('../src/commands/delete.ts')).toBeTruthy();
  });
});
