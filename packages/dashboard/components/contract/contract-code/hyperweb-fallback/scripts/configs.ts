export interface BuildConfig {
  entryFile: string;
  outFile: string;
  externalPackages: string[];
}

export const configs: BuildConfig[] = [
  {
    entryFile: "src/simple-state/index.ts",
    outFile: "dist/contracts/simpleState.js",
    externalPackages: ["otherpackage", "~somepackage"],
  },
];
