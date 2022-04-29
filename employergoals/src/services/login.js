import axios from 'axios'

import baseURL from './baseURL';

const login = credentials => axios.post(`${baseURL}/api/auth/signin`, credentials);
const signup = credentials => axios.post(`${baseURL}/api/auth/signup`, credentials)

export default { login, signup } 