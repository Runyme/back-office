import http from '@/services/http'

export const arquivosCreateRequest = (payload) => {
  return http.post(`arquivos`, payload)
}

export const arquivosSearchRequest = (params) => {
  return http.get(`arquivos`, { params })
}

export const arquivosDeleteRequest = id => {
  return http.delete(`arquivos/${id}`)
}

export const arquivosUpdateRequest = (id, payload) => {
  return http.put(`arquivos/${id}`, payload)
}
