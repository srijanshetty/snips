import chalk from 'chalk';

// Log errors
function error(statement: string): void {
  chalk.bold.red('[FAIL] ' + statement);
}

export default {
  error,
};
