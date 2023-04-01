/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {createFeatureSelector, createReducer, on} from '@ngrx/store';

import {HttpErrorResponse} from '@angular/common/http';
import * as actions from './actions';

export interface LoginState {
  data: object | null;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialLoginState: LoginState = {
  data: null,
  loading: false,
  error: null,
};

export const selectorName = 'Login_Login';
export const getLoginStateSelector = createFeatureSelector<LoginState>(selectorName);

 export const loginReducer = createReducer(    initialLoginState,
    on(actions.start, (state) => ({...state, loading: true, error: null})),
    on(actions.success, (state,action) => ({...state, data: action.payload, loading: false})),
    on(actions.error, (state,action) => ({...state, error: action.payload, loading: false}))
  );
