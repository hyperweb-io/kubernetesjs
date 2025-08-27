# interweb

Modern pnpm workspace with tsc-only builds, Jest tests, and Lerna for interdependent publishing.

Packages
- @pagebond/my-first
- @pagebond/my-second (depends on @pagebond/my-first)
- @pagebond/my-third (directory: packages/my-thid; depends on @pagebond/my-first and @pagebond/my-second)

Prerequisites
- pnpm installed (see "packageManager" in root package.json)

Install
- pnpm install

Build, Test, Clean, Lint
- Build all: pnpm -r build
- Test all: pnpm -r test
- Clean all: pnpm -r clean
- Lint: pnpm eslint .

Internal Dependencies (workspace protocol)
- Use workspace:^ in package.json:
  - "dependencies": { "@pagebond/my-first": "workspace:^" }
- Behavior:
  - During development, pnpm links internal packages locally.
  - On publish, real semver versions are written and packages are published in topological order by Lerna.

Lerna Publishing Workflow
We use Lerna for interdependent publishing; pnpm -r is used for build/test/lint.

1) Ensure builds and tests pass
- pnpm install
- pnpm -r build
- pnpm -r test

2) Version packages with changes
- Independent versioning (recommended):
  - lerna version
- Fixed versioning (single version across repo):
  - lerna version --conventional-commits
- Useful dry-run flags:
  - lerna version --no-git-tag-version --no-push
Notes:
- Lerna detects changed packages and bumps versions.
- Internal workspace:^ ranges are updated automatically.
- Without dry-run flags, commits and tags are created.

3) Publish changed packages
- After versioning/tags:
  - lerna publish from-package
- Dry run:
  - lerna publish from-package --dry-run
- Canary/pre-release (optional):
  - lerna publish prerelease --dist-tag next

Types and Build Outputs
- Builds are tsc-only (CJS/ESM as configured per package) and output to dist/
- .d.ts are emitted to dist/ and package.json "main"/"types" point to dist
- Build scripts copy LICENSE/README/package.json via cpy

Troubleshooting
- ESLint linting dist:
  - Flat config ignores **/dist/** and **/node_modules/** at the top level
- Interdependent publishing:
  - Ensure internal deps use workspace:^
  - Run lerna version before lerna publish from-package
  - Configure publishConfig/access per package if publishing public packages
- Dependency warnings:
  - Deprecated glob versions are overridden to glob@11 via pnpm.overrides at root

Common Commands
- Install: pnpm install
- Build all: pnpm -r build
- Test all: pnpm -r test
- Clean all: pnpm -r clean
- Lint: pnpm eslint .
- Lerna dry-run version: lerna version --no-git-tag-version --no-push
- Lerna dry-run publish: lerna publish from-package --dry-run
