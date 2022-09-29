import http from '@/services/http'

export const contatosRequest = (owner_type, owner_id) => {
  return http.get(`contatos/${owner_type}/${owner_id}`)
}

export const contatosCreateRequest = (payload) => {
  return http.post(`contatos`, payload)
}

export const contatosUpdateRequest = (contato_id, payload) => {
  return http.put(`contatos/${contato_id}`, payload)
}

export const contatosDeleteRequest = (contato_id) => {
  return http.delete(`contatos/${contato_id}`)
}
