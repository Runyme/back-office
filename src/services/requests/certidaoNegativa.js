import http from '@/services/http';

export const certidaoNegativaRequest = () => {
  return http.get('/certidao-negativa');
};

export const certidoesNegativosByEmpresaRequest = (id) => {
  return http.get('/certidao-negativa/empresa/' + id);
};

export const createCertidaoNegativaRequest = (payload) => {
  return http.post('/certidao-negativa', payload);
};

export const uploadCertidoesNegativasRequest = (payload) => {
    return http.post('/certidao-negativa/upload', payload);
};

export const certidoesNegativosNaoProcessadasRequest = () => {
  return http.get('/certidao-negativa/nao-processadas');
};

export const deleteCertidaoNegativaNaoProcessadaRequest = (id) => {
  return http.delete('/certidao-negativa/nao-processadas/' + id);
};
