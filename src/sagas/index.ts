import { all, fork } from 'redux-saga/effects';
import { userSaga } from './user-saga';
import { mapSaga } from './map-saga';

export function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(mapSaga),
  ]);
}