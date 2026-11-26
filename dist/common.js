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
exports.processProperty = processProperty;
exports.normalizeDef = normalizeDef;
exports.translateType = translateType;
exports.getAccessor = getAccessor;
exports.getObjectPropSetter = getObjectPropSetter;
const _ = __importStar(require("lodash"));
const tsutils_1 = require("tsutils");
const conf = __importStar(require("./conf"));
const utils_1 = require("./utils");
/**
 * Processes one property of the type
 * @param prop property definition
 * @param name property name
 * @param namespace usage context for type name uniqueness
 */
function processProperty(prop, name = '', namespace = '', required = false, exportEnums = true) {
    let type;
    let enumDeclaration;
    let native = true;
    let isMap = false;
    let readOnly = '';
    if (prop.readOnly)
        readOnly = 'readonly ';
    let optional = '';
    if (required === false && !isMap)
        optional = '?';
    else if (Array.isArray(required) && !required.includes(name)) {
        optional = '?';
    }
    const comments = [];
    if (prop.description)
        comments.push(prop.description);
    if (prop.example)
        comments.push(`example: ${prop.example}`);
    if (prop.format)
        comments.push(`format: ${prop.format}`);
    if (prop.default)
        comments.push(`default: ${prop.default}`);
    const comment = (0, utils_1.makeComment)(comments);
    if (prop.properties) {
        if (name && name.length > 1) {
            let output1 = `{\n`;
            output1 += (0, utils_1.indent)(_.map(_.flatMap(prop.properties, (v, k) => processProperty(v, k, namespace, prop.required)), 'property').join('\n'));
            output1 += `\n}\n`;
            let property1 = `${comment}${readOnly}${name}: ${output1};`;
            let propertyAsMethodParameter1 = `${name}: ${output1}`;
            return [{ property: property1, propertyAsMethodParameter: propertyAsMethodParameter1, enumDeclaration, native, isRequired: optional !== '?' }];
        }
        else {
            return _.flatMap(prop.properties, (v, k) => processProperty(v, k, namespace, prop.required));
        }
    }
    if (prop.enum || (prop.items && prop.items.enum)) {
        type = _.upperFirst(name);
        // file added to make the enum globally unique
        type += _.upperFirst(namespace);
        if (!type.match(/Enum/))
            type += 'Enum';
        const list = prop.enum || prop.items.enum;
        const exp = exportEnums ? 'export ' : '';
        let enumValues;
        if (typeof list[0] === 'number') {
            enumValues = (0, utils_1.indent)(list.join(' |\n'));
        }
        else {
            enumValues = (0, utils_1.indent)('\'' + list.join('\' |\n\'')) + '\'';
        }
        enumDeclaration = `${exp}type ${type} =\n${enumValues};`;
        if (prop.type === 'array')
            type += '[]';
    }
    else {
        let defType;
        switch (prop.type) {
            case undefined:
                defType = translateType(prop.$ref);
                type = defType.type;
                break;
            case 'array':
                defType = translateType(prop.items && (prop.items.type || prop.items.$ref));
                const itemProp = processProperty(prop.items)[0];
                if (defType.native && defType.type == 'object') {
                    let lastindex = itemProp.property.lastIndexOf(";");
                    if (lastindex != -1)
                        itemProp.property = itemProp.property.substring(0, lastindex);
                    type = `{${itemProp.property}}[]`;
                }
                else {
                    type = `${itemProp.property}[]`;
                }
                break;
            default:
                if (prop.additionalProperties) {
                    const ap = prop.additionalProperties;
                    let additionalType;
                    if (ap.type === 'array') {
                        defType = translateType(ap.items && (ap.items.type || ap.items.$ref));
                        additionalType = `${defType.type}[]`;
                    }
                    else {
                        defType = translateType(prop.additionalProperties.type ||
                            prop.additionalProperties.$ref);
                        additionalType = defType.type;
                    }
                    if (name) {
                        type = `{[key: string]: ${additionalType}}`;
                    }
                    else {
                        name = '[key: string]';
                        type = additionalType;
                        isMap = true;
                    }
                }
                else {
                    defType = translateType(prop.type);
                    type = defType.type;
                }
        }
        native = defType.native;
    }
    let property;
    let propertyAsMethodParameter;
    // pure type is returned if no name is specified
    if (name) {
        if (!isMap) {
            name = getAccessor(name);
            property = `${comment}${readOnly}${name}${optional}: ${type};`;
            propertyAsMethodParameter = `${name}${optional}: ${type}`;
        }
        else {
            property = `${comment}${readOnly}${name}: ${type};`;
            propertyAsMethodParameter = `${name}: ${type}`;
        }
    }
    else {
        property = `${type}`;
        propertyAsMethodParameter = property;
    }
    return [{ property, propertyAsMethodParameter, enumDeclaration, native, isRequired: optional !== '?' }];
}
/**
 * - recursive inside-out unwrapping of generics
 * - space removal e.g.
 *   getFilename('PagedResources«Page«ItemCategoryDto»»') =>
 *               'ItemCategoryDtoPagePagedResources'
 * @param type original type name
 * @return normalized type name
 */
function normalizeDef(type) {
    let res = '';
    while (true) {
        const generic = type.match(/([^«]+)«(.+)»/);
        if (!generic) {
            break;
        }
        res = generic[1] + res;
        type = generic[2];
    }
    res = type + res;
    res = res.trim();
    res = res.replace(/\./g, ' ');
    if (res.match(/ /)) {
        res = _.camelCase(res);
    }
    res = _.upperFirst(res);
    return res;
}
/**
 * Translates schema type into native/defined type for typescript
 * @param type definition
 */
function translateType(type) {
    if (type == null || type == 'undefined' || typeof (type) == undefined)
        return { type: conf.nativeTypes['object'], native: true };
    if (type in conf.nativeTypes) {
        const typeType = type;
        return { type: conf.nativeTypes[typeType], native: true };
    }
    const subtype = type.match(/^#\/components\/schemas\/(.*)/) || type.match(/^#\/definitions\/(.*)/);
    if (subtype)
        return resolveDefType(subtype[1]);
    return { type, native: true };
}
/**
 * Checks whether the type should reference internally defined type
 * and returns its reference to globally exported interfaces
 * @param type
 */
function resolveDefType(type) {
    // check direct native types for definitions and generics
    // does not seem to happen but the function is ready for that
    if (type in conf.nativeTypes) {
        const typedType = type;
        return { type: conf.nativeTypes[typedType], native: true };
    }
    type = normalizeDef(type);
    return { type: `__${conf.modelFile}.${type}`, native: false };
}
function getAccessor(key, propName = '') {
    let res = key;
    if ((0, tsutils_1.isValidPropertyName)(key)) {
        if (propName)
            return `${propName}.${res}`;
        return res;
    }
    res = `'${res}'`;
    if (propName)
        return `${propName}[${res}]`;
    return res;
}
function getObjectPropSetter(key, propName, suffix = '') {
    return `${getAccessor(key)}: ${getAccessor(key, propName)}${suffix},`;
}
//# sourceMappingURL=common.js.map