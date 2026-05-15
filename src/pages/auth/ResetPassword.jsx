import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { resetPassword } from '../../api/auth'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const username = params.get('username') || ''
  const [form, setForm] = useState({ security_answer: '', new_password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.new_password !== form.confirm_password) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      await resetPassword({ username, respuesta_seguridad: form.security_answer, nueva_password: form.new_password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Respuesta incorrecta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '48px 52px', width: '100%', maxWidth: 460, boxShadow: '0 30px 80px rgba(10,5,30,.45)' }}>
        <div style={{ marginBottom: 32 }}>
          <div className="cms-eyebrow">Nueva contraseña</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            Restablecer acceso
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 14, lineHeight: 1.55 }}>
            Responde tu pregunta de seguridad y define tu nueva contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="cms-field">
            <label className="cms-label" htmlFor="security_answer">Respuesta de seguridad</label>
            <input id="security_answer" name="security_answer" className="cms-input" value={form.security_answer} onChange={handleChange} required placeholder="Tu respuesta secreta" />
          </div>
          <div className="cms-field">
            <label className="cms-label" htmlFor="new_password">Nueva contraseña</label>
            <input id="new_password" name="new_password" type="password" className="cms-input" value={form.new_password} onChange={handleChange} required placeholder="Mínimo 8 caracteres" />
          </div>
          <div className="cms-field">
            <label className="cms-label" htmlFor="confirm_password">Confirmar contraseña</label>
            <input id="confirm_password" name="confirm_password" type="password" className="cms-input" value={form.confirm_password} onChange={handleChange} required placeholder="Repite la nueva contraseña" />
          </div>

          {error && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="cms-btn-primary" style={{ width: '100%', height: 50, justifyContent: 'center', borderRadius: 12, fontWeight: 700, fontSize: 14, marginTop: 4 }}>
            {loading ? 'Guardando…' : 'Restablecer contraseña'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--pink)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
