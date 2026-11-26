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
exports.processController = processController;
/**
 * Processing of custom types from `paths` section
 * in the schema
 */
const _ = __importStar(require("lodash"));
const path = __importStar(require("path"));
const conf = __importStar(require("../conf"));
const generate_form_modules_1 = require("../forms/generate-form-modules");
const utils_1 = require("../utils");
const process_method_1 = require("./process-method");
const process_responses_1 = require("./process-responses");
/**
 * Creates and serializes class for api communication for controller
 * @param controllers list of methods of the controller
 * @param name
 */
function processController(methods, name, config, definitions) {
    const filename = path.join(config.dest, conf.apiDir, `${name}.ts`);
    let usesGlobalType = false;
    // make simpleNames unique and process responses
    const simpleNames = _.map(methods, 'simpleName');
    methods.forEach(controller => {
        if (simpleNames.filter(n => n === controller.simpleName).length > 1) {
            const preserveCapitals = controller.operationId.replace(/([A-Z])/g, '-$1');
            controller.simpleName = _.lowerFirst(_.camelCase(preserveCapitals));
        }
        controller.responseDef = (0, process_responses_1.processResponses)(controller.responses, controller.simpleName, config);
        usesGlobalType = usesGlobalType || controller.responseDef.usesGlobalType;
    });
    const processedMethods = methods.map(m => (0, process_method_1.processMethod)(m, config.unwrapSingleParamMethods));
    usesGlobalType = usesGlobalType || processedMethods.some(c => c.usesGlobalType);
    let content = '';
    const angularCommonHttp = ['HttpClient'];
    if (processedMethods.some(c => 'header' in c.paramGroups)) {
        angularCommonHttp.push('HttpHeaders');
    }
    if (processedMethods.some(c => 'query' in c.paramGroups)) {
        angularCommonHttp.push('HttpParams');
    }
    content += `import {${angularCommonHttp.join(', ')}} from \'@angular/common/http\';\n`;
    content += 'import {Injectable} from \'@angular/core\';\n';
    content += 'import {Observable} from \'rxjs\';\n\n';
    if (usesGlobalType) {
        content += `import * as __${conf.modelFile} from \'../${conf.modelFile}\';\n\n`;
    }
    const interfaceDef = _.map(processedMethods, 'interfaceDef').filter(Boolean).join('\n');
    if (interfaceDef) {
        content += interfaceDef;
        content += '\n';
    }
    content += `@Injectable()\n`;
    content += `export class ${name}Service {\n`;
    content += (0, utils_1.indent)('constructor(private http: HttpClient) {}');
    content += '\n';
    content += (0, utils_1.indent)(_.map(processedMethods, 'methodDef').join('\n\n'));
    content += '\n}\n';
    if (conf.adHocExceptions.api[name]) {
        content = content.replace(conf.adHocExceptions.api[name][0], conf.adHocExceptions.api[name][1]);
    }
    // controllers
    (0, utils_1.writeFile)(filename, content, config.header);
    // forms
    (0, generate_form_modules_1.createForms)(config, name, processedMethods, definitions);
}
//# sourceMappingURL=process-controller.js.map