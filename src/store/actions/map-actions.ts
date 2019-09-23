import {
  makeAction, REQUEST_STAGES,
} from './action-utils';

export enum MAP_ACTION {
  SELECT_MARKER = 'SELECTE_MARKER',
}

interface Map {
  selectedMarker: string;
}

export const selectMarkerAction = makeAction<Map>(MAP_ACTION.SELECT_MARKER, REQUEST_STAGES.TRIGGER);