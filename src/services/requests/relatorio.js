import http from '@/services/http'

export const getRelatorioMensal = async (empresas_id, competencia) => {
  return http.get(`relatorio/fechamento-mensal?empresa_id=${empresas_id}&competencia=${competencia}`)
}
