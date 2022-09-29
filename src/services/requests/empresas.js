import http from '@/services/http'

export const allEmpresasRequest = () => {
  return http.get('empresas')
}

export const searchEmpresasRequest = (query) => {
  return http.get(`empresas/search/${query}`)
}

export const empresasStoreRequest = (payload) => {
  return http.post(`empresas`, payload)
}

export const empresasShowRequest = (id) => {
  return http.get(`empresas/${id}`)
}

export const empresasUpdateRequest = (id, payload) => {
  return http.patch(`empresas/${id}`, payload)
}

export const empresasSociosRequest = (id) => {
  return http.get(`empresas/${id}/socios`)
}

export const empresasSociosUpdateRequest = (id, payload) => {
  return http.patch(`empresas/${id}/socios`, payload)
}

export const empresasFaturamentoRequest = (empresa_id) => {
  return http.get(`faturamento/${empresa_id}?empresa_id=${empresa_id}`)
}

export const empresasFaturamentoRendaRequest = (empresa_id) => {
  return http.get(`faturamento/renda/${empresa_id}?empresa_id=${empresa_id}&cliente_id=0`)
}

export const empresasFaturamentoLiquidoImpostosRequest = (empresa_id) => {
  return http.get(`faturamento/liquido-impostos/${empresa_id}`)
}

export const empresasCongelamentoRequest = (empresa_id, payload) => {
  return http.patch(`empresas/${empresa_id}/congelamento`, payload)
}

export const empresasDesativamentoRequest = (empresa_id, payload) => {
  return http.patch(`empresas/${empresa_id}/desativar`, payload)
}

export const buscarEmpresaEmailEnvio = (empresa_id) => {
  return http.get(`empresas/${empresa_id}/email-envio`)
}

export const empresasMotivosDesativamentoRequest = () => {
  return http.get('motivos-desativar-empresas')
}

export const empresasRendaBySocioRequest = (empresa_id) => {
  return http.get(`faturamento/renda/${empresa_id}?empresa_id=${empresa_id}&cliente_id=0`)
}

export const empresasAddArquivoRequest = (empresa_id, payload) => {
  return http.post(`empresas/${empresa_id}/add-arquivo`, payload)
}

export const empresaCarteirasRequest = (id) => {
  return http.get(`empresas/${id}/carteiras`);
};

export const empresaAddCarteiraRequest = (id, payload) => {
  return http.post(`empresas/${id}/add-carteira`, payload);
};

export const empresaRemoveCarteiraRequest = (id, payload) => {
  return http.post(`empresas/${id}/remove-carteira`, payload);
};

export const empresaCancelRequest = (id) => {
  return http.post(`empresas/${id}/cancel`);
};

export const getHistoryRegimeTributario = (empresa_id) => {
  return http.get(`empresas/${empresa_id}/history-regime-tributario`)
}
