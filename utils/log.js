const chalk = require('chalk');

// styling
const green = a =>
  console.log(
    chalk.grey(`[${new Date().toLocaleTimeString()}]`),
    chalk.green(a)
  );

const red = a =>
  console.log(chalk.grey(`[${new Date().toLocaleTimeString()}]`), chalk.red(a));

module.exports = {
  green,
  red,
};
