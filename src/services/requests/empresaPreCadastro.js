import http from '@/services/http'

export const updateEmpresaPreCadastro = (empresa_id, payload) => {
  return http.put('empresa-pre-cadastros/' + empresa_id, payload)
}
