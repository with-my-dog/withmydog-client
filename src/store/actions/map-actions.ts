import {
  makeAction, REQUEST_STAGES, makeAsyncAction,
} from './action-utils';
import { LatLng } from '../../internal';

export enum MAP_ACTION {
  SELECT_MARKER = 'SELECTE_MARKER',
  GET_STORES = 'GET_STORES',
}

interface Map {
  selectedMarker: string;
}

export interface GeoLocationBoundary {
  sw: LatLng,
  ne: LatLng,
}

export const selectMarkerAction = makeAction<Map>(MAP_ACTION.SELECT_MARKER, REQUEST_STAGES.TRIGGER);
export const getStoresAction = makeAsyncAction<GeoLocationBoundary, unknown>(MAP_ACTION.GET_STORES);