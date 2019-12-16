import API from '../api';

const PREFIX = '/user';

export const saveUser = userData => API.post(PREFIX + '/saveUser', userData);

export const changePassword = passwordData =>
  API.post(PREFIX + '/changePassword', passwordData);

export const deleteAccount = data => API.post(PREFIX + '/deleteAccount', data);

export const saveProfilePicture = data =>
  API.post(PREFIX + '/saveProfilePicture', data);

export const addAccount = data => API.post(PREFIX + '/addAccount', data);

export const removeAccount = data => API.post(PREFIX + '/removeAccount', data);

export const fetchUserByAccount = data =>
  API.post(PREFIX + '/fetchUserByAccount', data);

export const getUserByCuit = data => API.post(PREFIX + '/getUserByCuit', data);
