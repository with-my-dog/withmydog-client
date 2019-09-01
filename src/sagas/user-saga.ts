import { call, takeLatest, all } from 'redux-saga/effects';
import { Action } from 'redux-actions';
import {
  createUserAction, User, createUserRequest, handleRequest,
} from '../internal';

function* handleRequestCreateUser(action: Action<User>) {
  yield call(handleRequest, createUserRequest, createUserAction, action)
}
export function* userSaga() {
  yield all([
    takeLatest(createUserAction.TRIGGER, handleRequestCreateUser)
  ]);
}