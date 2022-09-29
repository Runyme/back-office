import http from '@/services/http'

export const getPgblSimulation = (customer_id) => {
  return http.get(`simulator/pgbl/${customer_id}`)
}

export const simulationRequest = (payload) => {
  return http.post(`api/simulator/calculate`, payload)
}
