#!/usr/bin/env node
import program from 'commander';
import functions from './lib/functions';

// Check for snippetsRoot and snippetsFolder
functions.checkFiles();

program
  .command('new [snippet-name]')
  .description('Create a code snippet with given name')
  .action(functions.createSnippet);

program
  .command('edit [snippet-name]')
  .description('Edit an existing code snippet')
  .action(functions.editSnippet);

program
  .command('list')
  .description('List all snippets')
  .action(functions.listSnippets);

program
  .command('copy [snippet-name]')
  .description('Copy snippet to clipboard if it exists')
  .action(functions.copySnippet);

// By default display all the snips
if (!process.argv.slice(2).length) {
  functions.listSnippets();
}

// Parse arguments
program.parse(process.argv);
