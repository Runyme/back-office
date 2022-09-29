import http from '@/services/http';

export const showGuiaLiberacaoRequest = (empresa_id, competencia) => {
  return http.get(`/guias/${empresa_id}`, {
    params: {competencia}
  })
}

export const uploadGuiasRequest = (payload) => {
  return http.post('/guias/upload', payload)
};

export const empresasWithGuiasRequest = (params) => {
  return http.get(`/guias/empresas`, {
    params: {...params}
  });
};

export const guiasNaoProcessadasRequest = () => {
  return http.get('/guias/nao-processadas');
};

export const chageLiberacaoRequest = (payload) => {
  return http.post('/guias/change-liberacao', payload);
};

export const deleteGuiaNaoProcessadaRequest = (id) => {
  return http.delete('/guias/nao-processadas/' + id);
};

export const tiposGuiasRequest = () => {
  return http.get('/guias/tipos');
};

export const createGuiaRequest = (payload) => {
  return http.post('/guias/store', payload);
};

export const estornarGuiaRequest = (id) => {
  return http.put('/guias/estorno/' + id);
};

export const sendGuiaRequest = (payload) => {
  return http.post('/guias/send', payload);
};

export const liberaGuiasRequest = (data_competencia) => {
  return http.patch('guias/libera-envios', {data_competencia})
}

export const sendGuiasRequest = (data_competencia) => {
  return http.post('guias/send-all', {data_competencia})
}

export const getRequiredGuidesByCompanyId = (empresa_id) => {
  return http.get(`/empresas/${empresa_id}/required-guides`)
}

export const saveRequiredGuidesByCompanyId = (empresa_id, payload) => {
  return http.post(`/empresas/${empresa_id}/required-guides`, payload)
}

export const getRequiredGuidesList = () => {
  return http.get(`/required/guides`)
}

export const changeTributacaoFrequency = (empresa_id, payload) => {
  return http.post(`empresas/${empresa_id}/tributacao-frequency`, payload)
}

export const getTributacaoFrequency = (empresa_id) => {
  return http.get(`empresas/${empresa_id}/tributacao-frequency`)
}

export const getUploadReport = () => {
  return http.get(`guias/upload-report`)
}
