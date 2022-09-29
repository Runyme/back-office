import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_CHAT_API_URL,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('lynx-token')

  config.headers = {
    Accept: "application/json",
    Authorization: "Bearer " + token
  }

  config.headers['Content-Type'] = "application/json"
  
  return config
});

export default axiosInstance
