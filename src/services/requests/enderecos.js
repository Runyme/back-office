import http from '@/services/http'

export const enderecosRequest = (addressable_type, addressable_id) => {
  return http.get(`enderecos/${addressable_type}/${addressable_id}`)
}

export const enderecosCreateRequest = (payload) => {
  return http.post('enderecos', payload)
}

export const enderecosUpdateRequest = (endereco_id, payload) => {
  return http.put(`enderecos/${endereco_id}`, payload)
}