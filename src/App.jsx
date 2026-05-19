import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

import Dashboard from './pages/dashboard/Dashboard'

import NewsList from './pages/news/NewsList'
import NewsForm from './pages/news/NewsForm'

import TestimonialsList from './pages/testimonials/TestimonialsList'
import TestimonialForm from './pages/testimonials/TestimonialForm'

import ContactList from './pages/contacts/ContactList'
import ContactDetail from './pages/contacts/ContactDetail'

import FilesList from './pages/files/FilesList'

import UsersList from './pages/users/UsersList'
import UserForm from './pages/users/UserForm'

import CountriesList from './pages/countries/CountriesList'
import CountryForm from './pages/countries/CountryForm'

import Profile from './pages/profile/Profile'
import AuditLog from './pages/audit/AuditLog'
import ChatAdmin from './pages/chat/ChatAdmin'

import Landing from './pages/public/Landing'
import PublicNews from './pages/public/PublicNews'
import PublicNewsDetail from './pages/public/PublicNewsDetail'
import PublicTestimonials from './pages/public/PublicTestimonials'
import PublicContact from './pages/public/PublicContact'

function Private({ children, superadmin }) {
  return (
    <ProtectedRoute requiredRole={superadmin ? 'superadmin' : undefined}>
      {children}
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Sitio público */}
          <Route path="/" element={<Landing />} />
          <Route path="/:countrySlug/noticias" element={<PublicNews />} />
          <Route path="/:countrySlug/noticias/:newsSlug" element={<PublicNewsDetail />} />
          <Route path="/:countrySlug/testimonios" element={<PublicTestimonials />} />
          <Route path="/:countrySlug/solicitudes" element={<PublicContact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* CMS protegido */}
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />

          <Route path="/news" element={<Private><NewsList /></Private>} />
          <Route path="/news/new" element={<Private><NewsForm /></Private>} />
          <Route path="/news/:id/edit" element={<Private><NewsForm /></Private>} />

          <Route path="/testimonials" element={<Private><TestimonialsList /></Private>} />
          <Route path="/testimonials/new" element={<Private><TestimonialForm /></Private>} />
          <Route path="/testimonials/:id/edit" element={<Private><TestimonialForm /></Private>} />

          <Route path="/contacts" element={<Private><ContactList /></Private>} />
          <Route path="/contacts/:id" element={<Private><ContactDetail /></Private>} />

          <Route path="/files" element={<Private><FilesList /></Private>} />

          <Route path="/profile" element={<Private><Profile /></Private>} />

          {/* Solo superadmin */}
          <Route path="/users" element={<Private superadmin><UsersList /></Private>} />
          <Route path="/users/new" element={<Private superadmin><UserForm /></Private>} />
          <Route path="/users/:id/edit" element={<Private superadmin><UserForm /></Private>} />

          <Route path="/countries" element={<Private superadmin><CountriesList /></Private>} />
          <Route path="/countries/new" element={<Private superadmin><CountryForm /></Private>} />
          <Route path="/countries/:id/edit" element={<Private superadmin><CountryForm /></Private>} />

          <Route path="/audit" element={<Private superadmin><AuditLog /></Private>} />
          <Route path="/chat/admin" element={<Private superadmin><ChatAdmin /></Private>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
