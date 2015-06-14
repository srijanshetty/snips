// Core modules
var fs = require('fs');
var path = require('path');

// Generate the root folder of snippets
var snippetsRoot = path.join(process.env.HOME, '.snips');

// Logging
var helper = require('./helper');

// Function to create a snippet with the given name
module.exports.createSnippet = function (snippetName) {
    // Generate fileName
    var fileName = path.join(snippetsRoot, snippetName);

    // Open up vim for creating the snippet and then wait for close
    var editor = require('child_process').spawn(process.env.EDITOR, [fileName], {stdio: 'inherit'});
    editor.on('exit', process.exit);
};

// Function to list snippets from the snips directory
module.exports.listSnippets = function() {
    fs.readdir(snippetsRoot, function (err, items) {
        if (err) {
            helper.error('Filesystem error');
            process.exit(1);
        }

        // List all the snippets
        items.forEach(function(item) {
            console.log(item);
        });
    });
};

// Copy a snippet to the clipboard
module.exports.copySnippet = function (snippetName) {
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
};
