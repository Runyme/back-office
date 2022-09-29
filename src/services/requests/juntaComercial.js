import http from '@/services/http'

export const JuntaComercialIndex = () => {
  return http.get('junta-comercial')
}

export const JuntaComercialStore = (payload) => {
  return http.post(`junta-comercial`, payload)
}

export const JuntaComercialShow = (juntaComercial) => {
  return http.get(`junta-comercial/${juntaComercial}`)
}

export const JuntaComercialUpdate = (juntaComercial, payload) => {
  return http.put(`junta-comercial/${juntaComercial}`, payload)
}

export const JuntaComercialDelete = (juntaComercial) => {
  return http.delete(`junta-comercial/${juntaComercial}`)
}

export const JuntaComercialByUf = (uf) => {
  return http.get(`junta-comercial/estado/${uf}`)
}
