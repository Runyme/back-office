import http from '@/services/http'

export const indexContratanteRequest = () => {
  return http.get('contratantes')
}

export const storeContratanteRequest = (payload) => {
  return http.post('contratantes', payload)
}

export const updateContratanteRequest = (id, payload) => {
  return http.patch(`contratantes/${id}`, payload)
}

export const showContratanteRequest = (id) => {
  return http.get(`contratantes/${id}`)
}

export const destroyContratanteRequest = (id) => {
  return http.delete(`contratantes/${id}`)
}