import http from '@/services/http'

export const guiasDatasPadraoIndexRequest = () => {
  return http.get('guias/datas-padrao')
}

export const guiasDatasPadraoUpdateRequest = (payload) => {
  return http.patch(`guias/datas-padrao/`, payload)
}