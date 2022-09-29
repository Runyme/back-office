import http from '@/services/http'

export const crmsRequest = (owner_type, owner_id) => {
  return http.get(`crms/${owner_type}/${owner_id}`)
}

export const crmsCreateRequest = (payload) => {
  return http.post('crms', payload)
}

export const crmsUpdateRequest = (crm_id, payload) => {
  return http.put(`crms/${crm_id}`, payload)
}