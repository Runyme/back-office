import http from '@/services/http'

export const rolesRequest = () => {
  return http.get('roles')
}

export const rolesShowRequest = (id) => {
  return http.get(`roles/${id}`)
}

export const rolesUpdateRequest = (payload) => {
  return http.patch(`roles/${payload.id}`, payload)
}

export const rolesCreateRequest = (payload) => {
  return http.post(`roles`, payload)
}

export const rolesDeleteRequest = (id) => {
  return http.delete(`roles/${id}`)
}