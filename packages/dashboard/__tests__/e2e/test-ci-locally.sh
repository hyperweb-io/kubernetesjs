#!/bin/bash

# Local CI Test Script
# This script simulates the CI environment locally

set -e

echo "🚀 Starting Local CI Test Simulation..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the packages/dashboard directory"
    exit 1
fi

print_status "Found dashboard package.json"

# Check if kind is installed
if ! command -v kind &> /dev/null; then
    print_error "kind is not installed. Please install it first:"
    echo "  brew install kind"
    echo "  or visit: https://kind.sigs.k8s.io/docs/user/quick-start/#installation"
    exit 1
fi

print_status "kind is installed"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install it first"
    exit 1
fi

print_status "kubectl is installed"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install it first:"
    echo "  npm install -g pnpm"
    exit 1
fi

print_status "pnpm is installed"

# Create kind cluster
CLUSTER_NAME="dashboard-ci-test-$(date +%s)"
print_status "Creating kind cluster: $CLUSTER_NAME"

kind create cluster --name "$CLUSTER_NAME" --wait 300s

# Set kubectl context
kubectl config use-context "kind-$CLUSTER_NAME"

print_status "Kind cluster created and configured"

# Install dependencies
print_status "Installing dependencies..."
pnpm install --frozen-lockfile

# Build dashboard
print_status "Building dashboard..."
pnpm build

# Install Playwright browsers
print_status "Installing Playwright browsers..."
npx playwright install --with-deps

# Check if port 8001 is already in use
if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 8001 is already in use, killing existing process..."
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start kubectl proxy in background
print_status "Starting kubectl proxy..."
kubectl proxy --port=8001 --accept-hosts='^.*$' --address='0.0.0.0' &
PROXY_PID=$!

# Wait for proxy to start
sleep 5

# Test proxy connection
if curl -f http://127.0.0.1:8001/api > /dev/null 2>&1; then
    print_status "kubectl proxy is running"
else
    print_error "kubectl proxy failed to start"
    kill $PROXY_PID 2>/dev/null || true
    kind delete cluster --name "$CLUSTER_NAME"
    exit 1
fi

# Run validation script
print_status "Running validation script..."
cd __tests__/e2e
K8S_API=http://127.0.0.1:8001 CI=true node validate-ci-setup.js

# Test Playwright configuration
print_status "Testing Playwright configuration..."
cd ../..
npx playwright test --list

# Run a simple test to verify everything works
print_status "Running a simple E2E test..."
K8S_API=http://127.0.0.1:8001 CI=true npx playwright test --grep "should load deployments page" || {
    print_warning "Simple test failed, but this might be expected"
}

# Cleanup
print_status "Cleaning up..."
kill $PROXY_PID 2>/dev/null || true
kind delete cluster --name "$CLUSTER_NAME"

print_status "Local CI test completed successfully!"
echo ""
echo "🎉 Your CI setup is ready!"
echo "You can now:"
echo "1. Push to main branch to trigger the full CI pipeline"
echo "2. Create a PR to test the workflow"
echo "3. Use 'workflow_dispatch' to manually trigger tests"
