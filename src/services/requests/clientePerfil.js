import http from '@/services/http'

export const iesRequest = () => {
  return http.get(`ies`)
}

export const especialidadesRequest = () => {
  return http.get(`especialidades`)
}

export const estadosCivisRequest = () => {
  return http.get(`estados-civis`)
}

export const profissoesRequest = () => {
  return http.get(`profissoes`)
}

export const qualificacoesRequest = () => {
  return http.get(`qualificacoes`)
}
