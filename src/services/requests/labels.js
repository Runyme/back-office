import http from '@/services/http'

export const storeLabelsRequest = (payload) => {
  return http.post(`labels`, payload)
}

export const showLabelsRequest = (id) => {
  return http.get(`labels/${id}`)
}

export const updateLabelsRequest = (id, payload) => {
  return http.put(`labels/${id}`, payload)
}