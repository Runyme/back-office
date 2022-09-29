import axios from 'axios'
import store from '@/store'
import {$snack} from '@/services/snack'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('lynx-token')
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + token
  }

  config.headers = {
    ...config.headers,
    ...headers
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = "application/json"
  }
  return config
});

export const blobRequest = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  responseType: 'blob',
  headers: {
    Authorization: "Bearer " + localStorage.getItem('lynx-token'),
  }
});

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {

    if (!error.response) {
      $snack.error('Serviços indisponíveis. Tente novamente em alguns instantes.')
    }

    if (error.response && error.response.data.redirect) {
      store.dispatch('logout')
      $snack.error('Faça seu login novamente')
    }
    return Promise.reject(error)
  }
);

export default axiosInstance
