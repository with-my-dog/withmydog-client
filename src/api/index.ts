import axios from 'axios';
import {
  User, API_ROOT,
} from '../internal';

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