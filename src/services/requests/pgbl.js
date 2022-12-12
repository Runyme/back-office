import http from '@/services/http';

export const uploadPgblRequest = (payload) => {
  return http.post('/pgbl/upload', payload)
};

export const getUploadReport = () => {
  return http.get(`pgbl/upload-report`)
}
