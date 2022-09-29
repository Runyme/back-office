import http from '@/services/http'

export const acessosPrefeiturasRequest = (empresa_id) => {
  return http.get(`empresas/${empresa_id}/acessos-prefeituras`)
}

export const acessosPrefeiturasCreateRequest = (empresa_id, payload) => {
  return http.post(`empresas/${empresa_id}/acessos-prefeituras`, payload)
}

export const acessosPrefeiturasUpdateRequest = (empresa_id, conta_id, payload) => {
  return http.patch(`empresas/${empresa_id}/acessos-prefeituras/${conta_id}`, payload)
}