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

# Configuration
IMAGE_NAME="postgres-knative-backend-api"
IMAGE_TAG="latest"
REGISTRY="localhost:5001"  # Default to local registry
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

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

# Function to check if a resource exists
resource_exists() {
    kubectl get "$1" "$2" -n "$3" &> /dev/null 2>&1
}

# Function to wait for Knative service to be ready
wait_for_knative_service() {
    local service_name=$1
    local namespace=$2
    local timeout=${3:-300}
    
    log $BLUE "Waiting for Knative service '$service_name' to be ready..."
    
    kubectl wait --for=condition=Ready \
        ksvc "$service_name" \
        -n "$namespace" \
        --timeout="${timeout}s"
    
    log $GREEN "Knative service is ready!"
}

# Check prerequisites
check_prerequisites() {
    log $BLUE "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists kubectl; then
        missing_tools+=("kubectl")
    fi
    
    if ! command_exists docker; then
        missing_tools+=("docker")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log $RED "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Check if Knative Serving is installed
    if ! kubectl get crd services.serving.knative.dev &> /dev/null; then
        log $RED "Knative Serving is not installed!"
        log $YELLOW "Please run 01-install-operators.sh first."
        exit 1
    fi
    
    # Check if PostgreSQL is deployed
    if ! resource_exists cluster postgres-cluster postgres-db; then
        log $RED "PostgreSQL cluster is not deployed!"
        log $YELLOW "Please run 02-deploy-postgres.sh first."
        exit 1
    fi
    
    log $GREEN "Prerequisites check passed!"
}

# Setup container registry
setup_registry() {
    log $BLUE "Setting up container registry..."
    
    # Check if we should use a different registry
    if [ -n "${CONTAINER_REGISTRY:-}" ]; then
        REGISTRY="$CONTAINER_REGISTRY"
        FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
        log $BLUE "Using custom registry: $REGISTRY"
        return
    fi
    
    # Check if local registry is running (for development)
    if docker ps | grep -q "registry:2"; then
        log $YELLOW "Local registry is already running"
        return
    fi
    
    # Ask user about registry preference
    cat << EOF
${BLUE}Container Registry Options:${NC}
1. Use local registry (localhost:5001) - recommended for development
2. Use Docker Hub (requires docker login)
3. Use custom registry (specify manually)
4. Build only (no push)

EOF
    
    read -p "Choose an option (1-4) [1]: " -r
    REGISTRY_CHOICE=${REPLY:-1}
    
    case $REGISTRY_CHOICE in
        1)
            log $BLUE "Starting local registry..."
            docker run -d -p 5001:5000 --restart=always --name local-registry registry:2 || {
                log $YELLOW "Local registry might already be running on different container"
            }
            REGISTRY="localhost:5001"
            ;;
        2)
            read -p "Enter your Docker Hub username: " -r DOCKER_USERNAME
            REGISTRY="docker.io/$DOCKER_USERNAME"
            log $BLUE "Please make sure you are logged in to Docker Hub (docker login)"
            ;;
        3)
            read -p "Enter custom registry URL: " -r CUSTOM_REGISTRY
            REGISTRY="$CUSTOM_REGISTRY"
            ;;
        4)
            REGISTRY=""
            log $YELLOW "Will build image without pushing to registry"
            ;;
        *)
            log $RED "Invalid option. Using local registry."
            REGISTRY="localhost:5001"
            ;;
    esac
    
    if [ -n "$REGISTRY" ]; then
        FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
        log $GREEN "Using registry: $REGISTRY"
    fi
}

# Build container image
build_image() {
    log $BLUE "Building container image..."
    
    cd "$PROJECT_DIR/apps/backend-api"
    
    # Build the image
    docker build -t "$IMAGE_NAME:$IMAGE_TAG" .
    
    if [ -n "$REGISTRY" ]; then
        # Tag for registry
        docker tag "$IMAGE_NAME:$IMAGE_TAG" "$FULL_IMAGE_NAME"
        
        log $GREEN "Container image built successfully: $FULL_IMAGE_NAME"
    else
        log $GREEN "Container image built successfully: $IMAGE_NAME:$IMAGE_TAG"
    fi
    
    cd "$SCRIPT_DIR"
}

# Push container image
push_image() {
    if [ -z "$REGISTRY" ]; then
        log $YELLOW "Skipping image push (build-only mode)"
        return
    fi
    
    log $BLUE "Pushing container image to registry..."
    
    docker push "$FULL_IMAGE_NAME"
    
    log $GREEN "Container image pushed successfully!"
}

# Update Knative service manifest
update_manifest() {
    log $BLUE "Updating Knative service manifest..."
    
    local manifest_file="$PROJECT_DIR/manifests/knative/01-backend-api.yaml"
    local temp_file=$(mktemp)
    
    if [ -n "$REGISTRY" ]; then
        # Update image reference in manifest
        sed "s|image: ghcr.io/postgres-knative-stack/backend-api:latest|image: $FULL_IMAGE_NAME|g" \
            "$manifest_file" > "$temp_file"
        mv "$temp_file" "$manifest_file"
        
        log $GREEN "Manifest updated with image: $FULL_IMAGE_NAME"
    else
        # For build-only mode, use the local image
        sed "s|image: ghcr.io/postgres-knative-stack/backend-api:latest|image: $IMAGE_NAME:$IMAGE_TAG|g" \
            "$manifest_file" > "$temp_file"
        mv "$temp_file" "$manifest_file"
        
        log $YELLOW "Manifest updated for local image (ensure the image is available in your cluster)"
    fi
}

# Deploy Knative service
deploy_knative_service() {
    log $BLUE "Deploying Knative service..."
    
    # Apply the manifest
    kubectl apply -f "$PROJECT_DIR/manifests/knative/01-backend-api.yaml"
    
    # Wait for service to be ready
    wait_for_knative_service postgres-backend-api postgres-apps
    
    log $GREEN "Knative service deployed successfully!"
}

# Test the deployment
test_deployment() {
    log $BLUE "Testing the deployment..."
    
    # Get the service URL
    local service_url=$(kubectl get ksvc postgres-backend-api -n postgres-apps -o jsonpath='{.status.url}')
    
    if [ -z "$service_url" ]; then
        log $RED "Could not get service URL"
        return 1
    fi
    
    log $BLUE "Service URL: $service_url"
    
    # Test health endpoint
    log $BLUE "Testing health endpoint..."
    if command_exists curl; then
        curl -s "$service_url/health" | jq . || {
            log $YELLOW "curl request failed or jq not available, trying with kubectl"
            kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
                curl -s "$service_url/health"
        }
    else
        log $YELLOW "curl not available, using kubectl to test"
        kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
            curl -s "$service_url/health"
    fi
    
    # Test API info endpoint
    log $BLUE "Testing API info endpoint..."
    if command_exists curl; then
        curl -s "$service_url/api/info" | jq . || {
            kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
                curl -s "$service_url/api/info"
        }
    else
        kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
            curl -s "$service_url/api/info"
    fi
    
    # Test multi-tenant endpoints
    log $BLUE "Testing multi-tenant endpoints..."
    
    # Test ACME tenant
    log $BLUE "Testing ACME tenant users..."
    if command_exists curl; then
        curl -s -H "x-tenant-id: acme" "$service_url/api/users" | jq . || {
            kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
                curl -s -H "x-tenant-id: acme" "$service_url/api/users"
        }
    else
        kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
            curl -s -H "x-tenant-id: acme" "$service_url/api/users"
    fi
    
    # Test BETA tenant
    log $BLUE "Testing BETA tenant users..."
    if command_exists curl; then
        curl -s -H "x-tenant-id: beta" "$service_url/api/users" | jq . || {
            kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
                curl -s -H "x-tenant-id: beta" "$service_url/api/users"
        }
    else
        kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- \
            curl -s -H "x-tenant-id: beta" "$service_url/api/users"
    fi
    
    log $GREEN "Deployment testing completed!"
}

# Display service information
display_service_info() {
    log $BLUE "=== Knative Service Information ==="
    
    # Get service details
    kubectl get ksvc postgres-backend-api -n postgres-apps -o wide
    
    # Get service URL
    local service_url=$(kubectl get ksvc postgres-backend-api -n postgres-apps -o jsonpath='{.status.url}')
    
    cat << EOF

${GREEN}Service Endpoints:${NC}
  Base URL: ${service_url}
  Health Check: ${service_url}/health
  Ready Check: ${service_url}/ready
  API Info: ${service_url}/api/info

${GREEN}Multi-Tenant API Endpoints:${NC}
  Users (default): ${service_url}/api/users
  Users (ACME): ${service_url}/api/users (with header: x-tenant-id: acme)
  Users (BETA): ${service_url}/api/users (with header: x-tenant-id: beta)
  
  Posts (default): ${service_url}/api/posts
  Posts (ACME): ${service_url}/api/posts (with header: x-tenant-id: acme)
  Posts (BETA): ${service_url}/api/posts (with header: x-tenant-id: beta)
  
  Statistics: ${service_url}/api/stats

${GREEN}Example curl commands:${NC}
  # Test health
  curl ${service_url}/health
  
  # Get ACME tenant users
  curl -H "x-tenant-id: acme" ${service_url}/api/users
  
  # Create user for BETA tenant
  curl -X POST -H "Content-Type: application/json" -H "x-tenant-id: beta" \\
    -d '{"name":"New User","email":"newuser@beta.com"}' \\
    ${service_url}/api/users

${YELLOW}Note: The service will scale to zero when not in use and scale up automatically on requests.${NC}
EOF
}

# Main function
main() {
    log $BLUE "=== Deploying Knative Application ==="
    
    check_prerequisites
    setup_registry
    build_image
    push_image
    update_manifest
    deploy_knative_service
    test_deployment
    display_service_info
    
    log $GREEN "=== Knative application deployment completed successfully! ==="
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 