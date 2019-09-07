import { Reducer, combineReducers } from 'redux';
import { userReducer, UserState } from './user-reducer';

export interface RootState {
    userReducer: UserState;
}
export const rootReducer = (history: any): Reducer<RootState> => combineReducers({
    // ...reducers
    userReducer,
});
