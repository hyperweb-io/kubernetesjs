#!/usr/bin/env node

/**
 * CI Setup Validation Script
 * This script validates that the CI environment is properly configured
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating CI Setup...\n');

// Check if we're in CI environment
const isCI = process.env.CI === 'true';
console.log(`📍 Environment: ${isCI ? 'CI' : 'Local'}`);

// Check required environment variables
const requiredEnvVars = ['K8S_API'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.log(`⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.log('   Setting defaults for local testing...');
  process.env.K8S_API = process.env.K8S_API || 'http://localhost:8001';
} else {
  console.log('✅ All required environment variables are set');
}

// Check if kubectl is available
try {
  const kubectlVersion = execSync('kubectl version --client', { encoding: 'utf8' });
  console.log('✅ kubectl is available');
  console.log(`   Version: ${kubectlVersion.trim()}`);
} catch (error) {
  console.log('❌ kubectl is not available');
  console.log('   Please install kubectl or ensure it\'s in PATH');
  process.exit(1);
}

// Check if kind is available
try {
  const kindVersion = execSync('kind version', { encoding: 'utf8' });
  console.log('✅ kind is available');
  console.log(`   Version: ${kindVersion.trim()}`);
} catch (error) {
  console.log('❌ kind is not available');
  console.log('   Please install kind or ensure it\'s in PATH');
  process.exit(1);
}

// Check if pnpm is available
try {
  const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' });
  console.log('✅ pnpm is available');
  console.log(`   Version: ${pnpmVersion.trim()}`);
} catch (error) {
  console.log('❌ pnpm is not available');
  console.log('   Please install pnpm or ensure it\'s in PATH');
  process.exit(1);
}

// Check if Node.js is available
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log('✅ Node.js is available');
  console.log(`   Version: ${nodeVersion.trim()}`);
} catch (error) {
  console.log('❌ Node.js is not available');
  process.exit(1);
}

// Check if test files exist
const testFiles = [
  'workflow-operator-database-focused.spec.ts',
  'workflow-deployment-lifecycle.spec.ts',
  'utils/workflow-helpers.ts',
  'utils/deployment-helpers.ts',
  'utils/cluster-verification.ts'
];

console.log('\n📁 Checking test files...');
testFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
  }
});

// Check if Playwright is installed
try {
  const playwrightVersion = execSync('npx playwright --version', { encoding: 'utf8' });
  console.log('\n✅ Playwright is available');
  console.log(`   Version: ${playwrightVersion.trim()}`);
} catch (error) {
  console.log('\n❌ Playwright is not available');
  console.log('   Run: npx playwright install');
}

// Check if dependencies are installed
const packageJsonPath = path.join(__dirname, '../../package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasPlaywright = packageJson.devDependencies && packageJson.devDependencies['@playwright/test'];
  
  if (hasPlaywright) {
    console.log('✅ @playwright/test is in dependencies');
  } else {
    console.log('❌ @playwright/test is missing from dependencies');
  }
}

// Check if we can connect to Kubernetes API
console.log('\n🔗 Testing Kubernetes API connection...');
try {
  const apiUrl = process.env.K8S_API || 'http://localhost:8001';
  console.log(`   Testing connection to: ${apiUrl}`);
  
  // Try to make a simple API call
  const curlCommand = `curl -s -o /dev/null -w "%{http_code}" ${apiUrl}/api/v1`;
  const httpCode = execSync(curlCommand, { encoding: 'utf8' }).trim();
  
  if (httpCode === '200') {
    console.log('✅ Kubernetes API is accessible');
  } else {
    console.log(`⚠️  Kubernetes API returned HTTP ${httpCode}`);
    console.log('   Make sure kubectl proxy is running or cluster is accessible');
  }
} catch (error) {
  console.log('❌ Cannot connect to Kubernetes API');
  console.log('   Make sure kubectl proxy is running: kubectl proxy --port=8001');
}

console.log('\n🎯 CI Setup Validation Complete!');
console.log('\nTo test locally:');
console.log('1. Start kubectl proxy: kubectl proxy --port=8001 &');
console.log('2. Run tests: pnpm test:e2e');
console.log('\nTo test in CI:');
console.log('1. Push to main branch or create PR');
console.log('2. Check GitHub Actions tab');
