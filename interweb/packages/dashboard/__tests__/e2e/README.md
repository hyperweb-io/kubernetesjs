# E2E Tests

This directory contains end-to-end tests for the Kubernetes Dashboard.

## Test Structure

### Workflow Tests
- `workflow-operator-database-focused.spec.ts` - Complete operator installation and database management workflow
- `workflow-deployment-lifecycle.spec.ts` - Complete deployment lifecycle management workflow

### Component Tests
- `deployments.spec.ts` - Basic deployments page functionality
- `operators.spec.ts` - Basic operators page functionality
- `databases.spec.ts` - Database management functionality
- `namespaces.spec.ts` - Namespace management functionality
- `admin.spec.ts` - Admin dashboard functionality
- `dashboard.spec.ts` - Main dashboard functionality
- `accessibility.spec.ts` - Accessibility compliance tests

### Utilities
- `utils/workflow-helpers.ts` - Helper functions for workflow tests
- `utils/deployment-helpers.ts` - Helper functions for deployment lifecycle tests
- `utils/page-objects.ts` - Page object models
- `utils/page-verification.ts` - Page verification utilities
- `utils/test-helpers.ts` - General test utilities

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run specific workflow
npm run test:e2e -- --grep "Workflow 1"
npm run test:e2e -- --grep "Workflow 2"

# Run component tests
npm run test:e2e -- --grep "Deployments E2E Tests"
```

## Test Configuration

- Global setup: `global-setup.ts`
- Global teardown: `global-teardown.ts`
- Test setup: `setup.ts`
