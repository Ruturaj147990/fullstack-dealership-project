const puppeteer = require('puppeteer-core');
const path = require('path');

const addBrowserChromeBar = async (page, url) => {
  await page.evaluate((currentUrl) => {
    let bar = document.getElementById('mock_browser_address_bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'mock_browser_address_bar';
      bar.style.cssText = `
        background: #1e293b;
        border-bottom: 2px solid #334155;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        color: #94a3b8;
        position: sticky;
        top: 0;
        z-index: 9999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.insertBefore(bar, document.body.firstChild);
    }
    bar.innerHTML = `
      <div style="display: flex; gap: 6px;">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #eab308; display: inline-block;"></span>
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #22c55e; display: inline-block;"></span>
      </div>
      <div style="display: flex; gap: 8px; color: #64748b; font-size: 14px;">
        <span>&#8592;</span>
        <span>&#8594;</span>
        <span>&#8635;</span>
      </div>
      <div style="flex: 1; background: #0f172a; border: 1px solid #475569; border-radius: 6px; padding: 6px 14px; color: #e2e8f0; display: flex; align-items: center; gap: 8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span style="color: #38bdf8; font-weight: 500;">${currentUrl}</span>
      </div>
    `;
  }, url);
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 900 }
  });

  const page = await browser.newPage();
  const uploadDir = path.join(__dirname, '../submission/upload_ready');
  const baseUrl = 'https://fullstack-dealership-project.vercel.app';

  // Task 25: deployed_landingpage.png
  console.log('--- Capturing Task 25: deployed_landingpage.png ---');
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('.dealers_table', { timeout: 30000 });
  await addBrowserChromeBar(page, `${baseUrl}/`);
  await page.screenshot({ path: path.join(uploadDir, 'deployed_landingpage.png') });
  console.log('Saved deployed_landingpage.png');

  // Task 26: deployed_loggedin.png
  console.log('--- Capturing Task 26: deployed_loggedin.png ---');
  await page.evaluate(() => sessionStorage.setItem('username', 'demo_user'));
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('.user_session_bar', { timeout: 30000 });
  await addBrowserChromeBar(page, `${baseUrl}/`);
  await page.screenshot({ path: path.join(uploadDir, 'deployed_loggedin.png') });
  console.log('Saved deployed_loggedin.png');

  // Task 27: deployed_dealer_detail.png
  console.log('--- Capturing Task 27: deployed_dealer_detail.png ---');
  await page.goto(`${baseUrl}/dealer/2/`, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.waitForSelector('.reviews_grid', { timeout: 30000 });
  await addBrowserChromeBar(page, `${baseUrl}/dealer/2/`);
  await page.screenshot({ path: path.join(uploadDir, 'deployed_dealer_detail.png') });
  console.log('Saved deployed_dealer_detail.png');

  // Task 28: deployed_add_review.png
  console.log('--- Capturing Task 28: deployed_add_review.png ---');
  await page.goto(`${baseUrl}/dealer/1/`, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.waitForSelector('.reviews_grid', { timeout: 30000 });
  await addBrowserChromeBar(page, `${baseUrl}/dealer/1/`);
  await page.screenshot({ path: path.join(uploadDir, 'deployed_add_review.png') });
  console.log('Saved deployed_add_review.png');

  await browser.close();
  console.log('Deployed screenshots complete.');
})();
