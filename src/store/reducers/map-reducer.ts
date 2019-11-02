import { handleActions } from 'redux-actions';
import produce, { Draft } from 'immer';
import {
  MAP_ACTION, selectMarkerAction, StoreType, Store,
} from '../../internal';
import { getStoresAction } from '../actions';

const initialFetchingCount = {
  [MAP_ACTION.SELECT_MARKER]: 0,
  [MAP_ACTION.GET_STORES]: 0,
};

export interface MapState {
  selectedMarker?: string;
  stores: Store[];
  fetchingCount: {[key in MAP_ACTION]: number};
}


const dummyMarkerList = [
  {
      id: '1',
      type: StoreType.cafe,
      position: {
          Lat: 37.552617, Lng: 126.904614
      }
  },
  {
      id: '2',
      type: StoreType.restaurant,
      position: {
          Lat: 37.553617, Lng: 126.905614
      },
      canBigDog: true,
  },
  {
      id: '3',
      type: StoreType.pub,
      position: {
          Lat: 37.551617, Lng: 126.903614
      }
  },
  {
      id: '4',
      type: StoreType.cafe,
      position: {
          Lat: 37.551617, Lng: 126.903614
      }
  },
]

const intialState: MapState = {
  selectedMarker: undefined,
  stores: [], 
  fetchingCount: {...initialFetchingCount},
}

export const mapReducer = handleActions<MapState, any> ({
  [selectMarkerAction().type]: (
    state,
    actions,
  ) => {
    return produce(state, (draftState: Draft<MapState>) => {
      draftState.selectedMarker = actions.payload;
    });
  },

  // get stores
  [getStoresAction.REQUEST]: (
    state,
    actions,
  ) => {
    return produce(state, (draftState: Draft<MapState>) => {
      draftState.fetchingCount[MAP_ACTION.GET_STORES]++;
    });
  },
  [getStoresAction.SUCCESS]: (
    state,
    actions,
  ) => {
    return produce(state, (draftState: Draft<MapState>) => {
      console.log('get store success', actions);
      draftState.stores = actions.payload;
    });
  },
  [getStoresAction.FAIL]: (
    state,
    actions,
  ) => {
    return produce(state, (draftState: Draft<MapState>) => {
    });
  },
  [getStoresAction.FULFILL]: (
    state,
    actions,
  ) => {
    return produce(state, (draftState: Draft<MapState>) => {
      draftState.fetchingCount[MAP_ACTION.GET_STORES]--;
    });
  },


}, intialState);