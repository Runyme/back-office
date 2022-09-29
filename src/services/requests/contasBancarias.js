import http from '@/services/http'

export const contasBancariasRequest = (owner_type, owner_id) => {
  return http.get(`contas-bancarias/${owner_type}/${owner_id}`)
}

export const contasBancariasCreateRequest = (payload) => {
  return http.post(`contas-bancarias`, payload)
}

export const contasBancariasUpdateRequest = (conta_id, payload) => {
  return http.put(`contas-bancarias/${conta_id}`, payload)
}

export const contasBancariasDeleteRequest = (conta_id) => {
  return http.delete(`contas-bancarias/${conta_id}`)
}
