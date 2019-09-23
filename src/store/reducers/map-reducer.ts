import { handleActions } from 'redux-actions';
import produce, { Draft } from 'immer';
import {
  MAP_ACTION, selectMarkerAction,
} from '../../internal';

export interface MapState {
  selectedMarker?: string;
}

const intialState: MapState = {
  selectedMarker: undefined,
}

export const mapReducer = handleActions<MapState, any> ({
  [selectMarkerAction().type]: (
    state,
    actions,
  ) => {
    return produce(state, (draftState: Draft<MapState>) => {
      draftState.selectedMarker = actions.payload;
    })
  }
  }
  ,intialState,
);