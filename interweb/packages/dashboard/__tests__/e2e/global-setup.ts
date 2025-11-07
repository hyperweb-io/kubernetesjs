import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for workflow tests...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the dashboard
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check if dashboard is accessible
    const title = await page.title();
    console.log(`📊 Dashboard title: ${title}`);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/global-setup-initial.png',
      fullPage: true 
    });
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
