/* tslint:disable:max-line-length max-classes-per-file */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {HttpErrorResponse} from '@angular/common/http';
import {createAction, props} from '@ngrx/store';

export enum Actions {
  START = '[Logout logout] Start',
  SUCCESS = '[Logout logout] Success',
  ERROR = '[Logout logout] Error',
}

export const start = createAction(Actions.START);
export const success = createAction(Actions.SUCCESS,props<object>());
export const error = createAction(Actions.ERROR,props<any>());
//Logout