import http from '@/services/http'

export const getNfse = (params) => {
  return http.get('nfse', params)
}

export const emitirNfse = (faturaId) => {
  return http.post('nfse/emitir', {fatura_id: faturaId})
}

export const refreshStatus = (idIntegracao) => {
  return http.get('nfse/refresh/'+ idIntegracao)
}
