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
exports.generateHttpEffects = generateHttpEffects;
const path = __importStar(require("path"));
const _ = __importStar(require("lodash"));
const utils_1 = require("../../utils");
function generateHttpEffects(config, name, simpleName, actionClassNameBase, formSubDirName, paramGroups) {
    let content = '';
    content += getEffectsImports(name);
    content += getEffectsStartDefinition(actionClassNameBase);
    content += getEffectDefinition(actionClassNameBase, name, simpleName, paramGroups.length >= 1);
    content += getConstructorDefinition(name);
    content += `}\n`;
    const effectsFileName = path.join(formSubDirName, `states`, `effects.ts`);
    (0, utils_1.writeFile)(effectsFileName, content, config.header);
}
function getEffectsImports(name) {
    let res = `import {HttpErrorResponse} from '@angular/common/http';\n`;
    res += `import {Injectable} from '@angular/core';\n`;
    res += `import {Actions, createEffect, ofType} from '@ngrx/effects';\n`;
    res += '\n';
    res += `import {of} from 'rxjs';\n`;
    res += '\n';
    res += `import {catchError, map, switchMap} from 'rxjs/operators';\n`;
    res += `import {${name}Service} from '../../../../controllers/${name}';\n`;
    res += `import * as actions from './actions';\n`;
    res += `\n`;
    return res;
}
function getEffectsStartDefinition(actionClassNameBase) {
    let res = `@Injectable()\n`;
    res += `export class ${actionClassNameBase}Effects {\n`;
    return res;
}
function getConstructorDefinition(name) {
    let res = `constructor(\n`;
    res += (0, utils_1.indent)(`private storeActions: Actions,\n`);
    res += (0, utils_1.indent)(`private ${name.toLowerCase()}Service: ${name}Service,\n`);
    res += `) {}\n\n`;
    return (0, utils_1.indent)(res);
}
function getEffectDefinition(actionClassNameBase, name, simpleName, hasParams) {
    //const startActionPayloadDefinition = getStartActionPayloadDefinition(hasParams);
    let res = `${_.lowerFirst(actionClassNameBase)}$ = createEffect(()=>this.storeActions.pipe(\n`;
    res += (0, utils_1.indent)([`ofType(actions.Actions.START),\n`,
        `switchMap((action: any) => this.${name.toLowerCase()}Service.${simpleName}(action.payload)\n`], 2);
    res += (0, utils_1.indent)(`.pipe(\n`, 3);
    res += (0, utils_1.indent)([`map(result => ({ type: actions.Actions.SUCCESS, payload: result })),\n`,
        ` catchError((error: HttpErrorResponse) => of(({ type: actions.Actions.SUCCESS, payload: error }))),\n`], 4);
    res += (0, utils_1.indent)(`),\n`, 3);
    res += (0, utils_1.indent)(`),\n`, 2);
    res += `));\n\n//${hasParams}`;
    // let res = indent(`@Effect()\n`);
    // res += indent(`${actionClassNameBase} = this.storeActions.pipe(\n`);
    // res += indent(`ofType<actions.Start>(actions.Actions.START),\n`, 2);
    // const actionParam = hasParams ? 'action: actions.Start' : '';
    // res += indent(
    //   `switchMap((${actionParam}) => ` +
    //   `this.${name.toLowerCase()}Service.${simpleName}(${startActionPayloadDefinition})\n`, 2);
    // res += indent(`.pipe(\n`, 3);
    // res += indent(`map(result => new actions.Success(result)),\n`, 4);
    // res += indent(`catchError((error: HttpErrorResponse) => of(new actions.Error(error))),\n`, 4);
    // res += indent(`),\n`, 3);
    // res += indent(`),\n`, 2);
    // res += indent(`);\n`);
    res += '\n';
    return res;
}
// function getStartActionPayloadDefinition(hasParams: boolean) {
//   if (hasParams) return 'action.payload';
//   return '';
// }
//# sourceMappingURL=generate-http-effects.js.map