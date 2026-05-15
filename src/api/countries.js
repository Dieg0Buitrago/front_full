import api from './axios'

export const getCountries = () => api.get('/countries')
export const getCountryById = (id) => api.get(`/countries/${id}`)
export const getActiveCountries = () => api.get('/countries/active')
export const createCountry = (data) => api.post('/countries', data)
export const updateCountry = (id, data) => api.put(`/countries/${id}`, data)
export const updateCountryStatus = (id, data) => api.patch(`/countries/${id}/status`, data)
