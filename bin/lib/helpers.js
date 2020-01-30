"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function error(statement) {
    chalk_1.default.bold.red('[FAIL] ' + statement);
}
exports.default = {
    error,
};
//# sourceMappingURL=helpers.js.map