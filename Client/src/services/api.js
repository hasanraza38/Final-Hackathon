import axios from 'axios';

const api = axios.create({
  baseURL: 'https://final-hackathon-mu-one.vercel.app/api/v1',
  withCredentials: true
});

export default api;