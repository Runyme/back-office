import http from '@/services/http'

export const indexCoworkingRequest = () => {
  return http.get('empresas/coworking')
}

export const storeCoworkingRequest = (payload) => {
  return http.post('empresas/coworking', payload)
}

export const updateCoworkingRequest = (id, payload) => {
  return http.patch(`empresas/coworking/${id}`, payload)
}

export const showCoworkingRequest = (id) => {
  return http.get(`empresas/coworking/${id}`)
}

export const destroyCoworkingRequest = (id) => {
  return http.delete(`empresas/coworking/${id}`)
}
