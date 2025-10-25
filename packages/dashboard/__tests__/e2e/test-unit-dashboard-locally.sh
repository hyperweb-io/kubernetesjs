#!/bin/bash

# Local Dashboard Unit Test Script
# This script runs unit tests locally for dashboard and other packages

set -e

echo "🧪 Starting Local Dashboard Unit Test Suite..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Found project root package.json"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install it first:"
    echo "  npm install -g pnpm"
    exit 1
fi

print_status "pnpm is installed"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install it first"
    exit 1
fi

print_status "Node.js is installed"

# Install dependencies
print_info "Installing dependencies..."
pnpm install --frozen-lockfile

# Build packages
print_info "Building packages..."
pnpm build

# Test results tracking
dashboard_result="❌"
client_result="❌"
manifests_result="❌"
interwebjs_result="❌"
cli_result="❌"

# Run unit tests for each package
packages=("dashboard" "client" "manifests" "interwebjs" "cli")

for package in "${packages[@]}"; do
    echo ""
    print_info "Testing package: $package"
    echo "----------------------------------------"
    
    if [ -d "packages/$package" ]; then
        cd "packages/$package"
        
        if [ -f "package.json" ]; then
            # Check if the package has test scripts
            if grep -q '"test"' package.json; then
                print_info "Running unit tests for $package..."
                
                if [ "$package" = "dashboard" ]; then
                    if pnpm test --coverage --watchAll=false --passWithNoTests; then
                        dashboard_result="✅"
                        print_status "$package unit tests passed"
                    else
                        dashboard_result="❌"
                        print_error "$package unit tests failed"
                    fi
                elif [ "$package" = "client" ]; then
                    if pnpm tests:unit --coverage --watchAll=false --passWithNoTests; then
                        client_result="✅"
                        print_status "$package unit tests passed"
                    else
                        client_result="❌"
                        print_error "$package unit tests failed"
                    fi
                elif [ "$package" = "manifests" ]; then
                    if pnpm test --coverage --watchAll=false --passWithNoTests; then
                        manifests_result="✅"
                        print_status "$package unit tests passed"
                    else
                        manifests_result="❌"
                        print_error "$package unit tests failed"
                    fi
                elif [ "$package" = "interwebjs" ]; then
                    if pnpm test --coverage --watchAll=false --passWithNoTests; then
                        interwebjs_result="✅"
                        print_status "$package unit tests passed"
                    else
                        interwebjs_result="❌"
                        print_error "$package unit tests failed"
                    fi
                elif [ "$package" = "cli" ]; then
                    if pnpm test --coverage --watchAll=false --passWithNoTests; then
                        cli_result="✅"
                        print_status "$package unit tests passed"
                    else
                        cli_result="❌"
                        print_error "$package unit tests failed"
                    fi
                fi
            else
                print_warning "$package has no test scripts, skipping"
                case "$package" in
                    "dashboard") dashboard_result="⏭️" ;;
                    "client") client_result="⏭️" ;;
                    "manifests") manifests_result="⏭️" ;;
                    "interwebjs") interwebjs_result="⏭️" ;;
                    "cli") cli_result="⏭️" ;;
                esac
            fi
        else
            print_warning "$package has no package.json, skipping"
            case "$package" in
                "dashboard") dashboard_result="⏭️" ;;
                "client") client_result="⏭️" ;;
                "manifests") manifests_result="⏭️" ;;
                "interwebjs") interwebjs_result="⏭️" ;;
                "cli") cli_result="⏭️" ;;
            esac
        fi
        
        cd ../..
    else
        print_warning "Package $package not found, skipping"
        case "$package" in
            "dashboard") dashboard_result="⏭️" ;;
            "client") client_result="⏭️" ;;
            "manifests") manifests_result="⏭️" ;;
            "interwebjs") interwebjs_result="⏭️" ;;
            "cli") cli_result="⏭️" ;;
        esac
    fi
done

# Print summary
echo ""
echo "📊 Dashboard Unit Test Results Summary"
echo "======================================"
echo ""

echo -e "| Package | Status |"
echo -e "|---------|--------|"
echo -e "| **dashboard** | $dashboard_result |"
echo -e "| client | $client_result |"
echo -e "| manifests | $manifests_result |"
echo -e "| interwebjs | $interwebjs_result |"
echo -e "| cli | $cli_result |"

echo ""

# Check if all tests passed
all_passed=true
if [ "$dashboard_result" = "❌" ] || [ "$client_result" = "❌" ] || [ "$manifests_result" = "❌" ] || [ "$interwebjs_result" = "❌" ] || [ "$cli_result" = "❌" ]; then
    all_passed=false
fi

if [ "$all_passed" = true ]; then
    print_status "All unit tests completed successfully!"
    echo ""
    echo "🎉 Your dashboard unit test setup is ready!"
    echo "You can now:"
    echo "1. Push to main branch to trigger the dashboard unit test CI pipeline"
    echo "2. Create a PR to test the workflow"
    echo "3. Use 'workflow_dispatch' to manually trigger tests"
    echo "4. Run 'gh workflow run test-unit-dashboard.yml' to test dashboard only"
    echo "5. Run 'gh workflow run test-unit-dashboard.yml -f test_package=all' to test all packages"
else
    print_error "Some unit tests failed. Please check the output above."
    exit 1
fi
