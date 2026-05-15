import api from './axios'

export const getContactRequests = () => api.get('/contact-requests')
export const getContactRequestById = (id) => api.get(`/contact-requests/${id}`)
export const updateContactStatus = (id, data) => api.put(`/contact-requests/${id}/status`, data)
export const deleteContactRequest = (id) => api.delete(`/contact-requests/${id}`)
