import http from '@/services/http'

export const planosRequest = () => {
  return http.get(`plans`)
}
