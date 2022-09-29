import http from '@/services/http'

export const clienteResidenciaCreateRequest = (payload) => {
  return http.post('cliente-residencia', payload)
}

export const clienteResidenciaUpdateRequest = (residenciaId, payload) => {
  return http.put(`cliente-residencia/${residenciaId}`, payload);
}

export const clienteResidenciaEspecialidadesRequest = () => {
  return http.get('cliente-residencia/especialidades')
}