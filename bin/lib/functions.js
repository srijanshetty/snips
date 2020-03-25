"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const child_process_1 = tslib_1.__importDefault(require("child_process"));
const clipboardy_1 = tslib_1.__importDefault(require("clipboardy"));
const helpers_1 = tslib_1.__importDefault(require("./helpers"));
const fuzzy_list_1 = require("./fuzzy-list");
const HOME = (_a = process.env.HOME) !== null && _a !== void 0 ? _a : '~';
const EDITOR = (_b = process.env.EDITOR) !== null && _b !== void 0 ? _b : 'vim';
const snippetsRoot = path_1.default.join(HOME, '.snips');
const snippetsIndex = path_1.default.join(HOME, '.snipsIndex');
const _listSnips = () => {
    try {
        return fs_1.default.readdirSync(snippetsRoot);
    }
    catch (_a) {
        helpers_1.default.error('snippets root folder not found');
        throw new Error('snippets root folder not found');
    }
};
const _editSnip = (snippetName) => {
    const fileName = path_1.default.join(snippetsRoot, snippetName);
    child_process_1.default.spawn(EDITOR, [fileName], {
        stdio: 'inherit',
    });
};
const _copySnip = (snippetName) => {
    const fileName = path_1.default.join(snippetsRoot, snippetName);
    if (!fs_1.default.existsSync(fileName)) {
        throw new Error('Snippet with given name does not exist');
    }
    const text = fs_1.default.readFileSync(fileName).toString();
    clipboardy_1.default.writeSync(text);
};
function createSnippet(snippetName) {
    const fileName = path_1.default.join(snippetsRoot, snippetName);
    const template = '---\ntags: []\nlanguage:\n---\n\n';
    fs_1.default.writeFileSync(fileName, template);
    child_process_1.default.spawn(EDITOR, [fileName], {
        stdio: 'inherit',
    });
}
function listSnippets() {
    _listSnips().forEach(item => console.log(item));
}
function editSnippet(snippetName) {
    if (snippetName) {
        _editSnip(snippetName);
    }
    else {
        fuzzy_list_1.fuzzyProcess(_editSnip, _listSnips());
    }
}
function copySnippet(snippetName) {
    if (snippetName) {
        _copySnip(snippetName);
    }
    else {
        fuzzy_list_1.fuzzyProcess(_copySnip, _listSnips());
    }
}
function checkFiles() {
    try {
        fs_1.default.mkdirSync(snippetsRoot);
        fs_1.default.writeFileSync(snippetsIndex, '[]');
    }
    catch (e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }
}
exports.default = {
    createSnippet,
    editSnippet,
    listSnippets,
    copySnippet,
    checkFiles,
};
//# sourceMappingURL=functions.js.map