"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModule = createModule;
const path = __importStar(require("path"));
const _ = __importStar(require("lodash"));
const utils_1 = require("../utils");
function createModule(config, name, actionClassNameBase, formSubDirName, simpleName, className, addForm) {
    let content = `import {NgModule} from '@angular/core';\n`;
    content += `import {EffectsModule as NgrxEffectsModule} from '@ngrx/effects';\n`;
    content += `import {StoreModule as NgrxStoreModule} from '@ngrx/store';\n`;
    content += '\n';
    content += `import {${name}Service} from '../../../controllers/${name}';\n`;
    // TODO! use or remove
    content += `import {FormsSharedModule} from '../../forms-shared.module';\n`;
    if (addForm)
        content += `import {${className}FormService} from './${simpleName}.service';\n`;
    content += `\n`;
    content += `import {${actionClassNameBase}Effects} from './states/effects';\n`;
    content += `import {${_.lowerFirst(actionClassNameBase)}Reducer} from './states/reducers';\n`;
    content += `import {selectorName} from './states/reducers';\n`;
    content += '\n';
    content += '@NgModule({\n';
    content += (0, utils_1.indent)('imports: [\n');
    // TODO! use or remove
    content += (0, utils_1.indent)('FormsSharedModule,\n', 2);
    content += (0, utils_1.indent)(`NgrxStoreModule.forFeature(selectorName, ${_.lowerFirst(actionClassNameBase)}Reducer),\n`, 2);
    content += (0, utils_1.indent)(`NgrxEffectsModule.forFeature([${actionClassNameBase}Effects]),\n`, 2);
    content += (0, utils_1.indent)('],\n');
    const providers = [`${name}Service,`];
    if (addForm)
        providers.push(`${className}FormService,`);
    content += (0, utils_1.indent)('providers: [\n');
    content += (0, utils_1.indent)(providers, 2);
    content += '\n';
    content += (0, utils_1.indent)('],\n');
    content += '})\n';
    content += `export class ${className}Module {}\n`;
    const moduleFileName = path.join(formSubDirName, `${simpleName}.module.ts`);
    (0, utils_1.writeFile)(moduleFileName, content, config.header);
}
//# sourceMappingURL=process-module.js.map