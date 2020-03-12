import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

import copy from 'copy-to-clipboard';
import frontmatter from 'front-matter';

import helper from './helpers';

import { fuzzyProcess } from './fuzzy-list';

// Generate the root folder of snippets
const HOME = process.env.HOME ?? '~';
const EDITOR = process.env.EDITOR ?? 'vim';
const snippetsRoot = path.join(HOME, '.snips');
const snippetsIndex = path.join(HOME, '.snipsIndex');

const _listSnips = () => {
  try {
    return fs.readdirSync(snippetsRoot);
  } catch {
    helper.error('snippets root folder not found');
    throw new Error('snippets root folder not found');
  }
};

const _editSnip = (snippetName: string) => {
  // Generate fileName
  const fileName = path.join(snippetsRoot, snippetName);

  // Open up vim for creating the snippet and then wait for close
  childProcess.spawn(EDITOR, [fileName], {
    stdio: 'inherit',
  });
};

const _copySnip = (snippetName: string) => {
  // Generate fileName
  const fileName = path.join(snippetsRoot, snippetName);

  // Check if there exists a snippet with the given name
  if (!fs.existsSync(fileName)) {
    throw new Error('Snippet with given name does not exist');
  }

  // Get the text from the file
  const text = fs.readFileSync(fileName).toString();

  // Copy the text to clipboard
  copy(text);
};

// Function to create a snippet with the given name
function createSnippet(snippetName: string) {
  // Generate fileName
  const fileName = path.join(snippetsRoot, snippetName);

  // Copy the template file
  const template = '---\ntags: []\nlanguage:\n---\n\n';
  fs.writeFileSync(fileName, template);

  // Open up vim for creating the snippet and then wait for close
  const editor = childProcess.spawn(EDITOR, [fileName], {
    stdio: 'inherit',
  });

  // When the editor exits, we extract the yaml-front-matter and save it elsewhere
  editor.on('exit', () => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        // In case we fail, we delete the file
        helper.error('Filesystem error');
        fs.unlinkSync(fileName);
        throw new Error('Filesystem error');
      }

      // Process the yaml frontmatter
      const content = frontmatter(data);
      const body = content.body;
      const metadata = {
        tags: content.attributes.tags,
        language: content.attributes.language,
      };

      // Write the contents to the file
      fs.writeFile(fileName, body, () => {
        if (err) {
          // In case we fail, we delete the file
          helper.error('could not write contents to file');
          fs.unlinkSync(fileName);
          throw new Error('could not write contents to file');
        }

        // Write the metadata
        const index = JSON.parse(fs.readFileSync(snippetsIndex, 'utf-8'));
        index[fileName] = metadata;
        fs.writeFileSync(snippetsIndex, JSON.stringify(index));
      });
    });
  });
}

// Function to list snippets from the snips directory
function listSnippets() {
  _listSnips().forEach(console.log);
}

// Function to edit a snippet
function editSnippet(snippetName: string | undefined) {
  if (snippetName) {
    _editSnip(snippetName);
  } else {
    fuzzyProcess(_editSnip, _listSnips());
  }
}

// Function to copy a snippet
function copySnippet(snippetName: string | undefined) {
  if (snippetName) {
    _copySnip(snippetName);
  } else {
    fuzzyProcess(_copySnip, _listSnips());
  }
}

// Create the snips directory and root
function checkFiles() {
  try {
    fs.mkdirSync(snippetsRoot);
    fs.writeFileSync(snippetsIndex, '[]');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}

export default {
  createSnippet,
  editSnippet,
  listSnippets,
  copySnippet,
  checkFiles,
};
