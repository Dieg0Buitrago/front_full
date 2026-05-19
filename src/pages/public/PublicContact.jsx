import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { submitContact, getPublicCountries } from '../../api/public'
import PublicLayout from './PublicLayout'

const FINALIDADES = [
  'Información general',
  'Alianza estratégica',
  'Oportunidad de negocio',
  'Voluntariado',
  'Prensa y medios',
  'Otro',
]

export default function PublicContact() {
  const { countrySlug } = useParams()
  const countryName = countrySlug ? countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1) : ''

  const [paisId, setPaisId]   = useState(null)
  const [form, setForm]       = useState({ nombre: '', correo: '', telefono: '', finalidad: '', mensaje: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState(null)

  // Resolve pais_id from slug
  useEffect(() => {
    getPublicCountries()
      .then(r => {
        const list = r.data?.data || r.data || []
        const found = list.find(c => c.slug === countrySlug)
        if (found) setPaisId(found.id)
      })
      .catch(() => {})
  }, [countrySlug])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.correo || !form.telefono || !form.finalidad || !form.mensaje) {
      setError('Todos los campos son obligatorios.')
      return
    }
    if (!paisId) {
      setError('No se pudo identificar el país. Recarga la página.')
      return
    }
    setSending(true)
    setError(null)
    try {
      await submitContact({ ...form, pais_id: paisId })
      setSuccess(true)
      setForm({ nombre: '', correo: '', telefono: '', finalidad: '', mensaje: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la solicitud. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #E63B6F 0%, #7B2D8B 100%)',
        padding: '60px 40px 80px',
        color: '#fff',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.18)',
            borderRadius: 999, padding: '5px 16px',
            fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', marginBottom: 20,
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            Formulario de contacto
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, marginBottom: 14 }}>
            Contáctanos en {countryName}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', maxWidth: 520, lineHeight: 1.65 }}>
            Cuéntanos cómo podemos apoyarte. Tu solicitud será registrada y gestionada por el equipo correspondiente del país seleccionado.
          </p>
        </div>
      </section>

      {/* Form section — overlaps hero */}
      <section style={{ maxWidth: 900, margin: '-40px auto 60px', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 0,
          background: '#fff',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 60px -16px rgba(20,10,40,0.25)',
          border: '1px solid var(--line)',
        }}>
          {/* Left info panel */}
          <div style={{
            background: 'linear-gradient(160deg, #2A1042 0%, #7B2D8B 100%)',
            padding: '48px 32px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}>
            <div>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✉️</div>
              <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 10 }}>Estamos para orientarte</h3>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>
                Completa el formulario con tus datos. Esta información permitirá clasificar tu solicitud y dar seguimiento desde el CMS administrativo.
              </p>
            </div>

            <InfoItem label="País seleccionado" value={countryName} />
            <InfoItem label="Gestión" value="Seguimiento administrativo" />
          </div>

          {/* Right form */}
          <div style={{ padding: '48px 40px' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                <h3 style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginBottom: 12 }}>
                  ¡Solicitud enviada!
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                  Recibimos tu mensaje. El equipo de {countryName} se pondrá en contacto contigo pronto.
                </p>
                <button onClick={() => setSuccess(false)} className="cms-btn-primary" style={{ margin: '0 auto' }}>
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h3 style={{ fontWeight: 800, fontSize: 20, color: 'var(--ink)', marginBottom: 4 }}>
                  Enviar solicitud
                </h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: -14 }}>
                  Los campos marcados son necesarios para poder contactarte.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="cms-field">
                    <label className="cms-label">Nombre completo <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input className="cms-input" placeholder="Ejemplo: Carlos Ramírez" value={form.nombre} onChange={set('nombre')} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Correo electrónico <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input className="cms-input" type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={set('correo')} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="cms-field">
                    <label className="cms-label">Teléfono <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input className="cms-input" placeholder="3001234567" value={form.telefono} onChange={set('telefono')} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Finalidad <span style={{ color: 'var(--red)' }}>*</span></label>
                    <select className="cms-select" value={form.finalidad} onChange={set('finalidad')}>
                      <option value="">Seleccione una opción</option>
                      {FINALIDADES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div className="cms-field">
                  <label className="cms-label">Mensaje <span style={{ color: 'var(--red)' }}>*</span></label>
                  <textarea
                    className="cms-textarea"
                    style={{ minHeight: 120 }}
                    placeholder="Cuéntanos brevemente tu necesidad..."
                    value={form.mensaje}
                    onChange={set('mensaje')}
                  />
                </div>

                {error && (
                  <div style={{ background: 'var(--red-bg)', color: 'var(--red)', borderRadius: 10, padding: '12px 14px', fontSize: 13.5, fontWeight: 500 }}>
                    {error}
                  </div>
                )}

                <button type="submit" className="cms-btn-primary" disabled={sending} style={{ alignSelf: 'flex-start', height: 48, paddingLeft: 32, paddingRight: 32, fontSize: 15 }}>
                  {sending ? 'Enviando…' : 'Enviar solicitud'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

function InfoItem({ label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      borderRadius: 12,
      padding: '14px 18px',
      display: 'flex',
      gap: 14,
      alignItems: 'center',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  )
}