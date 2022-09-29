import http from '@/services/http'

export const permissionsRequest = () => {
  return http.get('permissions')
}

export const permissionsCreateRequest = (payload) => {
  return http.post(`permissions`, payload)
}

export const permissionsDeleteRequest = (id) => {
  return http.delete(`permissions/${id}`)
}