import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const field = {
    display: 'flex', alignItems: 'center', gap: 10,
    height: 50, border: '1px solid var(--line)', background: 'var(--field)',
    borderRadius: 12, padding: '0 14px',
    transition: 'border-color .15s, box-shadow .15s, background .15s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        width: '100%', maxWidth: 1000,
        background: '#fff', borderRadius: 24,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        boxShadow: '0 40px 120px rgba(10,5,30,.5)',
      }}>

        {/* LEFT – Brand panel */}
        <div style={{
          position: 'relative', color: '#fff',
          padding: '56px 52px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden',
          background: `
            radial-gradient(120% 90% at 0% 0%, rgba(230,59,111,1) 0%, rgba(230,59,111,0) 55%),
            radial-gradient(120% 90% at 100% 0%, rgba(244,124,60,1) 0%, rgba(244,124,60,0) 55%),
            radial-gradient(120% 100% at 0% 100%, rgba(123,45,139,1) 0%, rgba(123,45,139,0) 55%),
            radial-gradient(120% 100% at 100% 100%, rgba(46,174,224,1) 0%, rgba(46,174,224,0) 55%),
            linear-gradient(135deg, #E63B6F 0%, #F47C3C 28%, #7B2D8B 70%, #2EAEE0 100%)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', position: 'relative', zIndex: 2 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff', boxShadow: '0 0 0 4px rgba(255,255,255,.18)' }} />
            Plataforma Comparte · CMS
          </div>

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h2 style={{ margin: '32px 0 0', fontWeight: 800, fontSize: 34, lineHeight: 1.15, letterSpacing: '-.02em', maxWidth: 380 }}>
              Una red que{' '}
              <em style={{ fontStyle: 'normal', background: 'linear-gradient(90deg,#FFE3C9,#FFD0DD)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                conecta personas
              </em>
              , culturas y propósitos.
            </h2>
            <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,.85)', maxWidth: 360 }}>
              Bienestar, cultura y liderazgo para las empresas que creen que crecer juntos siempre es mejor.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,.75)', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['AR', 'CL', 'EC', 'PE', 'CO'].map(c => (
                <span key={c} style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '5px 10px', borderRadius: 999,
                  background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                }}>{c}</span>
              ))}
            </div>
            <span>© 2026 · Comparte LATAM</span>
          </div>
        </div>

        {/* RIGHT – Form */}
        <div style={{ background: '#fff', padding: '56px 52px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
            <span style={{
              width: 26, height: 26, borderRadius: 7, flexShrink: 0,
              background: 'conic-gradient(from 220deg at 50% 50%, #E63B6F, #F47C3C, #7B2D8B, #2EAEE0, #E63B6F)',
            }} />
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', letterSpacing: '-.01em' }}>Comparte CMS</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 0' }}>
            <div className="cms-eyebrow">Acceso de administradores</div>
            <h1 style={{ margin: '0 0 8px', fontSize: 32, lineHeight: 1.1, letterSpacing: '-.025em', fontWeight: 800, color: 'var(--ink)' }}>
              Bienvenido de nuevo
            </h1>
            <p style={{ margin: '0 0 28px', color: 'var(--muted)', fontSize: 14, lineHeight: 1.55 }}>
              Inicia sesión para continuar gestionando tu comunidad <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Comparte</strong>.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="cms-field">
                <label className="cms-label" htmlFor="username">Usuario</label>
                <div className="cms-input-wrap" style={field} onFocus={() => {}} >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A95AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre de usuario"
                    autoComplete="username"
                    style={{ border: 0, outline: 0, background: 'transparent', flex: 1, fontSize: 15, color: 'var(--ink)' }}
                  />
                </div>
              </div>

              <div className="cms-field">
                <label className="cms-label" htmlFor="password">Contraseña</label>
                <div style={field}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A95AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    style={{ border: 0, outline: 0, background: 'transparent', flex: 1, fontSize: 15, color: 'var(--ink)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{ border: 0, background: 'transparent', cursor: 'pointer', color: '#7A7590', fontSize: 12, fontWeight: 600, padding: '4px 6px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    {showPw ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
                <Link to="/forgot-password" style={{ color: 'var(--pink)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {error && (
                <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="cms-btn-primary"
                style={{ width: '100%', height: 52, fontSize: 15, fontWeight: 700, borderRadius: 12, justifyContent: 'center', marginTop: 4 }}
              >
                {loading ? 'Validando…' : 'Iniciar sesión'}
                {!loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>
                  </svg>
                )}
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 12, paddingTop: 24 }}>
            <span>v3.2 · build 2026.05</span>
            <span>Comparte LATAM</span>
          </div>
        </div>
      </div>
    </div>
  )
}
