import http from '@/services/http'

export const getDeclaracaoIrpfRequest = (cliente_id) => {
  return http.get(`irpf/${cliente_id}`)
}

export const updateDeclaracaoIrpfRequest = (cliente_id, payload) => {
  return http.patch(`irpf/${cliente_id}`, payload)
}

export const irpfRequest = (payload) => {
  return http.get('irpf', payload)
}

export const getIrpfAssets = (cliente_id) => {
  return http.get(`/irpf/${cliente_id}/assets`)
}

export const updateIrpfAssets = (irpf_asset_id, data) => {
  return http.put(`/irpf/assets/${irpf_asset_id}`, data)
}

export const getQuestionarioRequest = (ano) => {
  return http.options(`/irpf/questionario/manage/${ano}`)
}

export const updateQuestionarioRequest = (questionario_id, data) => {
  return http.put(`/irpf/questionario/manage/${questionario_id}`, data)
}

export const createQuestionarioRequest = (data) => {
  return http.post(`/irpf/questionario/manage`, data)
}

export const deleteQuestionarioRequest = (questionario_id) => {
  return http.delete(`/irpf/questionario/manage/${questionario_id}`)
}

export const deletePendenciaInputRequest = (input_id) => {
  return http.delete(`/irpf/questionario/pendencia/input/${input_id}`)
}

export const getQuestionarioClienteRequest = (customer_id, params) => {
  return http.get(`/irpf/questionario`, {
    params: {...params, customer_id}
  })
}

export const getPendenciasClienteRequest = (customer_id, params) => {
  return http.get(`/irpf/pendencias`, {
    params: {...params, customer_id}
  })
}

export const responderQuestionarioRequest = (customer_id, data) => {
  return http.post(`/irpf/questionario`, data, {
    params: {customer_id},
  })
}

export const responderPendenciasRequest = (data, customer_id) => {
  return http.post(`/irpf/pendencias`, data, {
    params: {customer_id},
  })
}

export const changeIrpfToAceitoRequest = (data, customerId) => {
  return http.post(`/irpf/${customerId}/change-to-aceito`, data)
}

export const changeIrpfToCanceladoRequest = (data, customerId) => {
  return http.post(`/irpf/${customerId}/change-to-cancelou`, data)
}

export const changeIrpfToIsentoRequest = (data, customerId) => {
  return http.post(`/irpf/${customerId}/change-to-isento`, data)
}
