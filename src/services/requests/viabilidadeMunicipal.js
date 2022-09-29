import http from '@/services/http'

export const indexViabilidadeMunicipalRequest = () => {
  return http.get('viabilidade')
}

export const storeViabilidadeMunicipalRequest = (payload) => {
  return http.post('viabilidade', payload)
}

export const updateViabilidadeMunicipalRequest = (id, payload) => {
  return http.patch(`viabilidade/${id}`, payload)
}

export const showViabilidadeMunicipalRequest = (id) => {
  return http.get(`viabilidade/${id}`)
}

export const destroyViabilidadeMunicipalRequest = (id) => {
  return http.delete(`viabilidade/${id}`)
}

export const getViabilidadeDocumentosBaseRequest = () => {
  return http.get('viabilidade/documentos-base')
}