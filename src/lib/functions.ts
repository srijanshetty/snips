import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

import clipboardy from 'clipboardy';

import helper from './helpers';

import { fuzzyProcess } from './fuzzy-list';

// Generate the root folder of snippets
const HOME = process.env.HOME ?? '~';
const EDITOR = process.env.EDITOR ?? 'vim';
const snippetsRoot = path.join(HOME, '.snips');

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
  clipboardy.writeSync(text);
};

// Function to create a snippet with the given name
function createSnippet(snippetName: string) {
  // Generate fileName
  const fileName = path.join(snippetsRoot, snippetName);

  // Copy the template file
  const template = '---\ntags: []\nlanguage:\n---\n\n';
  fs.writeFileSync(fileName, template);

  // Open up vim for creating the snippet and then wait for close
  childProcess.spawn(EDITOR, [fileName], {
    stdio: 'inherit',
  });
}

// Function to list snippets from the snips directory
function listSnippets() {
  _listSnips().forEach((item) => console.log(item));
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
  } catch (e: any) {
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
