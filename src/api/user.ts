import { fetchData } from './fetchData';

const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject('No token');
  }

  return fetchData('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getUser };
