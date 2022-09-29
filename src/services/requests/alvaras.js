import http from '@/services/http'

export const indexAlvarasRequest = () => {
  return http.get('empresas/alvaras')
}

export const storeAlvarasRequest = (payload) => {
  return http.post('empresas/alvaras', payload)
}

export const updateAlvarasRequest = (id, payload) => {
  return http.patch(`empresas/alvaras/${id}`, payload)
}

export const showAlvarasRequest = (id) => {
  return http.get(`empresas/alvaras/${id}`)
}

export const destroyAlvarasRequest = (id) => {
  return http.delete(`empresas/alvaras/${id}`)
}
