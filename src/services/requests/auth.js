import http from '@/services/http'

export const loginRequest = (payload) => {
  return http.post('/usuario/login', payload)
}
