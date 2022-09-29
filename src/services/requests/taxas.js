import http from '@/services/http'

export const indexTaxasRequest = () => {
  return http.get('empresas/taxas')
}

export const storeTaxasRequest = (payload) => {
  return http.post('empresas/taxas', payload)
}

export const updateTaxasRequest = (id, payload) => {
  return http.patch(`empresas/taxas/${id}`, payload)
}

export const showTaxasRequest = (id) => {
  return http.get(`empresas/taxas/${id}`)
}

export const destroyTaxasRequest = (id) => {
  return http.delete(`empresas/taxas/${id}`)
}
