import http from '@/services/http'

export const EmpresaPosCadastro = (params) => {
  return http.get('empresas/poscadastro', { params })
}

export const EmpresaPosCadastroStatus = () => {
  return http.get('empresas/poscadastro/status')
}

export const EmpresaPosCadastroShow = (empresaId) => {
  return http.get(`empresas/${empresaId}/poscadastro`)
}

export const EmpresaPosCadastroUpdate = (empresaId, payload) => {
  return http.put(`empresas/${empresaId}/poscadastro`, payload)
}
export const EmpresaPosCadastroUpdatePularAcesso = (empresaId) => {
  return http.put(`empresas/${empresaId}/pularAcesso`)
}

export const ReenviaContrato = (empresaId) => {
  return http.get(`assinatura-contrato/${empresaId}/reenviar`)
}

export const EmpresaPosCadastroFiles = (empresaId) => {
  return http.get(`empresas/${empresaId}/poscadastro/files`)
}

export const EmpresaPosCadastroAttachFiles = (empresaId, payload) => {
  return http.post(`empresas/${empresaId}/poscadastro/attach-files`, payload)
}

export const EmpresaPosCadastroSendFiles = (empresaId, payload) => {
  return http.post(`empresas/${empresaId}/poscadastro/send-files`, payload)
}
