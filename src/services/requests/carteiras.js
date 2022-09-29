import http from '../http';

export const carteirasRequest = () => {
  return http.get('carteiras');
};

export const searchCarteirasRequest = (nome) => {
  return http.get('carteiras?nome=' + nome);
};

export const carteiraByIdRequest = (id) => {
  return http.get('carteiras/' + id);
};

export const createCarteiraRequest = (payload) => {
  return http.post('carteiras', payload);
};

export const updateCarteiraRequest = (payload, id) => {
  return http.put('carteiras/' + id, payload);
};

export const deleteCarteiraRequest = (id) => {
  return http.delete('carteiras/' + id);
};

export const SearchCarteirasBySetor = (setor) => {
  return http.get('carteiras/' + setor + '/setor');
};
export const SearchCarteirasLike= (setor) => {
  return http.get('carteiras/' + setor + '/like');
};
