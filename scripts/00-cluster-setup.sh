#!/bin/bash

set -euo pipefail

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a namespace exists
namespace_exists() {
    kubectl get namespace "$1" &> /dev/null
}

# Function to check if a Helm release exists
release_exists() {
    helm list --namespace "$1" -q | grep -w "$2" &> /dev/null 2>&1
}

# Function to wait for pods to be ready
wait_for_pods() {
    local namespace=$1
    local timeout=${2:-300}
    
    log $BLUE "Waiting for pods in namespace '$namespace' to be ready..."
    kubectl wait --for=condition=Ready pods --all -n "$namespace" --timeout=${timeout}s
}

# Check prerequisites
check_prerequisites() {
    log $BLUE "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists kubectl; then
        missing_tools+=("kubectl")
    fi
    
    if ! command_exists helm; then
        missing_tools+=("helm")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log $RED "Missing required tools: ${missing_tools[*]}"
        log $YELLOW "Please install the missing tools and try again."
        exit 1
    fi
    
    # Check if kubectl can connect to cluster
    if ! kubectl cluster-info &> /dev/null; then
        log $RED "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    
    log $GREEN "Prerequisites check passed!"
}

# Install ingress controller
setup_ingress() {
    log $BLUE "Setting up NGINX Ingress Controller..."
    
    # Check for existing ingress installations (multiple possible configurations)
    local ingress_exists=false
    
    # Check for existing nginx-ingress in ingress namespace (your setup)
    if namespace_exists ingress && release_exists ingress nginx-ingress; then
        log $YELLOW "NGINX Ingress Controller (nginx-ingress) is already installed in 'ingress' namespace. Skipping..."
        ingress_exists=true
    fi
    
    # Check for existing ingress-nginx in ingress-nginx namespace (standard setup)
    if namespace_exists ingress-nginx && release_exists ingress-nginx ingress-nginx; then
        log $YELLOW "NGINX Ingress Controller (ingress-nginx) is already installed in 'ingress-nginx' namespace. Skipping..."
        ingress_exists=true
    fi
    
    if [ "$ingress_exists" = true ]; then
        return
    fi
    
    # If no ingress exists, install using the standard configuration
    log $BLUE "No existing ingress controller found. Installing..."
    
    # Add Helm repo
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    
    # Install ingress controller (using same namespace as your existing setup)
    helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.metrics.enabled=true \
        --set controller.podAnnotations."prometheus\.io/scrape"="true" \
        --set controller.podAnnotations."prometheus\.io/port"="10254" \
        --wait
    
    log $GREEN "NGINX Ingress Controller installed successfully!"
}

# Install cert-manager
setup_cert_manager() {
    log $BLUE "Setting up cert-manager..."
    
    if namespace_exists cert-manager && release_exists cert-manager cert-manager; then
        log $YELLOW "cert-manager is already installed. Skipping..."
        return
    fi
    
    # Add Helm repo
    helm repo add jetstack https://charts.jetstack.io --force-update
    helm repo update
    
    # Install cert-manager (using same version as your existing setup)
    helm upgrade --install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --version v1.17.0 \
        --set installCRDs=true \
        --set global.leaderElection.namespace=cert-manager \
        --set prometheus.enabled=false \
        --wait
    
    log $GREEN "cert-manager installed successfully!"
}

# Setup basic monitoring (optional)
setup_monitoring() {
    log $BLUE "Setting up basic monitoring with Prometheus..."
    
    if namespace_exists monitoring && release_exists monitoring kube-prometheus-stack; then
        log $YELLOW "Monitoring stack is already installed. Skipping..."
        return
    fi
    
    # Add Helm repo
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    
    # Install monitoring stack
    helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set prometheus.prometheusSpec.retention=7d \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=10Gi \
        --set grafana.adminPassword=admin \
        --set grafana.persistence.enabled=true \
        --set grafana.persistence.size=5Gi \
        --wait
    
    log $GREEN "Monitoring stack installed successfully!"
    log $YELLOW "Grafana admin password: admin"
}

# Main function
main() {
    log $BLUE "=== Kubernetes Cluster Setup for PostgreSQL + Knative Stack ==="
    
    check_prerequisites
    setup_ingress
    setup_cert_manager
    
    # Ask if user wants monitoring
    read -p "Do you want to install monitoring stack (Prometheus/Grafana)? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_monitoring
    fi
    
    log $GREEN "=== Cluster setup completed successfully! ==="
    log $BLUE "You can now proceed with operator installation using 01-install-operators.sh"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 