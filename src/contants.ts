export const API_ROOT = 'http://www.withmydog.io';

export interface LatLng {
  Lat: number;
  Lng: number;
}

export enum StoreType {
  cafe = 'CAFE',
  restaurant = 'RESTAURANT',
  pub = 'PUB',
}

export interface Store {
  id: string;
  type: StoreType;
  position: LatLng;
  canBigDog?: boolean;
}