import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, logout as logoutApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const login = async (credentials) => {
    const res = await loginApi(credentials)
    const { token: t, user: u } = res.data
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    setToken(t)
    setUser(u)
    return u
  }

  const logout = async () => {
    try { await logoutApi() } catch (_) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isSuperAdmin = user?.rol === 'superadmin'
  const isAdmin = user?.rol === 'admin_pais' || isSuperAdmin
  const isEditor = user?.rol === 'editor' || isAdmin

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isSuperAdmin, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
