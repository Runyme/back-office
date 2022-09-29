import http from '@/services/http'

export const indexEstadosRequest = () => {
  return http.get('estados')
}

export const showEstadosRequest = (id) => {
  return http.get(`estados/${id}`)
}