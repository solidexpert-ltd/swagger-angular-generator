/* tslint:disable:max-line-length max-classes-per-file */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {HttpErrorResponse} from '@angular/common/http';
import {createAction, props} from '@ngrx/store';
import {PatchOrderParams} from '../../../../controllers/Order';

export enum Actions {
  START = '[Order patchOrder] Start',
  SUCCESS = '[Order patchOrder] Success',
  ERROR = '[Order patchOrder] Error',
}

export const start = createAction(Actions.START,props<PatchOrderParams>());
export const success = createAction(Actions.SUCCESS,props<object>());
export const error = createAction(Actions.ERROR,props<any>());
//PatchOrder