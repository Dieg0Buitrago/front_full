import { useState } from 'react'
import { changePassword, updateSecurityQuestion } from '../../api/auth'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'

const rolColors = {
  superadmin: { background: '#F1EBFB', color: 'var(--purple)' },
  admin_pais: { background: '#DDF1FA', color: 'var(--cyan)' },
  editor:     { background: 'var(--yellow-bg)', color: 'var(--yellow)' },
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  )
}

function Msg({ msg }) {
  if (!msg) return null
  const [type, text] = msg.split(':')
  return (
    <div style={{
      fontSize: 13, padding: '10px 14px', borderRadius: 10,
      background: type === 'ok' ? 'var(--green-bg)' : 'var(--red-bg)',
      border: type === 'ok' ? '1px solid rgba(34,197,94,.25)' : '1px solid rgba(216,51,74,.25)',
      color: type === 'ok' ? 'var(--green)' : 'var(--red)',
    }}>
      {text}
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const [pwdForm, setPwdForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [sqForm, setSqForm] = useState({ security_question: '', security_answer: '' })
  const [pwdMsg, setPwdMsg] = useState('')
  const [sqMsg, setSqMsg] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [sqLoading, setSqLoading] = useState(false)

  const handlePwdChange = (e) => setPwdForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const handleSqChange = (e) => setSqForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handlePwd = async (e) => {
    e.preventDefault()
    setPwdMsg('')
    if (pwdForm.new_password !== pwdForm.confirm) {
      setPwdMsg('error:Las contraseñas no coinciden')
      return
    }
    setPwdLoading(true)
    try {
      await changePassword({ password_actual: pwdForm.current_password, nueva_password: pwdForm.new_password })
      setPwdMsg('ok:Contraseña actualizada correctamente')
      setPwdForm({ current_password: '', new_password: '', confirm: '' })
    } catch (err) {
      setPwdMsg(`error:${err.response?.data?.message || 'Error al cambiar contraseña'}`)
    } finally {
      setPwdLoading(false)
    }
  }

  const handleSq = async (e) => {
    e.preventDefault()
    setSqMsg('')
    setSqLoading(true)
    try {
      await updateSecurityQuestion({ pregunta_seguridad: sqForm.security_question, respuesta_seguridad: sqForm.security_answer })
      setSqMsg('ok:Pregunta de seguridad actualizada')
      setSqForm({ security_question: '', security_answer: '' })
    } catch (err) {
      setSqMsg(`error:${err.response?.data?.message || 'Error al actualizar'}`)
    } finally {
      setSqLoading(false)
    }
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Cuenta"
        title="Mi perfil"
        subtitle="Información personal y configuración de seguridad."
      />

      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Info card — from auth context (login response has full user data) */}
        {user && (
          <div className="cms-card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--pink), var(--orange))',
                color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 16,
              }}>
                {`${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                  {user.nombre ? `${user.nombre} ${user.apellido}` : user.username}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{user.email}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, textTransform: 'capitalize', ...(rolColors[user.rol] || { background: '#EEF0F4', color: '#5C5772' }) }}>
                    {user.rol}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <InfoRow label="Nombre completo" value={user.nombre ? `${user.nombre} ${user.apellido}` : '—'} />
              <InfoRow label="Username" value={user.username} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Rol" value={user.rol} />
            </div>
          </div>
        )}

        {/* Change password */}
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Cambiar contraseña</h3>
          </div>
          <form onSubmit={handlePwd}>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="cms-field">
                <label className="cms-label">Contraseña actual <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="current_password" type="password" className="cms-input" placeholder="Contraseña actual" value={pwdForm.current_password} onChange={handlePwdChange} required />
              </div>
              <div className="cms-field">
                <label className="cms-label">Nueva contraseña <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="new_password" type="password" className="cms-input" placeholder="Nueva contraseña" value={pwdForm.new_password} onChange={handlePwdChange} required />
              </div>
              <div className="cms-field">
                <label className="cms-label">Confirmar nueva contraseña <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="confirm" type="password" className="cms-input" placeholder="Repetir nueva contraseña" value={pwdForm.confirm} onChange={handlePwdChange} required />
              </div>
              <Msg msg={pwdMsg} />
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={pwdLoading} className="cms-btn-primary" style={{ height: 40 }}>
                {pwdLoading ? 'Guardando…' : 'Actualizar contraseña'}
              </button>
            </div>
          </form>
        </div>

        {/* Security question */}
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Pregunta de seguridad</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>Se usa para recuperar tu contraseña en caso de olvido.</p>
          </div>
          <form onSubmit={handleSq}>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="cms-field">
                <label className="cms-label">Pregunta de seguridad <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="security_question" className="cms-input" placeholder="¿Cuál es el nombre de tu mascota?" value={sqForm.security_question} onChange={handleSqChange} required />
              </div>
              <div className="cms-field">
                <label className="cms-label">Respuesta <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="security_answer" type="password" className="cms-input" placeholder="Respuesta secreta" value={sqForm.security_answer} onChange={handleSqChange} required />
              </div>
              <Msg msg={sqMsg} />
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={sqLoading} className="cms-btn-primary" style={{ height: 40 }}>
                {sqLoading ? 'Guardando…' : 'Actualizar pregunta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
