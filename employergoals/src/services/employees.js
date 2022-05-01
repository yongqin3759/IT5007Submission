import axios from 'axios';



const getAll = (token) => {
  return axios.get('/api/goals', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
};

const create = (newObject, token) => {
  const request = axios.post('/api/goals', newObject, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return request.then((response) => response.data);
};

const update = (id, newObject, token) => {
  return axios.put('/api/goals/' + id, newObject, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
};

const remove = (id, token) => {
  return axios.delete('/api/goals/' + id, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
};
export default { getAll, create, update, remove };
