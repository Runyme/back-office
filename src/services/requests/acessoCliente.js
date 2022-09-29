import http from '@/services/http'

export const acessosClienteRequest = (cliente_id) => {
  return http.get(`clientes/${cliente_id}/access`)
}

export const clienteAcessCreateRequest = (cliente_id, payload) => {
  return http.post(`clientes/${cliente_id}/access`, payload)
}

export const clienteAcessoUpdateRequest = (cliente_id, conta_id, payload) => {
  return http.patch(`clientes/${cliente_id}/access/${conta_id}`, payload)
}
