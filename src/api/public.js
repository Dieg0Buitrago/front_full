import axios from 'axios'

const pub = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

export const getPublicCountries  = ()                    => pub.get('/countries/public')
export const getPublicNews       = (slug)                => pub.get(`/news/public/${slug}`)
export const getPublicNewsDetail = (countrySlug, newsSlug) => pub.get(`/news/public/${countrySlug}/${newsSlug}`)
export const getPublicTestimonials = (slug)              => pub.get(`/testimonials/public/${slug}`)
export const submitContact       = (data)                => pub.post('/contact-requests/public', data)