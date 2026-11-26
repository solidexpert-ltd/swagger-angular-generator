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
exports.processParams = processParams;
exports.parameterToSchema = parameterToSchema;
/**
 * Processing of custom types from `paths` section
 * in the schema
 */
const _ = __importStar(require("lodash"));
const common_1 = require("../common");
const utils_1 = require("../utils");
/**
 * Transforms input parameters to interfaces definition
 * @param def definition
 * @param paramsType name of the type
 */
function processParams(def, paramsType) {
    let paramDef = '';
    let typesOnly = '';
    paramDef += `export interface ${paramsType} {\n`;
    const params = _.map(def, p => (0, common_1.processProperty)(parameterToSchema(p), p.name, paramsType, p.required)[0]);
    const isInterfaceEmpty = !params.length;
    const usesGlobalType = params.some(p => !p.native);
    paramDef += (0, utils_1.indent)(_.map(params, 'property'));
    paramDef += `\n`;
    paramDef += `}\n`;
    const enums = _.map(params, 'enumDeclaration').filter(Boolean);
    if (enums.length) {
        paramDef += `\n`;
        paramDef += enums.join('\n\n');
        paramDef += `\n`;
    }
    params.sort((p1, p2) => (p1.isRequired ? 0 : 1) - (p2.isRequired ? 0 : 1));
    typesOnly = params.map(p => p.propertyAsMethodParameter).join(', ');
    return { paramDef, typesOnly, usesGlobalType, isInterfaceEmpty };
}
// TODO! use required array to set the variable
// TODO might be unnecessary for v3.0+ of OpenAPI spec
// https://swagger.io/specification/#parameterObject
function parameterToSchema(param) {
    return Object.assign({
        allowEmptyValue: param.allowEmptyValue,
        default: param.default,
        description: param.description,
        enum: param.enum,
        format: param.format,
        items: param.items,
        maximum: param.maximum,
        maxLength: param.maxLength,
        minimum: param.minimum,
        minLength: param.minLength,
        pattern: param.pattern,
        type: param.type,
        uniqueItems: param.uniqueItems,
    }, param.schema);
}
//# sourceMappingURL=process-params.js.map