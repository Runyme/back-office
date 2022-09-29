import http from '@/services/http'

export const indexAlvarasSanitarioRequest = () => {
  return http.get('empresas/alvarasSanitario')
}

export const storeAlvarasSanitarioRequest = (payload) => {
  return http.post('empresas/alvarasSanitario', payload)
}

export const updateAlvarasSanitarioRequest = (id, payload) => {
  return http.patch(`empresas/alvarasSanitario/${id}`, payload)
}

export const showAlvarasSanitarioRequest = (id) => {
  return http.get(`empresas/alvarasSanitario/${id}`)
}

export const destroyAlvarasSanitarioRequest = (id) => {
  return http.delete(`empresas/alvarasSanitario/${id}`)
}
