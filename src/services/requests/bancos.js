import http from '@/services/http'

export const bancosSearchRequest = (query) => {
  return http.get(`bancos/${query}`)
}