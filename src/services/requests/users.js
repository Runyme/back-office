import http from '@/services/http'

export const usersInfoRequest = () => {
  return http.get('usuario-info')
};

export const usersRequest = () => {
  return http.get('usuarios');
};

export const searchUsersRequest = (nome) => {
  return http.get('usuarios?nome=' + nome);
};

export const usersShowRequest = (id) => {
  return http.get(`usuarios/${id}`);
};

export const usersDeleteRequest = (id) => {
  return http.delete(`usuarios/${id}`);
};

export const usersUpdateRequest = (payload) => {
  return http.patch(`usuarios/${payload.id}`, payload);
};

export const usersCreateRequest = (payload) => {
  return http.post(`usuarios`, payload);
};

export const restoreUserRequest = (id) => {
  return http.post(`usuarios/restore/${id}`);
};
