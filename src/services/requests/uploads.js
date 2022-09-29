import http from '@/services/http'

export const getUploadsByType = (type, params = []) => {
  return http.get(`uploads/${type}`, {
    params: {...params}
  })
};

export const deleteUploadRequest = (id) => {
  return http.delete(`uploads/${id}`)
};
