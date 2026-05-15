import api from './axios'

export const getNews = () => api.get('/news')
export const getNewsById = (id) => api.get(`/news/${id}`)
export const createNews = (data) => api.post('/news', data)
export const updateNews = (id, data) => api.put(`/news/${id}`, data)
export const updateNewsStatus = (id, data) => api.patch(`/news/${id}/status`, data)
export const deleteNews = (id) => api.delete(`/news/${id}`)
