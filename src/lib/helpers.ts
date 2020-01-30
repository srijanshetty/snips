import chalk from 'chalk';

// Log errors
function error(statement: string) {
  chalk.bold.red('[FAIL] ' + statement);
}

export default {
  error,
};
