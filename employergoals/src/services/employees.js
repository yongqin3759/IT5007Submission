import axios from 'axios';
import baseURL from './baseURL';



const getAll = (token) => {
  return axios.get(baseURL + '/api/goals', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
};

const create = (newObject, token) => {
  const request = axios.post(baseURL + '/api/goals', newObject, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return request.then((response) => response.data);
};

const update = (id, newObject, token) => {
  return axios.put(baseURL + '/api/goals/' + id, newObject, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
};

const remove = (id, token) => {
  return axios.delete(baseURL + '/api/goals/' + id, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
};
export default { getAll, create, update, remove };
