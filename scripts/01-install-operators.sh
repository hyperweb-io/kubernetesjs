#!/bin/bash

set -euo pipefail

# Parse command line arguments
KNATIVE_ONLY=false
if [[ "${1:-}" == "--knative-only" ]]; then
    KNATIVE_ONLY=true
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
log() {
    local color=$1
    shift
    echo -e "${color}$*${NC}"
}

# Function to check if a namespace exists
namespace_exists() {
    kubectl get namespace "$1" &> /dev/null
}

# Function to check if a CRD exists
crd_exists() {
    kubectl get crd "$1" &> /dev/null
}

# Function to wait for CRDs to be established
wait_for_crds() {
    local crds=("$@")
    local timeout=300
    local interval=5
    local elapsed=0
    
    log $BLUE "Waiting for CRDs to be established..."
    
    for crd in "${crds[@]}"; do
        while ! crd_exists "$crd"; do
            if [ $elapsed -ge $timeout ]; then
                log $RED "Timeout waiting for CRD: $crd"
                exit 1
            fi
            sleep $interval
            elapsed=$((elapsed + interval))
        done
        log $GREEN "CRD established: $crd"
    done
}

# Function to wait for pods to be ready
wait_for_pods() {
    local namespace=$1
    local timeout=${2:-300}
    
    log $BLUE "Waiting for pods in namespace '$namespace' to be ready..."
    kubectl wait --for=condition=Ready pods --all -n "$namespace" --timeout=${timeout}s
}

# Install CloudNativePG operator
install_cloudnative_pg() {
    log $BLUE "Installing CloudNativePG operator..."
    
    if namespace_exists cnpg-system; then
        log $YELLOW "CloudNativePG operator appears to be already installed. Checking..."
        if kubectl get deployment -n cnpg-system cnpg-controller-manager &> /dev/null; then
            log $YELLOW "CloudNativePG operator is already installed. Skipping..."
            return
        fi
    fi
    
    # Install the operator using the latest stable release
    local cnpg_version="1.25.2"
    log $BLUE "Installing CloudNativePG operator version $cnpg_version..."
    
    kubectl apply --server-side -f \
        "https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.25/releases/cnpg-${cnpg_version}.yaml"
    
    # Wait for CRDs to be established
    wait_for_crds \
        "clusters.postgresql.cnpg.io" \
        "backups.postgresql.cnpg.io" \
        "scheduledbackups.postgresql.cnpg.io" \
        "databases.postgresql.cnpg.io" \
        "poolers.postgresql.cnpg.io"
    
    # Wait for operator pods to be ready
    wait_for_pods cnpg-system
    
    log $GREEN "CloudNativePG operator installed successfully!"
}

# Install Knative Serving
install_knative_serving() {
    log $BLUE "Installing Knative Serving..."
    
    if namespace_exists knative-serving; then
        log $YELLOW "Knative Serving appears to be already installed. Checking..."
        if kubectl get deployment -n knative-serving controller &> /dev/null; then
            log $YELLOW "Knative Serving is already installed. Skipping..."
            return
        fi
    fi
    
    # Install Knative Serving CRDs
    local knative_version="v1.15.0"
    log $BLUE "Installing Knative Serving CRDs version $knative_version..."
    
    kubectl apply -f \
        "https://github.com/knative/serving/releases/download/knative-${knative_version}/serving-crds.yaml"
    
    # Wait for CRDs to be established
    wait_for_crds \
        "services.serving.knative.dev" \
        "configurations.serving.knative.dev" \
        "routes.serving.knative.dev" \
        "revisions.serving.knative.dev"
    
    # Install Knative Serving core
    kubectl apply -f \
        "https://github.com/knative/serving/releases/download/knative-${knative_version}/serving-core.yaml"
    
    # Wait for core components to be ready
    wait_for_pods knative-serving
    
    # Install Knative Kourier networking layer
    log $BLUE "Installing Knative Kourier networking layer..."
    kubectl apply -f \
        "https://github.com/knative/net-kourier/releases/download/knative-${knative_version}/kourier.yaml"
    
    # Configure Knative to use Kourier
    kubectl patch configmap/config-network \
        --namespace knative-serving \
        --type merge \
        --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
    
    # Wait for Kourier to be ready
    wait_for_pods kourier-system
    
    # Configure domain for Knative services (using nip.io for local development)
    log $BLUE "Configuring Knative domain..."
    kubectl patch configmap/config-domain \
        --namespace knative-serving \
        --type merge \
        --patch '{"data":{"127.0.0.1.nip.io":""}}'
    
    log $GREEN "Knative Serving installed successfully!"
}

# Install Knative CLI (optional)
install_kn_cli() {
    if command -v kn >/dev/null 2>&1; then
        log $YELLOW "Knative CLI (kn) is already installed. Skipping..."
        return
    fi
    
    log $BLUE "Installing Knative CLI (kn)..."
    
    # Detect OS and architecture
    local os
    local arch
    
    case "$(uname -s)" in
        Darwin*) os="darwin" ;;
        Linux*) os="linux" ;;
        *) 
            log $YELLOW "Unsupported OS for automatic kn installation. Please install manually."
            return
            ;;
    esac
    
    case "$(uname -m)" in
        x86_64) arch="amd64" ;;
        arm64|aarch64) arch="arm64" ;;
        *)
            log $YELLOW "Unsupported architecture for automatic kn installation. Please install manually."
            return
            ;;
    esac
    
    local kn_version="v1.15.0"
    local kn_url="https://github.com/knative/client/releases/download/knative-${kn_version}/kn-${os}-${arch}"
    
    # Download and install kn
    curl -L "$kn_url" -o /tmp/kn
    chmod +x /tmp/kn
    
    # Try to move to a directory in PATH
    if [ -w "/usr/local/bin" ]; then
        sudo mv /tmp/kn /usr/local/bin/
    elif [ -w "$HOME/.local/bin" ]; then
        mkdir -p "$HOME/.local/bin"
        mv /tmp/kn "$HOME/.local/bin/"
        log $YELLOW "kn installed to $HOME/.local/bin/. Make sure this directory is in your PATH."
    else
        mv /tmp/kn ./kn
        log $YELLOW "kn downloaded to current directory. Please move it to a directory in your PATH."
    fi
    
    log $GREEN "Knative CLI (kn) installed successfully!"
}

# Verify installations
verify_installations() {
    log $BLUE "Verifying installations..."
    
    # Check CloudNativePG
    if kubectl get pods -n cnpg-system | grep -q Running; then
        log $GREEN "✓ CloudNativePG operator is running"
    else
        log $RED "✗ CloudNativePG operator is not running properly"
    fi
    
    # Check Knative Serving
    if kubectl get pods -n knative-serving | grep -q Running; then
        log $GREEN "✓ Knative Serving is running"
    else
        log $RED "✗ Knative Serving is not running properly"
    fi
    
    # Check Kourier
    if kubectl get pods -n kourier-system | grep -q Running; then
        log $GREEN "✓ Knative Kourier networking is running"
    else
        log $RED "✗ Knative Kourier networking is not running properly"
    fi
    
    log $BLUE "Installation verification completed!"
}

# Main function
main() {
    if [[ "$KNATIVE_ONLY" == "true" ]]; then
        log $BLUE "=== Installing Knative Serving Only ==="
    else
        log $BLUE "=== Installing Operators for PostgreSQL + Knative Stack ==="
    fi
    
    if [[ "$KNATIVE_ONLY" != "true" ]]; then
        install_cloudnative_pg
    fi
    install_knative_serving
    
    # Ask if user wants to install Knative CLI
    read -p "Do you want to install Knative CLI (kn)? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_kn_cli
    fi
    
    verify_installations
    
    if [[ "$KNATIVE_ONLY" == "true" ]]; then
        log $GREEN "=== Knative installation completed successfully! ==="
        log $BLUE "You can now proceed with raw PostgreSQL deployment using 'make deploy-postgres-raw'"
    else
        log $GREEN "=== Operator installation completed successfully! ==="
        log $BLUE "You can now proceed with PostgreSQL deployment using 02-deploy-postgres.sh"
    fi
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 