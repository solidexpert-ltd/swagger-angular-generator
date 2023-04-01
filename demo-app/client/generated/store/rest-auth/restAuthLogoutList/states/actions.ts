/* tslint:disable:max-line-length max-classes-per-file */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {HttpErrorResponse} from '@angular/common/http';
import {createAction, props} from '@ngrx/store';

export enum Actions {
  START = '[RestAuth restAuthLogoutList] Start',
  SUCCESS = '[RestAuth restAuthLogoutList] Success',
  ERROR = '[RestAuth restAuthLogoutList] Error',
}

export const start = createAction(Actions.START);
export const success = createAction(Actions.SUCCESS,props<void>());
export const error = createAction(Actions.ERROR,props<any>());
//RestAuthLogoutList