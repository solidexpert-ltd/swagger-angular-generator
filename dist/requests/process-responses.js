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
exports.processResponses = processResponses;
/**
 * Processing of custom types from `paths` section
 * in the schema
 */
const _ = __importStar(require("lodash"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const common_1 = require("../common");
const conf = __importStar(require("../conf"));
const definitions_1 = require("../definitions");
/**
 * Process all responses of one method
 * @param httpResponse response object
 * @param name of the context for type name uniqueness
 * @param config global config
 */
function processResponses(httpResponse, name, config) {
    const responses = _.filter(httpResponse, (r, status) => (r.schema && Math.floor(Number(status) / 100) === 2));
    let properties = [];
    for (const response of responses) {
        if (response.schema && response.schema.properties) {
            const processedDefinition = processNestedSchemaDefinition(response.schema, name, config);
            const propertyOutput = {
                property: `__model.${processedDefinition.name}`,
                propertyAsMethodParameter: '',
                enumDeclaration: undefined,
                native: false,
                isRequired: false,
            };
            properties.push(propertyOutput);
        }
        else {
            properties = properties.concat((0, common_1.processProperty)(response.schema, undefined, name));
        }
    }
    const property = _.map(properties, 'property');
    const enumDeclaration = _.map(properties, 'enumDeclaration').filter(Boolean).join('\n\n');
    const usesGlobalType = properties.some(p => !p.native);
    let type;
    if (property.length) {
        type = _.uniqWith(property, _.isEqual).join(' | ');
    }
    else {
        type = 'void';
    }
    return { type, enumDeclaration, usesGlobalType };
}
function processNestedSchemaDefinition(schema, name, config) {
    const processedDef = (0, definitions_1.processDefinition)(schema, `${name}GeneratedInlineModel`, config);
    const filename = path.join(config.dest, `${conf.modelFile}.ts`);
    const exportDefiniton = (0, definitions_1.createExport)(processedDef.name);
    fs.appendFileSync(filename, `${exportDefiniton}\n`);
    return processedDef;
}
//# sourceMappingURL=process-responses.js.map