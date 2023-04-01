/* tslint:disable:max-line-length max-classes-per-file */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {HttpErrorResponse} from '@angular/common/http';
import {createAction, props} from '@ngrx/store';
import {RegistrationParams} from '../../../../controllers/Registration';

export enum Actions {
  START = '[Registration registration] Start',
  SUCCESS = '[Registration registration] Success',
  ERROR = '[Registration registration] Error',
}

export const start = createAction(Actions.START,props<RegistrationParams>());
export const success = createAction(Actions.SUCCESS,props<object>());
export const error = createAction(Actions.ERROR,props<any>());
//Registration