import api from './axios'

export const getAuditLogs = () => api.get('/audit')
export const getAuditLogById = (id) => api.get(`/audit/${id}`)
