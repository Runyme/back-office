import http from '@/services/http'

export const getApontamentosRequest = () => {
  return http.get('apontamentos')
}

export const storeApontamentosRequest = (payload) => {
  return http.post('apontamentos', payload)
}

export const updateApontamentosRequest = (id, payload) => {
  return http.patch(`apontamentos/${id}`, payload)
}

export const showApontamentosRequest = (id) => {
  return http.get(`apontamentos/${id}`)
}

export const destroyApontamentosRequest = (id) => {
  return http.delete(`apontamentos/${id}`)
}
