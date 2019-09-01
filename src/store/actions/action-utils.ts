import { createAction, ActionFunctionAny, Action } from 'redux-actions';

type ActionType<T> = ActionFunctionAny<Action<T>>;

interface RequestResponse<T> {
  data: T
}

export interface AsyncAction<T = any> extends ActionType<string> {
  triggerAction: ActionType<string>;
  requestAction: ActionType<string>;
  successAction: ActionType<T>;
  failAction: ActionType<any>;
  fulfillAction: ActionType<string>;
  TRIGGER: string;
  REQUEST: string;
  SUCCESS: string;
  FAIL: string;
  FULFILL: string;
}

enum REQUEST_STAGES {
  TRIGGER = 'TRIGGER', // 액션이 트리거 됨을 의미함, saga가 Middleware에서 훅하는 액션으로만 의미를 가짐
  REQUEST = 'REQUEST', // saga가 API를 호출하기 전에 dispatch되는 액션
  SUCCESS = 'SUCCESS', // 요청한 API의 response가 성공적으로 들어옴
  FAIL = 'FAIL', // 요청한 API가 실패함
  FULFILL = 'FULFILL', // saga로 들어온 액션이 최종적으로 마무리됨
}

const asyncStages = [
  REQUEST_STAGES.TRIGGER,
  REQUEST_STAGES.REQUEST,
  REQUEST_STAGES.SUCCESS,
  REQUEST_STAGES.FAIL,
  REQUEST_STAGES.FULFILL,
];

export function makeAction<Payload>(type: string, stage: string): ActionType<Payload> {
  return createAction<Payload>(`${type}/${stage}`);
}

export function makeAsyncAction<Payload, Response>(type: string): AsyncAction<RequestResponse<Response>> {
  return asyncStages.reduce((result, stage) => {
    const actionCreator = makeAction(type, stage);
    return Object.assign(result, {
      [`${stage.toLowerCase()}Action`]: actionCreator,
      [stage.toUpperCase()]: actionCreator.toString(),
    })
  }, makeAction(type, REQUEST_STAGES.TRIGGER)) as AsyncAction<RequestResponse<Response>>;
}