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
exports.generateHttpActions = generateHttpActions;
exports.getActionClassNameBase = getActionClassNameBase;
exports.getClassName = getClassName;
const _ = __importStar(require("lodash"));
const path = __importStar(require("path"));
const conf_1 = require("../../conf");
const utils_1 = require("../../utils");
function generateHttpActions(config, name, responseDef, actionClassNameBase, simpleName, formSubDirName, paramGroups) {
    let content = '';
    const hasParams = paramGroups.length >= 1;
    content += getActionImports(name, simpleName, hasParams, responseDef.type.startsWith('__model.'));
    content += getActionTypes(name, simpleName);
    content += getActionStartDefinition(simpleName, hasParams);
    content += getActionSuccessDefinition(responseDef);
    content += getActionErrorDefinition();
    content += getActionOverviewType(actionClassNameBase);
    const actionsFileName = path.join(formSubDirName, conf_1.stateDir, `actions.ts`);
    (0, utils_1.writeFile)(actionsFileName, content, config.header, 'ts', ['max-line-length', 'max-classes-per-file']);
}
function getActionImports(name, simpleName, hasParams, importModels) {
    let res = `import {HttpErrorResponse} from '@angular/common/http';\n`;
    res += `import {createAction, props} from '@ngrx/store';\n`;
    if (hasParams) {
        res += `import {${_.upperFirst(simpleName)}Params} from '../../../../controllers/${name}';\n`;
    }
    if (importModels)
        res += `import * as __model from '../../../../model';\n`;
    res += `\n`;
    return res;
}
function getActionTypes(controllerName, methodName) {
    let res = `export enum Actions {\n`;
    res += (0, utils_1.indent)([
        `START = '[${controllerName} ${methodName}] Start',`,
        `SUCCESS = '[${controllerName} ${methodName}] Success',`,
        `ERROR = '[${controllerName} ${methodName}] Error',`,
    ]);
    res += `\n}\n\n`;
    return res;
}
function getActionStartDefinition(name, hasParams) {
    const params = hasParams ? `,props<${_.upperFirst(name)}Params>()` : '';
    let res = `export const start = createAction(Actions.START${params});\n`;
    // let res = `export class Start implements Action {\n`;
    // res += indent(`readonly type = Actions.START;\n`);
    // const params = hasParams ? `public payload: ${ _.upperFirst(name) }Params` : '';
    // res += indent(`constructor(${params}) {}\n`);
    // res += `}\n`;
    // res += `\n`;
    return res;
}
function getActionSuccessDefinition(response) {
    const params = `,props<${response.type}>()`;
    let res = `export const success = createAction(Actions.SUCCESS${params});\n`;
    // let res = `export class Success implements Action {\n`;
    // res += indent(`readonly type = Actions.SUCCESS;\n`);
    // res += indent(`constructor(public payload: ${response.type}) {}\n`);
    // res += `}\n`;
    // res += `\n`;
    return res;
}
function getActionErrorDefinition() {
    const params = `,props<any>()`;
    let res = `export const error = createAction(Actions.ERROR${params});\n`;
    //let res = `export class Error implements Action {\n`;
    // res += indent(`readonly type = Actions.ERROR;\n`);
    // res += indent(`constructor(public payload: HttpErrorResponse) {}\n`);
    // res += `}\n`;
    // res += `\n`;
    return res;
}
function getActionOverviewType(actionClassNameBase) {
    return `//${actionClassNameBase}`;
}
function getActionClassNameBase(name) {
    return getClassName(name);
}
function getClassName(name) {
    return _.upperFirst(name);
}
//# sourceMappingURL=generate-http-actions.js.map