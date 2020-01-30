// Core modules
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');

// Generate the root folder of snippets
var snippetsRoot = path.join(process.env.HOME, '.snips');
var snippetsIndex = path.join(process.env.HOME, '.snipsIndex');

// Logging
var helper = require('./helper');

// Function to create a snippet with the given name
module.exports.createSnippet = function (snippetName) {
    // Generate fileName
    var fileName = path.join(snippetsRoot, snippetName);

    // Copy the template file
    var template = '---\ntags: []\nlanguage:\n---\n\n';
    fs.writeFileSync(fileName, template);

    // Open up vim for creating the snippet and then wait for close
    var editor = require('child_process').spawn(process.env.EDITOR, [fileName], {stdio: 'inherit'});

    // When the editor exits, we extract the yaml-front-matter and save it elsewhere
    editor.on('exit', function () {
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                // In case we fail, we delete the file
                helper.error('Filesystem error');
                shell.rm(fileName);
                throw new Error('Filesystem error');
            }

            // Process the yaml frontmatter
            var content = require('front-matter')(data);
            var body = content.body;
            var metadata = { 'tags': content.attributes.tags, 'language': content.attributes.language};

            // Write the contents to the file
            fs.writeFile(fileName, body, function() {
                if (err) {
                    // In case we fail, we delete the file
                    helper.error('could not write contents to file');
                    shell.rm(fileName);
                    throw new Error('could not write contents to file');
                }

                // Write the metadata
                var index = JSON.parse(fs.readFileSync(snippetsIndex));
                index[fileName] = metadata;
                fs.writeFileSync(snippetsIndex, JSON.stringify(index));
            });
        });
    });
};

// Function to edit a snippet
module.exports.editSnippet = function (snippetName) {
    // Generate fileName
    var fileName = path.join(snippetsRoot, snippetName);

    // Open up vim for creating the snippet and then wait for close
    require('child_process').spawn(process.env.EDITOR, [fileName], {stdio: 'inherit'});
};

// Function to list snippets from the snips directory
module.exports.listSnippets = function() {
    fs.readdir(snippetsRoot, function (err, items) {
        if (err) {
            helper.error('snippets root folder not found');
            throw new Error('snippets root folder not found');
        }

        // List all the snippets found
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
        throw new Error('Snippet with given name already exists');
    }

    // Get the text from the file
    var text = fs.readFileSync(fileName).toString();

    // Copy the text to clipboard
    require('copy-paste').copy(text, function() { });
};

// Create the snips directory and root
module.exports.checkFiles = function() {
    try {
        fs.mkdirSync(snippetsRoot);
        fs.writeFileSync(snippetsIndex, '[]');
    }
    catch(e) {
        if ( e.code !== 'EEXIST' ) {
            throw e;
        }
    }
};
