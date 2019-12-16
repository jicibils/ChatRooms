import axios from 'axios';
import config from './config';

console.log(
  "TCL: localStorage.getItem('persist:root')",
  !!localStorage.getItem('persist:root')
);

//HAY FORMA DE RECUPERAR EL USER DE REDUX AQUI???
let token = '';
const item = localStorage.getItem('persist:root');
let itemParsed = {};
let auth = {};
if (!!item) itemParsed = JSON.parse(localStorage.getItem('persist:root'));
if (!!itemParsed.auth)
  auth = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).auth);
if (!!auth.token) token = auth.token;

export default axios.create({
  // The base url of external api
  baseURL: config.api_url,
  headers: {
    Authorization: `Bearer ${token}`

    // Authorization: `Bearer ${
    //   !!localStorage.getItem('persist:root')
    //     ? JSON.parse(JSON.parse(localStorage.getItem('persist:root')).auth)
    //         .token
    //     : null
    // }`
  }
});
