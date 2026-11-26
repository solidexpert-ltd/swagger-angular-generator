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
exports.processDefinitions = processDefinitions;
exports.writeToBaseModelFile = writeToBaseModelFile;
exports.processDefinition = processDefinition;
exports.createExport = createExport;
/**
 * Processing of custom types from `definitions` section
 * in the schema
 */
const _ = __importStar(require("lodash"));
const path = __importStar(require("path"));
const common_1 = require("./common");
const conf = __importStar(require("./conf"));
const utils_1 = require("./utils");
/**
 * Entry point, processes all definitions and exports them
 * to individual files
 * @param defs definitions from the schema
 * @param config global configuration
 */
function processDefinitions(defs, config) {
    (0, utils_1.emptyDir)(path.join(config.dest, conf.defsDir));
    const definitions = [];
    const files = {};
    _.forOwn(defs, (v, source) => {
        const file = processDefinition(v, source, config);
        if (file && file.name) {
            const previous = files[file.name];
            if (previous === undefined)
                files[file.name] = [source];
            else
                previous.push(source);
            definitions.push(file);
        }
    });
    let allExports = '';
    _.forOwn(files, (sources, def) => {
        allExports += createExport(def) + createExportComments(def, sources) + '\n';
    });
    writeToBaseModelFile(config, allExports);
    return definitions;
}
function writeToBaseModelFile(config, allExports) {
    const filename = path.join(config.dest, `${conf.modelFile}.ts`);
    (0, utils_1.writeFile)(filename, allExports, config.header);
}
/**
 * Creates the file of the type definition
 * @param def type definition
 * @param name name of the type definition and after normalization of the resulting interface + file
 */
function processDefinition(def, name, config) {
    name = (0, common_1.normalizeDef)(name);
    let output = '';
    if (def.type === 'array') {
        const property = (0, common_1.processProperty)(def)[0];
        if (!property.native) {
            output += `import * as __${conf.modelFile} from \'../${conf.modelFile}\';\n\n`;
        }
        if (def.description)
            output += `/** ${def.description} */\n`;
        output += `export type ${name} = ${property.property};\n`;
    }
    else if (def.properties || def.additionalProperties) {
        const properties = (0, common_1.processProperty)(def, undefined, name);
        // conditional import of global types
        if (properties.some(p => !p.native)) {
            output += `import * as __${conf.modelFile} from \'../${conf.modelFile}\';\n\n`;
        }
        if (def.description)
            output += `/** ${def.description} */\n`;
        output += `export interface ${name} {\n`;
        output += (0, utils_1.indent)(_.map(properties, 'property').join('\n'));
        output += `\n}\n`;
        // concat non-empty enum lines
        const enumLines = _.map(properties, 'enumDeclaration').filter(Boolean).join('\n\n');
        if (enumLines)
            output += `\n${enumLines}\n`;
    }
    else if (def.type !== 'object') {
        const property = (0, common_1.processProperty)(def)[0];
        if (!property.native) {
            output += `import * as __${conf.modelFile} from \'../${conf.modelFile}\';\n\n`;
        }
        output += `export type ${name} = ${property.property};\n`;
    }
    const filename = path.join(config.dest, conf.defsDir, `${name}.ts`);
    (0, utils_1.writeFile)(filename, output, config.header);
    return { name, def };
}
/**
 * Creates single export line for `def` name
 * @param def name of the definition file w/o extension
 */
function createExport(def) {
    return `export * from './${conf.defsDir}/${def}';`;
}
/**
 * Creates comment naming source definitions for the export
 * @param def name of the definition file w/o extension
 * @param sources list of sources for the file
 */
function createExportComments(file, sources) {
    if (sources.length > 1 || !sources.includes(file)) {
        return ' // sources: ' + sources.join(', ');
    }
    return '';
}
//# sourceMappingURL=definitions.js.map