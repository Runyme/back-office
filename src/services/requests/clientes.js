import http from '@/services/http'

export const clientesShowRequest = (id) => {
  return http.get(`clientes/${id}`)
}

export const clientesCreateRequest = (payload) => {
  return http.post(`clientes`, payload)
}

export const clientesUpdateRequest = (id, payload) => {
  return http.patch(`clientes/${id}`, payload)
}

export const clientesSearchRequest = (query) => {
  return http.get(`clientes/search/${query}`)
}

export const clientesEmpresasRequest = (id) => {
  return http.get(`clientes/${id}/empresas`)
}

export const tokenByCliente = (id) => {
  return http.get(`cliente/${id}/token`)
}

export const clienteAddArquivoRequest = (cliente_id, payload) => {
  return http.post(`clientes/${cliente_id}/add-arquivo`, payload)
}
