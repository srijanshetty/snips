"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuzzyProcess = void 0;
const tslib_1 = require("tslib");
const node_fzf_1 = tslib_1.__importDefault(require("node-fzf"));
const fuzzyProcess = (fn, items) => {
    (0, node_fzf_1.default)(items, (result) => {
        const { selected, query } = result;
        if (!selected) {
            console.log('No matches for:', query);
        }
        else {
            fn(selected.value);
        }
    });
};
exports.fuzzyProcess = fuzzyProcess;
//# sourceMappingURL=fuzzy-list.js.map