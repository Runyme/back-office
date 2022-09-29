import http, {blobRequest} from '@/services/http';

export const uploadReceitasRequest = (payload) => {
  return http.post('/receitas/upload', payload);
};

export const divisaoReceitasRequest = (payload) => {
  return http.post('/receitas/divisao', payload);
};

export const receitasNaoProcessadasRequest = () => {
  return http.get('/receitas/nao-processadas');
};

export const deleteReceitaNaoProcessadaRequest = (id) => {
  return http.delete('/receitas/nao-processadas/' + id);
};

export const createReceitaRequest = (payload) => {
  return http.post('/receitas', payload);
};

export const receitasRequest = (params) => {
  return http.get(`/receitas`, {
    params: {...params}
  });
};

export const editReceitaRequest = (id, payload) => {
  return http.put('/receitas/' + id, payload);
};

export const deleteReceitaRequest = (id) => {
  return http.delete('/receitas/' + id);
};

export const generateReportReceitaRequest = (params) => {
  return blobRequest.get(`/receitas/relatorio`, {
    params: {...params}
  });
};

export const lancamentoReceitaRequest = (payload, id) => {
  return http.put(`/receitas/${id}/lancamento`, payload);
};

export const getYearlyByCustomer = (id) => {
  return http.get(`/receitas/all-yearly/${id}`);
};

export const editHoleriteRequest = (id, payload) => {
  return http.put('/receitas/holerite/' + id, payload);
};

export const createHoleriteRequest = (payload) => {
  return http.post('/receitas/holerite', payload);
};

export const getReceivedHolerites = (type, queryParam) => {
  return http.get(`uploads/${type}`, {
    params: {...queryParam}
  });
};

export const moveUploadToHolerite = (payload) => {
  return http.post(`receitas/holerite/from-upload`, payload);
};

