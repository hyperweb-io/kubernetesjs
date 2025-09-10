#!/bin/bash

# Local testing script for client package against Kind cluster
# Usage: ./scripts/test-client-local.sh [test-file]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLIENT_DIR="$PROJECT_ROOT/packages/client"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ERROR: $1${NC}"
}

cleanup() {
    log "Cleaning up..."
    
    # Kill kubectl proxy if running
    if [ ! -z "$PROXY_PID" ] && kill -0 $PROXY_PID 2>/dev/null; then
        log "Stopping kubectl proxy (PID: $PROXY_PID)"
        kill $PROXY_PID
    fi
    
    # Kill any remaining kubectl proxy processes
    pkill -f "kubectl proxy" || true
    
    # Optionally delete kind cluster
    if [ "$CLEANUP_CLUSTER" = "true" ]; then
        log "Deleting Kind cluster..."
        kind delete cluster --name kind-test-local || true
    fi
}

# Set up cleanup trap
trap cleanup EXIT

# Parse arguments
TEST_FILE="$1"
CLEANUP_CLUSTER="${CLEANUP_CLUSTER:-false}"

log "Starting local client testing setup..."

# Check dependencies
if ! command -v kind &> /dev/null; then
    error "kind is not installed. Please install it: https://kind.sigs.k8s.io/docs/user/quick-start/"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    error "kubectl is not installed. Please install it."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    error "pnpm is not installed. Please install it."
    exit 1
fi

# Create or use existing Kind cluster
CLUSTER_NAME="kind-test-local"
if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
    log "Using existing Kind cluster: $CLUSTER_NAME"
else
    log "Creating Kind cluster: $CLUSTER_NAME"
    # Use --image flag to specify Kubernetes version if needed
    # kind create cluster --name "$CLUSTER_NAME" --image kindest/node:v1.31.3 --wait 300s
    kind create cluster --name "$CLUSTER_NAME" --wait 300s
fi

# Verify cluster
log "Verifying cluster connection..."
kubectl cluster-info --context "kind-${CLUSTER_NAME}"
kubectl get nodes

# Build packages
log "Building packages..."
cd "$PROJECT_ROOT"
pnpm install --frozen-lockfile
pnpm build

# Start kubectl proxy
log "Starting kubectl proxy..."
kubectl proxy --port=8001 --accept-hosts='^.*$' --address='0.0.0.0' &
PROXY_PID=$!

# Wait for proxy to be ready
log "Waiting for kubectl proxy to be ready..."
for i in {1..10}; do
    if curl -f http://localhost:8001/api/v1/namespaces > /dev/null 2>&1; then
        log "kubectl proxy is ready after $i attempts"
        break
    fi
    warn "Waiting for kubectl proxy... attempt $i/10"
    sleep 2
done

# Final check
if ! curl -f http://localhost:8001/api/v1/namespaces > /dev/null 2>&1; then
    error "kubectl proxy failed to start properly"
    exit 1
fi

# Run tests
cd "$CLIENT_DIR"
export K8S_API="http://127.0.0.1:8001"
export NODE_ENV="test"

if [ -n "$TEST_FILE" ]; then
    if [ -f "__tests__/$TEST_FILE" ]; then
        log "Running specific test: $TEST_FILE"
        pnpm test -- "__tests__/$TEST_FILE" --verbose
    else
        error "Test file __tests__/$TEST_FILE not found"
        exit 1
    fi
else
    log "Running all client tests..."
    pnpm test
fi

log "Tests completed successfully!"

# Show cluster state
log "Final cluster state:"
echo "=== Namespaces ==="
kubectl get namespaces
echo "=== Recent Events ==="
kubectl get events --all-namespaces --sort-by='.lastTimestamp' | tail -10
