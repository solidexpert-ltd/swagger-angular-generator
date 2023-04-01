/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * v1
 * example.com/api-base-path
 */

import {NgModule} from '@angular/core';
import {EffectsModule as NgrxEffectsModule} from '@ngrx/effects';
import {StoreModule as NgrxStoreModule} from '@ngrx/store';

import {GoodsService} from '../../../controllers/Goods';
import {FormsSharedModule} from '../../forms-shared.module';
import {GetGoodsListFormService} from './getGoodsList.service';

import {GetGoodsListEffects} from './states/effects';
import {getGoodsListReducer} from './states/reducers';
import {selectorName} from './states/reducers';

@NgModule({
  imports: [
    FormsSharedModule,
    NgrxStoreModule.forFeature(selectorName, getGoodsListReducer),
    NgrxEffectsModule.forFeature([GetGoodsListEffects]),
  ],
  providers: [
    GoodsService,
    GetGoodsListFormService,
  ],
})
export class GetGoodsListModule {}
