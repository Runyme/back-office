import http from '@/services/http'

export const getScheduleRequest = (slug) => {
  return http.get(`schedule-job/${slug}`)
}

export const deactivateScheduleRequest = (slug) => {
  return http.put(`schedule-job/deactivate/${slug}`)
}

export const activateScheduleRequest = (slug) => {
  return http.put(`schedule-job/activate/${slug}`)
}
