const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  console.log('1. Navigating to admin login...');
  await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/', { waitUntil: 'networkidle0' });
  
  await page.type('#id_username', 'root');
  await page.type('#id_password', 'RootPass123!@#');
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('input[type="submit"]')
  ]);

  console.log('Logged in URL:', page.url());
  const adminLoginPath = path.join(__dirname, '../submission/upload_ready/admin_login.png');
  await page.screenshot({ path: adminLoginPath });
  console.log('Saved admin_login.png to', adminLoginPath);

  console.log('2. Clicking logout button on admin page...');
  const logoutBtn = await page.$('#logout-form button, form[action*="logout"] button');
  if (logoutBtn) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      logoutBtn.click()
    ]);
  } else {
    console.log('Fallback to logout URL');
    await page.goto('http://127.0.0.1:8000/admin/logout/', { waitUntil: 'networkidle0' });
  }

  console.log('Logged out URL:', page.url());
  const adminLogoutPath = path.join(__dirname, '../submission/upload_ready/admin_logout.png');
  await page.screenshot({ path: adminLogoutPath });
  console.log('Saved admin_logout.png to', adminLogoutPath);

  await browser.close();
  console.log('Admin screenshots complete.');
})();
