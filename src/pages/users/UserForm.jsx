import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserById, createUser, updateUser, updateUserPassword } from '../../api/users'
import { getActiveCountries } from '../../api/countries'
import { getRoles } from '../../api/roles'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', username: '',
    password: '', rol_id: '', pais_id: '',
    pregunta_seguridad: '', respuesta_seguridad: '',
  })
  const [password, setPassword] = useState({ nueva_password: '', confirm: '' })
  const [countries, setCountries] = useState([])
  const [roles, setRoles] = useState([])
  const [error, setError] = useState('')
  const [pwdError, setPwdError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => {
    getActiveCountries().then((r) => setCountries(r.data))
    getRoles().then((r) => setRoles(r.data))
    if (isEdit) {
      getUserById(id).then((r) => {
        const d = r.data
        setForm((f) => ({
          ...f,
          nombre: d.nombre || '',
          apellido: d.apellido || '',
          email: d.email || '',
          username: d.username || '',
          rol_id: d.rol_id || '',
          pais_id: d.pais_id || '',
        }))
      })
    }
  }, [id])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await updateUser(id, {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          rol_id: Number(form.rol_id),
          pais_id: form.pais_id || null,
        })
      } else {
        await createUser({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          username: form.username,
          password: form.password,
          rol_id: Number(form.rol_id),
          pais_id: form.pais_id || null,
          pregunta_seguridad: form.pregunta_seguridad,
          respuesta_seguridad: form.respuesta_seguridad,
        })
      }
      navigate('/users')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwdError('')
    if (password.nueva_password !== password.confirm) {
      setPwdError('Las contraseñas no coinciden')
      return
    }
    setPwdLoading(true)
    try {
      await updateUserPassword(id, { nueva_password: password.nueva_password })
      setPassword({ nueva_password: '', confirm: '' })
      setShowPwd(false)
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Error al cambiar contraseña')
    } finally {
      setPwdLoading(false)
    }
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Administración"
        title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
        subtitle="Completa la información del usuario del sistema."
      />

      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Datos del usuario</h3>
          </div>
          <form id="user-form" onSubmit={handleSubmit}>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="cms-field">
                <label className="cms-label" htmlFor="nombre">Nombre <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="nombre" name="nombre" className="cms-input" value={form.nombre} onChange={handleChange} required placeholder="Nombre" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="apellido">Apellido <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="apellido" name="apellido" className="cms-input" value={form.apellido} onChange={handleChange} required placeholder="Apellido" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="email">Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="email" name="email" type="email" className="cms-input" value={form.email} onChange={handleChange} required placeholder="correo@ejemplo.com" />
              </div>
              {!isEdit && (
                <div className="cms-field">
                  <label className="cms-label" htmlFor="username">Username <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input id="username" name="username" className="cms-input" value={form.username} onChange={handleChange} required placeholder="nombre_usuario" style={{ fontFamily: 'monospace' }} />
                </div>
              )}
              {!isEdit && (
                <div className="cms-field">
                  <label className="cms-label" htmlFor="password">Contraseña <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input id="password" name="password" type="password" className="cms-input" value={form.password} onChange={handleChange} required placeholder="Contraseña inicial" />
                </div>
              )}
              <div className="cms-field">
                <label className="cms-label" htmlFor="rol_id">Rol <span style={{ color: 'var(--red)' }}>*</span></label>
                <select id="rol_id" name="rol_id" className="cms-select" value={form.rol_id} onChange={handleChange} required>
                  <option value="">Seleccionar rol…</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="pais_id">País</label>
                <select id="pais_id" name="pais_id" className="cms-select" value={form.pais_id} onChange={handleChange}>
                  <option value="">Sin país asignado</option>
                  {countries.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              {/* Security question — only for new users */}
              {!isEdit && (
                <>
                  <div className="cms-field" style={{ gridColumn: 'span 2' }}>
                    <label className="cms-label" htmlFor="pregunta_seguridad">Pregunta de seguridad <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input id="pregunta_seguridad" name="pregunta_seguridad" className="cms-input" value={form.pregunta_seguridad} onChange={handleChange} required placeholder="¿Cuál es el nombre de tu mascota?" />
                  </div>
                  <div className="cms-field" style={{ gridColumn: 'span 2' }}>
                    <label className="cms-label" htmlFor="respuesta_seguridad">Respuesta de seguridad <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input id="respuesta_seguridad" name="respuesta_seguridad" className="cms-input" value={form.respuesta_seguridad} onChange={handleChange} required placeholder="Respuesta secreta" />
                  </div>
                </>
              )}
            </div>

            {error && (
              <div style={{ margin: '0 20px 16px', background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>{error}</div>
            )}
          </form>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={() => navigate('/users')} className="cms-btn-ghost">Cancelar</button>
            <button type="submit" form="user-form" disabled={loading} className="cms-btn-primary" style={{ height: 40 }}>
              {loading ? 'Guardando…' : isEdit ? 'Actualizar usuario' : 'Crear usuario'}
            </button>
          </div>
        </div>

        {/* Password change — edit only */}
        {isEdit && (
          <div className="cms-card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Cambiar contraseña</h3>
              <button onClick={() => setShowPwd(!showPwd)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pink)', fontWeight: 600, fontSize: 13 }}>
                {showPwd ? 'Cancelar' : 'Cambiar'}
              </button>
            </div>
            {showPwd && (
              <form onSubmit={handlePasswordChange}>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="cms-field">
                    <label className="cms-label">Nueva contraseña <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input type="password" placeholder="Nueva contraseña" value={password.nueva_password}
                      onChange={(e) => setPassword((p) => ({ ...p, nueva_password: e.target.value }))}
                      required className="cms-input" />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Confirmar contraseña <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input type="password" placeholder="Repetir contraseña" value={password.confirm}
                      onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                      required className="cms-input" />
                  </div>
                  {pwdError && (
                    <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>{pwdError}</div>
                  )}
                </div>
                <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" disabled={pwdLoading} className="cms-btn-primary" style={{ height: 40 }}>
                    {pwdLoading ? 'Guardando…' : 'Actualizar contraseña'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
