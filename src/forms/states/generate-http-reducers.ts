import * as path from 'path';
import * as _ from 'lodash';

import {stateDir} from '../../conf';
import {Config} from '../../generate';
import {indent, writeFile} from '../../utils';

export function generateHttpReducers(config: Config, name: string, actionClassNameBase: string,
                                     formSubDirName: string, responseType: string) {
  let content = '';
  content += getReducerImports(responseType.startsWith('__model.'));
  content += getStateInteface(actionClassNameBase, responseType);
  content += getInitialState(actionClassNameBase);
  content += getFeatureSelector(name, actionClassNameBase);
  content += getReducerDefinition(actionClassNameBase);

  const reducersFileName = path.join(formSubDirName, stateDir, `reducers.ts`);
  writeFile(reducersFileName, content, config.header);
}

function getReducerImports(usesModels: boolean) {
  let res = `import {createFeatureSelector, createReducer, on} from '@ngrx/store';\n\n`;
  res += `import {HttpErrorResponse} from '@angular/common/http';\n`;
  if (usesModels) res += `import * as __model from '../../../../model';\n`;
  res += `import * as actions from './actions';\n\n`;

  return res;
}

function getStateInteface(actionClassNameBase: string, type: string) {
  let res = `export interface ${actionClassNameBase}State {\n`;
  res += indent(`data: ${type} | null;\n`);
  res += indent(`loading: boolean;\n`);
  res += indent(`error: HttpErrorResponse | null;\n`);
  res += `}\n\n`;

  return res;
}

function getInitialState(actionClassNameBase: string) {
  let res = `export const initial${actionClassNameBase}State: ${actionClassNameBase}State = {\n`;
  res += indent(`data: null,\n`);
  res += indent(`loading: false,\n`);
  res += indent(`error: null,\n`);
  res += `};\n\n`;

  return res;
}

function getFeatureSelector(name: string, actionClassNameBase: string) {
  let res = `export const selectorName = '${name}_${actionClassNameBase}';\n`;
  res += `export const get${actionClassNameBase}StateSelector = ` +
         `createFeatureSelector<${actionClassNameBase}State>(selectorName);\n\n`;

  return res;
}

function getReducerDefinition(actionClassNameBase: string) {

  let res =  ` export const ${_.lowerFirst(actionClassNameBase)}Reducer = createReducer(`
  res += indent([
  `initial${actionClassNameBase}State,`,
    'on(actions.start, (state) => ({...state, loading: true, error: null})),',
    'on(actions.success, (state,action) => ({...state, data: action.payload, loading: false})),',
    'on(actions.error, (state,action) => ({...state, error: action.payload, loading: false}))',
  ], 2);
`  );`

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
  res += indent(`\n);\n`);

  return res;
}
