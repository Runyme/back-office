import http from '@/services/http'

export const cpfRequest = (document) => {
  return http.get(`document/cpf/${document}`)
}

export const cnpjRequest = (document) => {
  return http.get(`document/cnpj/${document}`)
}
