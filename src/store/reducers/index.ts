import { Reducer, combineReducers } from 'redux';
import { userReducer, UserState } from './user-reducer';
import { mapReducer, MapState } from './map-reducer';

export interface RootState {
    userReducer: UserState;
    mapReducer: MapState,
}
export const rootReducer = (history: any): Reducer<RootState> => combineReducers({
    // ...reducers
    userReducer,
    mapReducer,
});
