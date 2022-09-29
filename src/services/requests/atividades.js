import http from '@/services/http';

// SCHEDULE
export const atividadesSchedulesRequest = () => {
  return http.get(`/activity/schedule`);
};

export const showAtividadeScheduleRequest = (id) => {
  return http.get(`/activity/schedule/` + id)
}

export const createAtividadeScheduleRequest = (payload) => {
  return http.post(`/activity/schedule`, payload)
}

export const updateAtividadeScheduleRequest = (payload, id) => {
  return http.put(`/activity/schedule/` + id, payload)
}

export const deleteAtividadeScheduleRequest = (id) => {
  return http.delete(`/activity/schedule/` + id)
}

export const executeAtividadeScheduleRequest = (id) => {
  return http.post(`activity/schedule/execute/` + id);
}

// ATIVIDADES
export const atividadesRequest = () => {
  return http.get(`/activity`);
};

export const updateAtividadeRequest = (payload, id) => {
  return http.put(`/activity/` + id, payload);
};

export const deleteAtividadeRequest = (id) => {
  return http.delete(`/activity/` + id)
}

// OUTROS
export const getRecurrencesRequest = () => {
  return http.get(`/activity/recurrence`)
}

export const getStatusRequest = () => {
  return http.get(`/activity/status`)
}

export const getRegimesRequest = () => {
  return http.get(`/activity/regimes`)
}

export const getWalltersRequest = () => {
  return http.get(`/activity/wallters`)
}
