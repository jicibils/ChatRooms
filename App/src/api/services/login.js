import API from '../api';

const PREFIX = '/login';

export const confirmUser = userData =>
  API.post(PREFIX + '/confirmUser', userData);
