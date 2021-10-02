const { chromium } = require("playwright");
const program = require("commander");

program
  .option("-i <id>", "Your id")
  .option("-p <password>", "Your password")
  .option("-d, --debug", "Launch browser as headless=false")
  .parse(process.argv);
const options = program.opts();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let launchOptions = {};
if (options.debug) {
  launchOptions = { headless: false, slowMo: 100 };
}

(async () => {
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext(); /* Create a new incognito browser context */
  const page = await context.newPage();

  await page.goto(
    "https://accounts.secure.freee.co.jp/login/accounting?a=false&e=0&o=true"
  );

  await page.fill('[placeholder="メールアドレス"]', options.i);
  await page.fill('[placeholder="パスワード"]', options.p);
  await page.press('[placeholder="パスワード"]', "Enter");

  await sleep(2000);
  await page.screenshot({ path: "./screenshots/screenshot.png", fullPage: true });

  const planName = await page.innerText(
    '//*[@id="header-container"]/li[3]/div/span/span'
  );
  console.log(`Your plan is ${planName}`);

  await context.close();
  await browser.close();
})();
