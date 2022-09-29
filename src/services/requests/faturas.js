import http from '@/services/http'

export const faturasRequest = (params) => {
  return http.get(`/faturas`, {params})
}

export const cancelarFaturaRequest = (id) => {
  return http.put(`/faturas/cancelar/${id}`)
}

export const estornarFaturaRequest = (id) => {
  return http.put(`/faturas/estornar/${id}`)
}

export const deleteFaturaRequest = (id) => {
  return http.delete(`/faturas/${id}`)
}

export const criarFaturaRequest = (data) => {
  return http.post('faturas', data)
}
export const updateFaturaRequest = (data) => {
  return http.put('faturas', data)
}

export const sendInvoiceRequest = (data) => {
  return http.post('faturas/send', data)
}

export const getInvoicesByPayerRequest = (payer_type, payer_id) => {
  return http.get(`faturas/${payer_type}/${payer_id}`)
}
export const getInvoicesByPayerAtrasadasRequest = (payer_type, payer_id) => {
  return http.get(`faturas/atrasadas/${payer_type}/${payer_id}`)
}

export const uploadVoucherRequest = (id, data) => {
  return http.post(`faturas/${id}/voucher`, data)
}

export const getVoucherRequest = (id) => {
  return http.get(`faturas/${id}/voucher`)
}

export const getContasReceber = (query) => {
  return http.get(`faturas/contas-receber/`, {
    params: query
  })
}

export const getContaReceberById = (id) => {
  return http.get(`faturas/contas-receber/${id}`)
}

export const createLancamentoRequest = (data) => {
  return http.post(`faturas/contas-receber/create-lancamento`, data)
}
