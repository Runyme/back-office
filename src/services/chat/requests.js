import http from '@/services/chat/http'

export const getAllStartedAttendanceByClerkId = clerkId => http.get(`attendance/clerk-id/${clerkId}/started`)

export const createAnnotationRequest = payload => http.post('annotation', payload)

export const updateAttendanceRequest = payload => http.put('subject', payload)

export const finishAttendanceRequest = payload => http.put(`attendance/${payload.attendanceId}/finish`, payload)
