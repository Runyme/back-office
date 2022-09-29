import http from "@/services/http";

export const ComentarioIndex = (commentableType, commentableId) => {
  return http.get(`comentarios/${commentableType}/${commentableId}`);
};

export const ComentarioStore = payload => {
  return http.post("comentarios", payload);
};

export const ComentarioUpdate = (comentarioId, payload) => {
  return http.put(`comentarios/${comentarioId}`, payload);
};

export const ComentarioDelete = comentarioId => {
  return http.delete(`comentarios/${comentarioId}`);
};
