/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {createFeatureSelector, createReducer, on} from '@ngrx/store';

import {HttpErrorResponse} from '@angular/common/http';
import * as actions from './actions';

export interface RegistrationState {
  data: object | null;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialRegistrationState: RegistrationState = {
  data: null,
  loading: false,
  error: null,
};

export const selectorName = 'Registration_Registration';
export const getRegistrationStateSelector = createFeatureSelector<RegistrationState>(selectorName);

 export const registrationReducer = createReducer(    initialRegistrationState,
    on(actions.start, (state) => ({...state, loading: true, error: null})),
    on(actions.success, (state,action) => ({...state, data: action.payload, loading: false})),
    on(actions.error, (state,action) => ({...state, error: action.payload, loading: false}))
  );
