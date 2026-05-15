import api from './axios'

export const getFiles = () => api.get('/files')
export const getFileById = (id) => api.get(`/files/${id}`)
export const createFile = (data) => api.post('/files', data)
export const deleteFile = (id) => api.delete(`/files/${id}`)
