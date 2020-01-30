"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const child_process_1 = tslib_1.__importDefault(require("child_process"));
const copy_to_clipboard_1 = tslib_1.__importDefault(require("copy-to-clipboard"));
const front_matter_1 = tslib_1.__importDefault(require("front-matter"));
const helpers_1 = tslib_1.__importDefault(require("./helpers"));
const HOME = (_a = process.env.HOME, (_a !== null && _a !== void 0 ? _a : '~'));
const EDITOR = (_b = process.env.EDITOR, (_b !== null && _b !== void 0 ? _b : 'vim'));
const snippetsRoot = path_1.default.join(HOME, '.snips');
const snippetsIndex = path_1.default.join(HOME, '.snipsIndex');
function createSnippet(snippetName) {
    const fileName = path_1.default.join(snippetsRoot, snippetName);
    const template = '---\ntags: []\nlanguage:\n---\n\n';
    fs_1.default.writeFileSync(fileName, template);
    const editor = child_process_1.default.spawn(EDITOR, [fileName], {
        stdio: 'inherit',
    });
    editor.on('exit', () => {
        fs_1.default.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                helpers_1.default.error('Filesystem error');
                fs_1.default.unlinkSync(fileName);
                throw new Error('Filesystem error');
            }
            const content = front_matter_1.default(data);
            const body = content.body;
            const metadata = {
                tags: content.attributes.tags,
                language: content.attributes.language,
            };
            fs_1.default.writeFile(fileName, body, () => {
                if (err) {
                    helpers_1.default.error('could not write contents to file');
                    fs_1.default.unlinkSync(fileName);
                    throw new Error('could not write contents to file');
                }
                const index = JSON.parse(fs_1.default.readFileSync(snippetsIndex, 'utf-8'));
                index[fileName] = metadata;
                fs_1.default.writeFileSync(snippetsIndex, JSON.stringify(index));
            });
        });
    });
}
function editSnippet(snippetName) {
    const fileName = path_1.default.join(snippetsRoot, snippetName);
    child_process_1.default.spawn(EDITOR, [fileName], {
        stdio: 'inherit',
    });
}
function listSnippets() {
    fs_1.default.readdir(snippetsRoot, (err, items) => {
        if (err) {
            helpers_1.default.error('snippets root folder not found');
            throw new Error('snippets root folder not found');
        }
        for (const item of items) {
            console.log(item);
        }
    });
}
function copySnippet(snippetName) {
    const fileName = path_1.default.join(snippetsRoot, snippetName);
    if (!fs_1.default.existsSync(fileName)) {
        throw new Error('Snippet with given name already exists');
    }
    const text = fs_1.default.readFileSync(fileName).toString();
    copy_to_clipboard_1.default(text);
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