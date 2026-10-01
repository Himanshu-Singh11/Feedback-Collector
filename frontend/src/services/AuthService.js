import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const register = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, userData);
  return response.data;
};

export default {
  register,
  login,
};
