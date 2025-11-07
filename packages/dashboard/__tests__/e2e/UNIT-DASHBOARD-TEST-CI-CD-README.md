# Dashboard Unit Test CI/CD Integration

This document describes the CI/CD integration for dashboard unit tests and other package tests.

## Overview

The CI/CD pipeline provides comprehensive testing coverage:
- **Unit Tests**: Component and function-level testing
- **Integration Tests**: API and service integration testing
- **E2E Tests**: End-to-end workflow testing with Kind clusters
- **Coverage Reports**: Code coverage analysis and reporting

## Workflow Structure

### 1. Dashboard Unit Tests (`test-unit-dashboard.yml`)
**Primary Focus**: Dashboard React components, hooks, and utilities
**Secondary**: Other packages when "all" option is selected
- **Dashboard**: React components, hooks, and utilities (always runs)
- **Client**: Kubernetes client functions and utilities (when "all" selected)
- **Manifests**: Kubernetes manifest generation and validation (when "all" selected)
- **InterwebJS**: Core JavaScript utilities (when "all" selected)
- **CLI**: Command-line interface functions (when "all" selected)

### 2. Integration Tests (`test-comprehensive.yml`)
Tests package interactions and API integrations:
- **Client Integration**: Tests with real Kubernetes API
- **Cross-package Dependencies**: Tests package interactions

### 3. E2E Tests (`test-e2e-dashboard.yml`)
Tests complete user workflows:
- **Operator Database Workflow**: Full operator installation and database management
- **Deployment Lifecycle Workflow**: Complete deployment management workflow
- **Component Tests**: Individual page and feature testing
- **Accessibility Tests**: WCAG compliance testing

## Test Execution

### Manual Trigger
```bash
# Run dashboard unit tests only (default)
gh workflow run test-unit-dashboard.yml

# Run all package unit tests
gh workflow run test-unit-dashboard.yml -f test_package=all

# Run comprehensive test suite
gh workflow run test-comprehensive.yml

# Run specific test level
gh workflow run test-comprehensive.yml -f test_level=unit
gh workflow run test-comprehensive.yml -f test_level=e2e
```

### Local Execution
```bash
# Run unit tests locally
cd packages/dashboard/__tests__/e2e
./test-unit-dashboard-locally.sh

# Run E2E tests locally
cd packages/dashboard/__tests__/e2e
./test-ci-locally.sh
```

## Test Configuration

### Unit Test Configuration
Each package has its own Jest configuration:
- **Dashboard**: Next.js + React Testing Library
- **Client**: Node.js environment with Kubernetes API mocking
- **Manifests**: Node.js environment for manifest validation
- **InterwebJS**: Node.js environment for utility functions
- **CLI**: Node.js environment for command-line functions

### Coverage Requirements
- **Minimum Coverage**: 80% for new code
- **Coverage Reports**: Uploaded to Codecov
- **Coverage Flags**: Separate flags for each package

### Test Environment Variables
- `CI=true`: Enables CI-specific test behavior
- `NODE_ENV=test`: Sets test environment
- `K8S_API`: Kubernetes API endpoint for integration tests

## Package-Specific Testing

### Dashboard Package
```bash
cd packages/dashboard
pnpm test                    # Run all tests
pnpm test --coverage        # Run with coverage
pnpm test --watch          # Run in watch mode
```

**Test Types:**
- Component tests (React Testing Library)
- Hook tests (Custom hooks)
- Utility function tests
- API route tests
- Page component tests

### Client Package
```bash
cd packages/client
pnpm tests:unit            # Run unit tests
pnpm tests:integration     # Run integration tests
pnpm tests:e2e            # Run E2E tests
```

**Test Types:**
- Unit tests (Individual functions)
- Integration tests (API interactions)
- E2E tests (Full workflows)

### Other Packages
```bash
cd packages/[package-name]
pnpm test                  # Run all tests
pnpm test --coverage      # Run with coverage
```

## CI/CD Features

### Parallel Execution
- Unit tests run in parallel across packages
- E2E tests run in parallel across browsers
- Integration tests run after unit tests

### Artifact Management
- Test results uploaded as artifacts
- Coverage reports uploaded to Codecov
- Screenshots and videos for failed E2E tests
- Trace files for debugging

### Failure Handling
- Failed tests don't stop other tests
- Detailed error reporting
- Screenshots and videos on failure
- Trace files for debugging

### Notifications
- GitHub status checks
- Test summary in PR comments
- Coverage reports in Codecov
- Artifact downloads for debugging

## Best Practices

### Test Organization
- Unit tests in `__tests__/` directories
- Integration tests separate from unit tests
- E2E tests in dedicated directories
- Mock external dependencies

### Test Naming
- Use descriptive test names
- Group related tests with `describe`
- Use `it` for individual test cases
- Include test type in file names

### Coverage Goals
- Aim for 80%+ coverage
- Focus on critical paths
- Test edge cases and error conditions
- Maintain coverage as code changes

### Performance
- Keep unit tests fast (< 1s per test)
- Use parallel execution
- Mock expensive operations
- Clean up after tests

## Troubleshooting

### Common Issues
1. **Test Timeouts**: Increase timeout values
2. **Coverage Issues**: Check test file patterns
3. **Mock Issues**: Verify mock implementations
4. **Environment Issues**: Check environment variables

### Debug Commands
```bash
# Run specific test file
pnpm test -- --testPathPattern=component.test.tsx

# Run tests in debug mode
pnpm test -- --detectOpenHandles --forceExit

# Run with verbose output
pnpm test -- --verbose

# Run coverage for specific files
pnpm test -- --coverage --collectCoverageFrom="src/**/*.ts"
```

### CI Debugging
1. Check workflow logs in GitHub Actions
2. Download artifacts for detailed analysis
3. Use trace files for E2E test debugging
4. Check coverage reports in Codecov

## Integration with Development Workflow

### Pre-commit Hooks
- Run unit tests before commit
- Check coverage thresholds
- Lint and format code

### PR Requirements
- All tests must pass
- Coverage must not decrease
- New code must have tests
- E2E tests must pass

### Release Process
- Run full test suite
- Generate coverage reports
- Update documentation
- Tag releases with test results
