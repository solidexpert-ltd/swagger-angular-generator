/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import {of} from 'rxjs';

import {catchError, map, switchMap} from 'rxjs/operators';
import {RegistrationService} from '../../../../controllers/Registration';
import * as actions from './actions';

@Injectable()
export class RegistrationEffects {
registration$ = createEffect(()=>this.storeActions.pipe(
    ofType(actions.Actions.START),

    switchMap((action: any) => this.registrationService.registration(action.payload)
      .pipe(
        map(result => ({ type: actions.Actions.SUCCESS, payload: result })),

         catchError((error: HttpErrorResponse) => of(({ type: actions.Actions.SUCCESS, payload: error }))),
      ),
    ),
));

//true
  constructor(
    private storeActions: Actions,
    private registrationService: RegistrationService,
  ) {}
}
