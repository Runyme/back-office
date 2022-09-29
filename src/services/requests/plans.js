import http from '@/services/http'

export const plansRequest = () => {
  return http.get(`/plans`);
};

export const createPlanRequest = (data) => {
  return http.post('plans', data);
};

export const getServiceTableRequest = () => {
  return http.get('plans/service-table');
};

export const getOsBaseRequest = () => {
  return http.get('ordem-servico/os-base');
};

export const deleteCartaoCreditoRequest = (id) => {
  return http.delete('payment-methods/'+id);
};
