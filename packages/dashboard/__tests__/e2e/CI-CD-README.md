# E2E CI/CD Integration

This document describes the CI/CD integration for E2E tests using GitHub Actions, Kind clusters, and cluster state verification.

## Overview

The CI/CD pipeline provides:
- **Kind Cluster Setup**: Automated Kubernetes cluster creation
- **E2E Test Execution**: Playwright tests against live cluster
- **Cluster State Verification**: API-based validation using client/interwebjs
- **Resource Cleanup**: Automatic cleanup of test resources

## Workflow Structure

### 1. Setup Cluster Job
- Creates a Kind cluster with unique name
- Sets up kubectl and cluster context
- Verifies cluster connectivity

### 2. E2E Workflow Tests
- **Operator Database Workflow**: Tests operator installation and database management
- **Deployment Lifecycle Workflow**: Tests deployment creation, management, and deletion

### 3. E2E Component Tests
- **Deployments**: Basic deployment functionality
- **Operators**: Operator management features
- **Databases**: Database operations
- **Namespaces**: Namespace management
- **Admin**: Admin dashboard features

### 4. E2E Accessibility Tests
- **Accessibility Compliance**: WCAG compliance testing

### 5. Cleanup Job
- Removes Kind cluster
- Cleans up all test resources

## Test Execution

### Manual Trigger
```bash
# Run all tests
gh workflow run test-e2e-dashboard.yml

# Run specific test type
gh workflow run test-e2e-dashboard.yml -f test_type=workflow
gh workflow run test-e2e-dashboard.yml -f test_type=component
gh workflow run test-e2e-dashboard.yml -f test_type=accessibility
```

### Local Execution
```bash
# Setup Kind cluster
kind create cluster --name dashboard-e2e

# Start kubectl proxy
kubectl proxy --port=8001 &

# Run tests
cd packages/dashboard
pnpm test:e2e
```

## Cluster State Verification

The tests include dual verification:
1. **UI Verification**: Playwright tests verify UI behavior
2. **API Verification**: Direct Kubernetes API calls verify cluster state

### Verification Functions
- `verifyClusterState()`: Validates expected cluster state
- `waitForDeploymentReady()`: Waits for deployment readiness
- `waitForPodReady()`: Waits for pod readiness
- `cleanupResources()`: Cleans up test resources

## Configuration

### Environment Variables
- `K8S_API`: Kubernetes API endpoint (default: http://localhost:8001)
- `NODE_ENV`: Environment (test)
- `CI`: CI mode flag

### Test Timeouts
- Deployment timeout: 5 minutes
- Pod ready timeout: 5 minutes
- Cluster verification timeout: 1 minute

## Artifacts

The pipeline generates:
- **Test Results**: JSON and JUnit XML reports
- **Screenshots**: Failure screenshots
- **Videos**: Test execution videos
- **Traces**: Playwright traces for debugging

## Monitoring

### Success Criteria
- All tests pass
- Cluster state matches expectations
- Resources are properly cleaned up

### Failure Handling
- Screenshots on failure
- Cluster state dumps
- Resource cleanup on failure

## Best Practices

### Test Design
- Use unique resource names with timestamps
- Test in isolated namespaces
- Clean up resources after tests

### CI/CD Optimization
- Parallel test execution
- Artifact caching
- Resource limits

### Debugging
- Enable trace recording
- Save screenshots on failure
- Dump cluster state on failure

## Troubleshooting

### Common Issues
1. **Cluster Connection**: Verify kubectl proxy is running
2. **Resource Cleanup**: Check for stuck resources
3. **Timeout Issues**: Increase timeout values

### Debug Commands
```bash
# Check cluster status
kubectl get nodes
kubectl get namespaces
kubectl get pods -A

# Check test resources
kubectl get deployments -A
kubectl get services -A
kubectl get configmaps -A
```

## Integration with client/interwebjs

The tests use the client library for:
- Direct API calls to Kubernetes
- Resource state verification
- Cluster health checks
- Resource cleanup operations

This ensures that UI behavior matches actual cluster state.
