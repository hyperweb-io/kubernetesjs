# Publishing Guide

## Quick Publishing Workflow

### 1. Prepare
```bash
pnpm install
pnpm -r build
pnpm -r test
```

### 2. Version
```bash
# Independent versioning (recommended)
pnpm lerna version

# Or fixed versioning
pnpm lerna version --conventional-commits
```

### 3. Publish

use `from-package` option

```bash
pnpm lerna publish from-package
```

## Dry Run Commands
```bash
# Test versioning (no git operations)
pnpm lerna version --no-git-tag-version --no-push

# Test publishing
pnpm lerna publish from-package --dry-run
```

## One-liner for Full Workflow
```bash
pnpm install && pnpm -r build && pnpm -r test && lerna version && lerna publish from-package
``` 