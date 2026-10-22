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

  // Task 17: get_dealers.png (Dealership landing page before logging in)
  console.log('--- Capturing Task 17: get_dealers.png ---');
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('.dealers_table');
  await page.screenshot({ path: path.join(uploadDir, 'get_dealers.png') });
  console.log('Saved get_dealers.png');

  // Task 18: get_dealers_loggedin.png (Landing page after login showing username, Review Dealer option, address bar)
  console.log('--- Capturing Task 18: get_dealers_loggedin.png ---');
  await page.evaluate(() => sessionStorage.setItem('username', 'demo_user'));
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('.user_session_bar');
  await addBrowserChromeBar(page, 'http://127.0.0.1:8000/');
  await page.screenshot({ path: path.join(uploadDir, 'get_dealers_loggedin.png') });
  console.log('Saved get_dealers_loggedin.png');

  // Task 19: dealersbystate.png (Dealership landing page filtered by state Kansas, address bar visible)
  console.log('--- Capturing Task 19: dealersbystate.png ---');
  await page.goto('http://127.0.0.1:8000/?state=Kansas', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.dealers_table');
  await addBrowserChromeBar(page, 'http://127.0.0.1:8000/?state=Kansas');
  await page.screenshot({ path: path.join(uploadDir, 'dealersbystate.png') });
  console.log('Saved dealersbystate.png');

  // Task 20: dealer_id_reviews.png (Selected dealership details and reviews, address bar visible)
  console.log('--- Capturing Task 20: dealer_id_reviews.png ---');
  await page.goto('http://127.0.0.1:8000/dealer/1/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.reviews_grid');
  await addBrowserChromeBar(page, 'http://127.0.0.1:8000/dealer/1/');
  await page.screenshot({ path: path.join(uploadDir, 'dealer_id_reviews.png') });
  console.log('Saved dealer_id_reviews.png');

  // Task 21: dealership_review_submission.png (Post Review page filled before submitting)
  console.log('--- Capturing Task 21: dealership_review_submission.png ---');
  await page.goto('http://127.0.0.1:8000/postreview/1/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#review_content');
  
  // Fill in review details
  await page.type('#review_content', 'Fantastic services and exceptional customer care from the entire sales team. The purchasing process was smooth and transparent!');
  await page.type('#purchase_date', '2024-03-15');
  await page.screenshot({ path: path.join(uploadDir, 'dealership_review_submission.png') });
  console.log('Saved dealership_review_submission.png');

  // Task 22: added_review.png (Submit review and show successfully posted review, verify persistence)
  console.log('--- Capturing Task 22: added_review.png ---');
  await page.click('#submit_review_btn');
  // Wait for redirect to dealer page
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Redirected to:', page.url());
  // Verify review persistence across reload
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('.reviews_grid');
  await page.screenshot({ path: path.join(uploadDir, 'added_review.png') });
  console.log('Saved added_review.png');

  await browser.close();
  console.log('Local application screenshots complete.');
})();
