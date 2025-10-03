#!/bin/bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

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

# Function to check if a resource exists
resource_exists() {
    kubectl get "$1" "$2" -n "$3" &> /dev/null 2>&1
}

# Function to wait for PostgreSQL cluster to be ready
wait_for_postgres_cluster() {
    local cluster_name=$1
    local namespace=$2
    local timeout=${3:-600}
    local interval=10
    local elapsed=0
    
    log $BLUE "Waiting for PostgreSQL cluster '$cluster_name' to be ready..."
    
    while true; do
        if kubectl get cluster "$cluster_name" -n "$namespace" -o jsonpath='{.status.phase}' 2>/dev/null | grep -q "Cluster in healthy state"; then
            log $GREEN "PostgreSQL cluster is ready!"
            break
        fi
        
        if [ $elapsed -ge $timeout ]; then
            log $RED "Timeout waiting for PostgreSQL cluster to be ready"
            log $YELLOW "Current cluster status:"
            kubectl get cluster "$cluster_name" -n "$namespace" -o wide
            exit 1
        fi
        
        log $YELLOW "Cluster not ready yet. Waiting... (${elapsed}s/${timeout}s)"
        sleep $interval
        elapsed=$((elapsed + interval))
    done
}

# Function to wait for pooler to be ready
wait_for_pooler() {
    local pooler_name=$1
    local namespace=$2
    local timeout=${3:-300}
    
    log $BLUE "Waiting for PgBouncer pooler '$pooler_name' to be ready..."
    
    kubectl wait --for=condition=Ready \
        pooler "$pooler_name" \
        -n "$namespace" \
        --timeout="${timeout}s"
    
    log $GREEN "PgBouncer pooler is ready!"
}

# Function to deploy namespaces
deploy_namespaces() {
    log $BLUE "Deploying namespaces..."
    
    kubectl apply -f "$PROJECT_DIR/manifests/namespace/postgres-namespace.yaml"
    
    log $GREEN "Namespaces deployed successfully!"
}

# Function to deploy secrets
deploy_secrets() {
    log $BLUE "Deploying PostgreSQL secrets..."
    
    # Check if secrets already exist
    if resource_exists secret postgres-superuser postgres-db; then
        log $YELLOW "PostgreSQL secrets already exist. Skipping secret creation..."
        log $YELLOW "If you need to update secrets, please delete them first and re-run this script."
    else
        kubectl apply -f "$PROJECT_DIR/manifests/postgres/01-secrets.yaml"
        log $GREEN "PostgreSQL secrets deployed successfully!"
    fi
}

# Function to deploy PostgreSQL cluster
deploy_postgres_cluster() {
    log $BLUE "Deploying PostgreSQL cluster..."
    
    if resource_exists cluster postgres-cluster postgres-db; then
        log $YELLOW "PostgreSQL cluster already exists. Skipping cluster creation..."
    else
        kubectl apply -f "$PROJECT_DIR/manifests/postgres/02-cluster.yaml"
        
        # Wait for cluster to be ready
        wait_for_postgres_cluster postgres-cluster postgres-db
        
        log $GREEN "PostgreSQL cluster deployed successfully!"
    fi
}

# Function to deploy connection pooler
deploy_pooler() {
    log $BLUE "Deploying PgBouncer connection pooler..."
    
    if resource_exists pooler postgres-pooler postgres-db; then
        log $YELLOW "PgBouncer pooler already exists. Skipping pooler creation..."
    else
        kubectl apply -f "$PROJECT_DIR/manifests/postgres/03-pooler.yaml"
        
        # Wait for pooler to be ready
        wait_for_pooler postgres-pooler postgres-db
        
        log $GREEN "PgBouncer pooler deployed successfully!"
    fi
}

# Function to verify deployment
verify_deployment() {
    log $BLUE "Verifying PostgreSQL deployment..."
    
    # Check cluster status
    log $BLUE "Checking cluster status..."
    kubectl get cluster postgres-cluster -n postgres-db -o wide
    
    # Check cluster pods
    log $BLUE "Checking cluster pods..."
    kubectl get pods -n postgres-db -l cnpg.io/cluster=postgres-cluster
    
    # Check services
    log $BLUE "Checking services..."
    kubectl get services -n postgres-db
    
    # Check pooler
    log $BLUE "Checking pooler status..."
    kubectl get pooler postgres-pooler -n postgres-db -o wide
    kubectl get pods -n postgres-db -l cnpg.io/poolerName=postgres-pooler
    
    # Test database connectivity
    log $BLUE "Testing database connectivity..."
    
    # Get the primary pod name
    local primary_pod=$(kubectl get pods -n postgres-db -l cnpg.io/cluster=postgres-cluster,cnpg.io/instanceRole=primary -o jsonpath='{.items[0].metadata.name}')
    
    if [ -n "$primary_pod" ]; then
        log $BLUE "Testing connection to primary pod: $primary_pod"
        
        # Test connection with psql
        if kubectl exec -it "$primary_pod" -n postgres-db -- psql -U postgres -c "SELECT version();" > /dev/null 2>&1; then
            log $GREEN "✓ Database connectivity test passed"
            
            # Show sample data
            log $BLUE "Showing sample tenant data..."
            kubectl exec "$primary_pod" -n postgres-db -- psql -U postgres -c "
                \echo '=== Tenant ACME Users ==='
                SELECT * FROM tenant_acme.users;
                \echo '=== Tenant BETA Users ==='
                SELECT * FROM tenant_beta.users;
            "
        else
            log $RED "✗ Database connectivity test failed"
        fi
    else
        log $RED "Could not find primary pod"
    fi
    
    # Test pooler connectivity
    log $BLUE "Testing pooler connectivity..."
    local pooler_service="postgres-pooler-rw.postgres-db.svc.cluster.local"
    
    # Create a temporary pod for testing
    kubectl run postgres-test --rm -i --restart=Never --image=postgres:16 -- \
        psql "postgresql://appuser:appuser123!@${pooler_service}:5432/postgres" \
        -c "SELECT 'Pooler connection successful!' as status;" || true
    
    log $GREEN "Verification completed!"
}

# Function to display connection information
display_connection_info() {
    log $BLUE "=== PostgreSQL Connection Information ==="
    
    cat << EOF
${GREEN}Direct Database Connection:${NC}
  Host: postgres-cluster-rw.postgres-db.svc.cluster.local
  Port: 5432
  Database: postgres
  Superuser: postgres / postgres123!
  App User: appuser / appuser123!

${GREEN}Pooled Connection (Recommended for Knative):${NC}
  Host: postgres-pooler-rw.postgres-db.svc.cluster.local
  Port: 5432
  Database: postgres
  App User: appuser / appuser123!

${GREEN}Multi-Tenant Schemas:${NC}
  - tenant_acme (sample data included)
  - tenant_beta (sample data included)

${GREEN}Connection String Examples:${NC}
  Direct: postgresql://appuser:appuser123!@postgres-cluster-rw.postgres-db.svc.cluster.local:5432/postgres
  Pooled: postgresql://appuser:appuser123!@postgres-pooler-rw.postgres-db.svc.cluster.local:5432/postgres

${YELLOW}Note: Change default passwords in production!${NC}
EOF
}

# Main function
main() {
    log $BLUE "=== Deploying PostgreSQL for Knative Stack ==="
    
    # Check if CloudNativePG operator is installed
    if ! kubectl get crd clusters.postgresql.cnpg.io &> /dev/null; then
        log $RED "CloudNativePG operator is not installed!"
        log $YELLOW "Please run 01-install-operators.sh first."
        exit 1
    fi
    
    deploy_namespaces
    deploy_secrets
    deploy_postgres_cluster
    deploy_pooler
    verify_deployment
    display_connection_info
    
    log $GREEN "=== PostgreSQL deployment completed successfully! ==="
    log $BLUE "You can now proceed with Knative application deployment using 03-deploy-knative-app.sh"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 