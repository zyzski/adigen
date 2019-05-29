// libs
const axios = require("axios");

// modules
const { createUser, createAccount } = require("./utils/user");
const logger = require("./utils/log");

axios.defaults.withCredentials = true;

const HEADERS = {
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "max-age=0",
  Connection: "keep-alive",
  "Content-Type": "application/x-www-form-urlencoded",
  Host: "www.adidas.com",
  Origin: "https://www.adidas.com",
  Referer: "https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/MiAccount-Register/",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
};

const AXIOS_CONFIG = {
  headers: HEADERS
};

const URLS = {
  get: "https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/MiAccount-Register/"
};

// 1. personal info page
const keyReg = new RegExp(/<input\s*type="hidden"\s*name="dwfrm_mipersonalinfo_securekey"\s*value="(.*)"\s*\/>/gi);
const formReg = new RegExp(/<form\s*class="fancyform"\s*action="(.*)"\s*method="post"\s*id="dwfrm_mipersonalinfo"/gi);

// 2. user page
const userKeyReg = new RegExp(/<input\s*type="hidden"\s*name="dwfrm_milogininfo_securekey"\s*value="(.*)">/gi);
const userFormReg = new RegExp(/<form\s*action="(.*)"\s*method="post"\s*id="dwfrm_milogininfo"/gi);

// 3. terms page
const secureKeyTermsRegex = new RegExp(/<input\s*type="hidden"\s*name="dwfrm_micommunicinfo_securekey"\s*value="(.*)"\s*\/>/gi);
const termsFormUrlRegex = new RegExp(/<form\s*action="(.*)"\s*method="post"\s*id="dwfrm_micommunicinfo"/gi);

// main thread
async function run(instanceNumber) {
  try {
    // 1. get personal info page
    const page = await axios.get(URLS.get, AXIOS_CONFIG);
    const secureKey = keyReg.exec(page.data)[1];
    const userFormUrl = formReg.exec(page.data)[1];
    logger.green(`KEY: ${secureKey}`);
    logger.green(`USER FORM URL: ${userFormUrl}`);

    const user = createUser(secureKey);
    logger.green(`USER:`);
    console.log(user);

    // 2. POST to complete first form with user data
    const userPage = await axios.post(userFormUrl, user, AXIOS_CONFIG);
    const secureKeyUser = userKeyReg.exec(userPage.data)[1];
    const accountFormUrl = userFormReg.exec(userPage.data)[1];
    logger.green(`USER PAGE KEY: ${secureKeyUser}`);
    logger.green(`ACCOUNT FORM URL: ${accountFormUrl}`);

    const account = createAccount(secureKeyUser);
    const newHeaders = {
      headers: { ...AXIOS_CONFIG.HEADERS, Referer: userFormUrl }
    };

    // 3. POST to complete 2nd form with account data
    const accountPage = await axios.post(accountFormUrl, account, newHeaders);
    const secureKeyTerms = secureKeyTermsRegex.exec(accountPage.data)[1];
    const termsFormUrl = termsFormUrlRegex.exec(accountPage.data)[1];
    logger.green(`TERMS PAGE KEY: ${secureKeyTerms}`);
    logger.green(`TERMS FORM URL: ${termsFormUrl}`);

    const payload = {
      dwfrm_micommunicinfo_agreeterms: "true",
      dwfrm_micommunicinfo_step3: "Register",
      dwfrm_micommunicinfo_securekey: secureKeyTerms
    };

    // 4. POST to complete 3rd form with terms data
    const result = await axios.post(termsFormUrl, payload, newHeaders);
    console.log(result);
  } catch (e) {
    logger.red("CRASH:");
    logger.red(e);
    process.exit();
  }
}

(async function() {
  const result = await run();
})();
