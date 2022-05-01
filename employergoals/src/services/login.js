import axios from 'axios'


const login = credentials => axios.post(`/api/auth/signin`, credentials);
const signup = credentials => axios.post(`/api/auth/signup`, credentials)

export default { login, signup } 