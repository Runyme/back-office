import axios from 'axios'

const http = axios.create({
  baseURL: process.env.VUE_APP_CHAT_API_URL,
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('lynx-token')
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + token
  }

  config.headers = {
    ...config.headers,
    ...headers
  }
  config.headers['Content-Type'] = "application/json"
  return config
})

export const createAttendanceRequest = (payload) => {
  return http.post('attendance', payload)
}
