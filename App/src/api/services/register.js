import API from '../api';

const PREFIX = '/register';

export const registerUser = userData =>
  API.post(PREFIX + '/registerUser', userData);
