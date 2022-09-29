import http from '@/services/http'

const endpoint = '/ordem-servico'

export const serviceOrderRequest = (queryString) => {
  let url = endpoint;

  if (queryString) {
    url += queryString;
  }

  return http.get(url);
};

export const searchClientesRequest = (empresaId) => {
  let url = `/empresas/${empresaId}/socios`

  return http.get(url);
};

export const saveServiceOrderRequest = (payload) => http.post(endpoint, payload)

export const getServiceOrder = (id) => {
  const url = `${endpoint}/${id}`

  return http.get(url)
};

export const startActivityRequest = (atividade_id) => {
  return http.post(`${endpoint}/atividade/iniciar`, {atividade_id})
};

export const finishActivityRequest = (payload) => {
  return http.post(`${endpoint}/atividade/finalizar`, payload)
};

export const sendEmailRequest = (payload) => {
  return http.post(`${endpoint}/enviar-email`, payload)
};

export const subimitInputActivityRequest = (payload) => {
  return http.post(`${endpoint}/atividade/store`, payload)
};

export const deleteFileById = (arquivo_id) => {
  return http.post(`${endpoint}/atividade/arquivo/estornar`, {arquivo_id})
};
