import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for workflow tests...');
  
  // Launch browser for cleanup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the dashboard for final cleanup
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/global-teardown-final.png',
      fullPage: true 
    });
    
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  } finally {
    await browser.close();
  }
}

export default globalTeardown;
