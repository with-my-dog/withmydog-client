import { takeLatest, call, all } from 'redux-saga/effects';
import { Action } from 'redux-actions'
import { handleRequest, GeoLocationBoundary, getStoresAction, getStoreRequest } from '../internal';

function* handleRequestGetStores(action: Action<GeoLocationBoundary>) {
  yield call(handleRequest, getStoreRequest, getStoresAction, action);
}

export function * mapSaga() {
  yield all([
    takeLatest(getStoresAction.TRIGGER, handleRequestGetStores),
  ]);
}