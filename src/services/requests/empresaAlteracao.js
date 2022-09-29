import http from '@/services/http'

export const EmpresaAlteracaoIndex = () => {
  return http.get('empresa-alteracao')
}

export const EmpresaAlteracaoStore = payload => {
  return http.post('empresa-alteracao', payload)
}

export const EmpresaAlteracaoShow = (empresaAlteracaoId) => {
  return http.get(`empresa-alteracao/${empresaAlteracaoId}`)
}

export const EmpresaAlteracaoUpdate = (empresaAlteracaoId, payload) => {
  return http.put(`empresa-alteracao/${empresaAlteracaoId}`, payload)
}

export const EmpresaAlteracaoDelete = (empresaAlteracaoId) => {
  return http.delete(`empresa-alteracao/${empresaAlteracaoId}`)
}

export const FinalizarEmpresaAlteracao = (empresaAlteracaoId) => {
  return http.put(`empresa-alteracao/${empresaAlteracaoId}/finalizar`)
}
