import {
  makeAsyncAction
} from './action-utils';

export enum USER_ACTION {
  CREATE_USER = 'CREATE_USER',
}

export interface User {
  email: string;
  password: string;
  name: string;
}

export const createUserAction = makeAsyncAction<User, unknown>(USER_ACTION.CREATE_USER);