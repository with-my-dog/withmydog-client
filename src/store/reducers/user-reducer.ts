import { handleActions } from 'redux-actions';
import produce, { Draft } from 'immer';
import {
  createUserAction, USER_ACTION,
} from '../../internal';

export interface UserState {
  fetchingCount: {[key in USER_ACTION]: number}
}

const initialFetchingCount = {
  [USER_ACTION.CREATE_USER]: 0,
};

const initialState: UserState = {
  fetchingCount: {...initialFetchingCount},
}

export const userReducer = handleActions<UserState, any>({
    [createUserAction.TRIGGER]: (
      state,
    ) => {
      // produce(currentState, producer: (draftState) => void): nextState
      return produce(state, (draftState: Draft<UserState>) => {
        draftState.fetchingCount[USER_ACTION.CREATE_USER]++;
      });
    },
    [createUserAction.FULFILL]: (
      state,
    ) => {
      return produce(state, (draftState: Draft<UserState>) => {
        draftState.fetchingCount[USER_ACTION.CREATE_USER]--;
      });
    }
  },
  initialState,
);