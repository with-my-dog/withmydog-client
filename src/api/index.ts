import axios from 'axios';
import { StoreType } from '../contants';
import {
  User, API_ROOT,
} from '../internal';
import { GeoLocationBoundary } from '../store/actions';

console.log('StoreType', StoreType);
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

export function createUserRequest(user: User) {
  const headers: any = {
    'content-type': 'application/json',
  };

  return axios.request({
    headers,
    method: 'post',
    url: `${API_ROOT}/users`,
    data: JSON.stringify(user),
  });
}

export function getStoreRequest(location: GeoLocationBoundary) {
  return {
    data: dummyMarkerList,
    status: 200,
    statusText: 'success',
    headers: undefined,
    config: undefined,
  }
}