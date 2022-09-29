import http from '@/services/http'

export const salesQuantityByMonthRequest = () => {
  return http.get('dashboard/sales-quantity-by-month')
}

export const companiesOpeningStatsRequest = (payload) => {
  return http.post('dashboard/companies-opening-stats', payload)

}
export const companiesCarteiraRequest = () => {
  return http.get('dashboard/companies-quantity-for-carteiras')
}


export const companiesTimeByStepRequest = (params) => {
  return http.get('dashboard/companies-opening-time-by-step', {
    params: {...params}
  })
}

export const companiesQuantityStatsRequest = () => {
  return http.get('dashboard/companies-quantity-stats')
}

export const irpfStatsRequest = () => {
  return http.get('dashboard/irpf-stats')
}

export const companiesContractStatsRequest = () => {
  return http.get('dashboard/companies-contract-stats')
}

export const monthlyTaxesStatsRequest = (data_competencia,carteira) => {
  return http.get('dashboard/monthly-taxes-stats', {params: {data_competencia,carteira}})
}

export const fluxoCaixaRequest = () => {
  return http.get('dashboard/cash-flow')
}

export const previsaoFluxoCaixaRequest = () => {
  return http.get('dashboard/cash-flow-forecast')
}

export const monthlyPaymentsStats = (params) => {
  return http.get('dashboard/monthly-payments-stats', {
    params: {...params}
  })
}

export const paymentDefaultersRequest = () => {
  return http.get('dashboard/payments-defaulters')
}

export const newSalesAwaitingContractRequest = () => {
  return http.get('dashboard/awaiting-contract-signature')
}

export const newSalesAwaitingRegisterRequest = () => {
  return http.get('dashboard/awaiting-finish-register')
}

export const quantityAlvaraRequest = (params) => {
  return http.get('dashboard/quantity-alvaras/'+params)
}
export const quantityCnpjRequest = (params) => {
  return http.get('dashboard/quantity-cnpj/'+params,)
}

export const quantityNewCompaniesRequest = () => {
  return http.get('dashboard/quantity-new-companies')
}
