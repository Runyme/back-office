import http from '@/services/http'

export const indexBombeiroRequest = () => {
  return http.get('empresas/bombeiro')
}

export const storeBombeiroRequest = (payload) => {
  return http.post('empresas/bombeiro', payload)
}

export const updateBombeiroRequest = (id, payload) => {
  return http.patch(`empresas/bombeiro/${id}`, payload)
}

export const showBombeiroRequest = (id) => {
  return http.get(`empresas/bombeiro/${id}`)
}

export const destroyBombeiroRequest = (id) => {
  return http.delete(`empresas/bombeiro/${id}`)
}
