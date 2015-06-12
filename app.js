#!/usr/bin/env node

// For creating the CLI
var program = require('commander');

// The functionalities
var functions = require('./lib/functions.js');

program
    .version(JSON.parse(require('fs').readFileSync('package.json')).version);

program
    .command('create [snippet-name]')
    .description('Create a code snippet with given name')
    .action(functions.createSnippet);

program
    .command('list')
    .description('List all snippets')
    .action(functions.listSnippets);

program
    .command('copy [snippet-name]')
    .description('Copy snippet to clipboard if it exists')
    .action(functions.copySnippet);

program
    .command('search <search-terms>')
    .description('Search snippets for given search term')
    .action(functions.searchSnippets);

// Parse arguments
program.parse(process.argv);
