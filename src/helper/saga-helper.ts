import { Action } from 'redux-actions';
import { put, call } from 'redux-saga/effects';
import {
  AsyncAction,
} from '../internal'; 
export function* handleRequest<T>(api: any, asyncAction: AsyncAction, action: Action<T>) {
  const payload = action.payload;
  try {
    yield put(asyncAction.requestAction());
    const response = yield call(api, payload);
    yield put(asyncAction.successAction(response.data));
    console.log('response', response);
  } catch(e) {
    if (e.response) {
      // API 요청이 이루이지고 서버에서 2xx 이외으 상태코드로 응답한 경우
      console.log('error response.data:', e.response.data);
      console.log('error response.status:', e.response.status);
      console.log('error response.header:', e.response.headers);
    } else if (e.request) {
      // API 요청을 했지만 응답을 수신하지 못한경우, e.request는 브라우저의 경우에는
      // XMLHttpRequest를 의미함
      console.log('error request:', e.request);
    } else {
      // 에러를 발생시킨 request를 설정하는 중에 문제가 발생함
      // 아마 500번대 서버에러인 경우 같음
      console.log('error message:', e.message);
    }
    yield put(asyncAction.failAction());
  } finally {
    yield put(asyncAction.fulfillAction());
  }
}