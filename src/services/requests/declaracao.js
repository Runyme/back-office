import http from '@/services/http'

export const declaracaoFaturamentoSendEmailRequest = (payload) => {
  return http.post('declaracao/faturamento', payload)
}

export const declaracaoRendaSendEmailRequest = (payload) => {
  return http.post('declaracao/renda', payload)
}
