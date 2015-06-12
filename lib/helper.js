var chalk = require('chalk');

// Log errors
module.exports.error = function (statement) {
    chalk.bold.red('[FAIL] ' + statement);
};
