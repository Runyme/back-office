import http from '@/services/http'

export const getInvitesRequest = ($payload) => {
  return http.post(`invites`,$payload)
}


export const deleteInviteRequest = (id) => {
  return http.delete(`invites/${id}`)
}
