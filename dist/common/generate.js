"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUtils = addUtils;
exports.addFormExtensions = addFormExtensions;
exports.writeTemplate = writeTemplate;
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("../utils");
function addUtils(dest) {
    writeTemplate((0, path_1.join)(dest, `utils.ts`));
}
function addFormExtensions(dest) {
    writeTemplate((0, path_1.join)(dest, `formArrayExtended.ts`));
    writeTemplate((0, path_1.join)(dest, `formMap.ts`));
}
function writeTemplate(dst) {
    const srcFileName = (0, path_1.join)(__dirname, 'templates', (0, path_1.basename)(dst));
    const dstFileName = (0, path_1.join)(dst);
    const content = (0, fs_1.readFileSync)(srcFileName).toString();
    (0, utils_1.writeFile)(dstFileName, content, undefined, 'ts', []);
}
//# sourceMappingURL=generate.js.map