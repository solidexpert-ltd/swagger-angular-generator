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
exports.generateHttpReducers = generateHttpReducers;
const path = __importStar(require("path"));
const _ = __importStar(require("lodash"));
const conf_1 = require("../../conf");
const utils_1 = require("../../utils");
function generateHttpReducers(config, name, actionClassNameBase, formSubDirName, responseType) {
    let content = '';
    content += getReducerImports(responseType.startsWith('__model.'));
    content += getStateInteface(actionClassNameBase, responseType);
    content += getInitialState(actionClassNameBase);
    content += getFeatureSelector(name, actionClassNameBase);
    content += getReducerDefinition(actionClassNameBase);
    const reducersFileName = path.join(formSubDirName, conf_1.stateDir, `reducers.ts`);
    (0, utils_1.writeFile)(reducersFileName, content, config.header);
}
function getReducerImports(usesModels) {
    let res = `import {createFeatureSelector, createReducer, on} from '@ngrx/store';\n\n`;
    res += `import {HttpErrorResponse} from '@angular/common/http';\n`;
    if (usesModels)
        res += `import * as __model from '../../../../model';\n`;
    res += `import * as actions from './actions';\n\n`;
    return res;
}
function getStateInteface(actionClassNameBase, type) {
    let res = `export interface ${actionClassNameBase}State {\n`;
    res += (0, utils_1.indent)(`data: ${type} | null;\n`);
    res += (0, utils_1.indent)(`loading: boolean;\n`);
    res += (0, utils_1.indent)(`error: HttpErrorResponse | null;\n`);
    res += `}\n\n`;
    return res;
}
function getInitialState(actionClassNameBase) {
    let res = `export const initial${actionClassNameBase}State: ${actionClassNameBase}State = {\n`;
    res += (0, utils_1.indent)(`data: null,\n`);
    res += (0, utils_1.indent)(`loading: false,\n`);
    res += (0, utils_1.indent)(`error: null,\n`);
    res += `};\n\n`;
    return res;
}
function getFeatureSelector(name, actionClassNameBase) {
    let res = `export const selectorName = '${name}_${actionClassNameBase}';\n`;
    res += `export const get${actionClassNameBase}StateSelector = ` +
        `createFeatureSelector<${actionClassNameBase}State>(selectorName);\n\n`;
    return res;
}
function getReducerDefinition(actionClassNameBase) {
    let res = ` export const ${_.lowerFirst(actionClassNameBase)}Reducer = createReducer(`;
    res += (0, utils_1.indent)([
        `initial${actionClassNameBase}State,`,
        'on(actions.start, (state) => ({...state, loading: true, error: null})),',
        'on(actions.success, (state,action) => ({...state, data: action.payload, loading: false})),',
        'on(actions.error, (state,action) => ({...state, error: action.payload, loading: false}))',
    ], 2);
    `  );`;
    //let res = `export function ${actionClassNameBase}Reducer(\n`;
    //res += indent(`state: ${actionClassNameBase}State = initial${actionClassNameBase}State,\n`);
    //res += indent(`action: actions.${actionClassNameBase}Action): ${actionClassNameBase}State {\n\n`);
    //res += indent(`switch (action.type) {\n`);
    //res += indent([
    //  'case actions.Actions.START: return {...state, loading: true, error: null};',
    //  'case actions.Actions.SUCCESS: return {...state, data: action.payload, loading: false};',
    //   'case actions.Actions.ERROR: return {...state, error: action.payload, loading: false};',
    //   'default: return state;',
    // ], 2);
    res += (0, utils_1.indent)(`\n);\n`);
    return res;
}
//# sourceMappingURL=generate-http-reducers.js.map