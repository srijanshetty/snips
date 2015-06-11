#!/usr/bin/env node

// Core modules
var fs = require('fs');
var path = require('path');

// Generate the root folder of snippets
var snippetsRoot = path.join(process.env.HOME, '.snips');

// Logging
var chalk = require('chalk');
var error = function (statement) { chalk.bold.red('[FAIL] ' + statement); };

// For creating the application
var program = require('commander');

program
    .version(JSON.parse(fs.readFileSync('package.json')).version);

// Create a code-snippet
program
    .command('create [snippet-name]')
    .description('Create a code snippet with given name')
    .action(function (snippetName) {
        // Generate fileName
        var fileName = path.join(snippetsRoot, snippetName);

        // Check if there exists a snippet with the given name
        if (fs.existsSync(fileName)) {
            error('Snippet already exists');
            process.exit(1);
        }

        // Open up vim for creating the snippet and then wait for close
        var editor = require('child_process').spawn(process.env.EDITOR, [fileName], {stdio: 'inherit'});
        editor.on('exit', process.exit);
    });

// List all snippets
program
    .command('list')
    .description('List all snippets')
    .action(function() {
        fs.readdir(snippetsRoot, function (err, items) {
            if (err) {
                error('Filesystem error');
                process.exit(1);
            }

            // List all the snippets
            items.forEach(function(item) {
                console.log(item);
            });
        });
    });

// Copy a snippet to the clipboard
program
    .command('copy [snippet-name]')
    .description('Copy snippet to clipboard if it exists')
    .action(function (snippetName) {
        // Generate fileName
        var fileName = path.join(snippetsRoot, snippetName);

        // Check if there exists a snippet with the given name
        if (!fs.existsSync(fileName)) {
            process.exit(0);
        }

        // Get the text from the file
        var text = fs.readFileSync(fileName).toString();

        // Copy the text to clipboard
        require('copy-paste').copy(text, function() { process.exit(0); });
    });

// Search for a string in all snippets
program
    .command('search <search-terms>')
    .description('Search snippets for given search term')
    .action(function(searchTerm) {

    });

// Parse arguments
program.parse(process.argv);
