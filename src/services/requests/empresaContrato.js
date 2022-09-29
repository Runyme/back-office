import http from '@/services/http'

export const getEmpresaWithContrato = (id) => {
  return http.get(`empresas/${id}/contrato`)
}

export const storeContrato = (payload) => {
  return http.post('contratos', payload)
}