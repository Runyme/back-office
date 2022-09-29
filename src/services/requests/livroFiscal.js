import http from '@/services/http'

export const getLivroFiscalRequest = (params) => {
  return http.get(`livro-fiscal`, {
    params: {...params}
  })
}

export const deleteLivroFiscalRequest = (id) => {
  return http.delete(`livro-fiscal/${id}`)
}

export const updateLivroFiscalRequest = (id, data) => {
  return http.patch(`livro-fiscal/${id}`, data)
}
