const uuidv4 = require("uuid/v4");
const NAME_LIST = require("../assets/names.json");
const { randomMinMax } = require("../utils/rand");

const EMAIL_DOMAIN = "@zyzski.com";

const NAMES = NAME_LIST.reduce(
  (prev, next) => {
    prev.first.push(next.name);
    prev.last.push(next.surname);
    return prev;
  },
  {
    first: [],
    last: []
  }
);

const createUser = secureKey => {
  const rand = Math.floor(Math.random() * NAMES.first.length - 1);

  return {
    dwfrm_mipersonalinfo_firstname: NAMES.first[rand],
    dwfrm_mipersonalinfo_lastname: NAMES.last[rand],
    dwfrm_mipersonalinfo_customer_birthday_dayofmonth: randomMinMax(2, 20),
    dwfrm_mipersonalinfo_customer_birthday_month: randomMinMax(0, 11),
    dwfrm_mipersonalinfo_customer_birthday_year: randomMinMax(1980, 2009),
    dwfrm_mipersonalinfo_step1: "Next",
    dwfrm_mipersonalinfo_securekey: secureKey
  };
};

const createAccount = secureKey => {
  const uuid = uuidv4().split("-");
  const emailRandom = uuid[0];
  const email = `${emailRandom}@${EMAIL_DOMAIN}`;
  const password = uuid.pop();

  return {
    dwfrm_milogininfo_email: email,
    dwfrm_milogininfo_password: password,
    dwfrm_milogininfo_newpasswordconfirm: password,
    dwfrm_milogininfo_step2: "Next",
    dwfrm_milogininfo_securekey: secureKey
  };
};

module.exports = {
  createUser,
  createAccount
};
