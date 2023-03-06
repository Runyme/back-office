import http from "@/services/http";

export const uploadPgblRequest = (payload) => {
  return http.post("/pgbl/upload", payload);
};

export const processJob = (jobId) => {
  return http.post(`/pgbl/process/${jobId}`);
};

export const processJobs = () => {
  return http.post(`/pgbl/process-jobs`);
};

export const getUploadReport = () => {
  return http.get(`pgbl/upload-report`);
};

export const getJobsStatus = () => {
  return http.get(`pgbl/jobs-status`);
};

export const getRelatorioPorAno = (ano) => {
  return http.get(`pgbl/relatorio-por-ano/${ano}`);
};

export const getExtratoPrevidenciario = (clientes_id) => {
  return http.get(`pgbl/extrato-previdenciario/${clientes_id}`);
};

export const getRelatorioDetalhadoCliente = (clientes_id) => {
  return http.get(`pgbl/relatorio-detalhado-cliente/${clientes_id}`);
};
