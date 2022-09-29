import http from '@/services/http';

export const getUserType = () => {
  const url = '/usuarios/tipo';

  return http.get(url);
};

export const fetchOsBasesRequest = () => {
  let url = '/ordem-servico/os-base';

  return http.get(url);
};

export const saveServiceBaseOrder = (payload) => {
  const url = '/ordem-servico/os-base';

  return http.post(url, payload);
};


export const deleteServiceOrderBaseRequest = (id) => {
  const url = `/ordem-servico/os-base/${id}`;

  return http.delete(url);
}
