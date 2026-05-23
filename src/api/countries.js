import api from './axios'

export const getCountries = () => api.get('/countries')
export const getCountryById = (id) => api.get(`/countries/${id}`)
export const getActiveCountries = () => api.get('/countries/active')
export const createCountry = (data) => api.post('/countries', data)
export const updateCountry = (id, data) => api.put(`/countries/${id}`, data)
export const updateCountryStatus = (id, data) => api.patch(`/countries/${id}/status`, data)

export const getPublicCountryBySlug = (slug) => api.get(`/countries/public/${slug}`)

export const uploadCountryLogo = (id, file) => {
  const formData = new FormData()
  formData.append('logo', file)
  return api.patch(`/countries/${id}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
