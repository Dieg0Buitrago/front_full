import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api/auth'

const authWrap = {
  minHeight: '100vh', background: '#0b0a14',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
}
const authCard = {
  background: '#fff', borderRadius: 20, padding: '48px 52px',
  width: '100%', maxWidth: 460,
  boxShadow: '0 30px 80px rgba(10,5,30,.45)',
}

export default function ForgotPassword() {
  const [username, setUsername] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await forgotPassword({ identifier: username })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'No se encontró el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={authWrap}>
      <div style={authCard}>
        <div style={{ marginBottom: 32 }}>
          <div className="cms-eyebrow">Recuperación de acceso</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            ¿Olvidaste tu contraseña?
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 14, lineHeight: 1.55 }}>
            Ingresa tu usuario para obtener tu pregunta de seguridad.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="cms-field">
              <label className="cms-label" htmlFor="username">Nombre de usuario</label>
              <input
                id="username"
                className="cms-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Tu nombre de usuario"
                autoComplete="username"
              />
            </div>

            {error && (
              <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="cms-btn-primary" style={{ width: '100%', height: 50, justifyContent: 'center', borderRadius: 12, fontWeight: 700, fontSize: 14, marginTop: 4 }}>
              {loading ? 'Buscando…' : 'Continuar'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(46,174,224,.08)', border: '1px solid rgba(46,174,224,.25)', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 12, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Pregunta de seguridad</p>
              <p style={{ margin: 0, color: 'var(--ink)', fontSize: 14, lineHeight: 1.5 }}>{result.pregunta_seguridad}</p>
            </div>
            <Link
              to={`/reset-password?username=${username}`}
              className="cms-btn-primary"
              style={{ width: '100%', height: 50, justifyContent: 'center', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              Responder y restablecer →
            </Link>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--pink)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
