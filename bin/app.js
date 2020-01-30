#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = tslib_1.__importDefault(require("commander"));
const functions_1 = tslib_1.__importDefault(require("./lib/functions"));
functions_1.default.checkFiles();
commander_1.default
    .command('new [snippet-name]')
    .description('Create a code snippet with given name')
    .action(functions_1.default.createSnippet);
commander_1.default
    .command('edit [snippet-name]')
    .description('Edit an existing code snippet')
    .action(functions_1.default.editSnippet);
commander_1.default
    .command('list')
    .description('List all snippets')
    .action(functions_1.default.listSnippets);
commander_1.default
    .command('copy [snippet-name]')
    .description('Copy snippet to clipboard if it exists')
    .action(functions_1.default.copySnippet);
if (!process.argv.slice(2).length) {
    functions_1.default.listSnippets();
}
commander_1.default.parse(process.argv);
//# sourceMappingURL=app.js.map