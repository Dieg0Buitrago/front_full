import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { submitContact, getPublicCountries } from '../../api/public'
import { getCountry } from '../../config/countries'
import PublicLayout from './PublicLayout'

const FINALIDADES = [
  'Información general',
  'Alianza estratégica',
  'Oportunidad de negocio',
  'Voluntariado',
  'Prensa y medios',
  'Otro',
]

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 700, color: '#444', letterSpacing: '0.02em' }}>
        {label} {required && <span style={{ color: '#E8305A' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export default function PublicContact() {
  const { countrySlug } = useParams()
  const country  = getCountry(countrySlug)
  const accent   = country?.accent ?? '#E8305A'
  const c1       = country?.c1 ?? '#E8305A'
  const c2       = country?.c2 ?? '#F47B3E'
  const c3       = country?.c3 ?? '#3AB8D4'

  const [paisId, setPaisId]   = useState(null)
  const [form, setForm]       = useState({ nombre: '', correo: '', telefono: '', finalidad: '', mensaje: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState(null)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    getPublicCountries()
      .then(r => {
        const list  = r.data?.data || r.data || []
        const found = list.find(c => c.slug === countrySlug)
        if (found) setPaisId(found.id)
      })
      .catch(() => {})
  }, [countrySlug])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const inputStyle = field => ({
    height: 44, padding: '0 14px',
    border: `1.5px solid ${focusedField === field ? accent : '#e0e0e0'}`,
    borderRadius: 10, fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focusedField === field ? `0 0 0 3px ${accent}18` : 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  })

  const selectStyle = field => ({
    ...inputStyle(field),
    appearance: 'none', background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center`,
    paddingRight: 36,
  })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.nombre || !form.correo || !form.telefono || !form.finalidad || !form.mensaje) {
      setError('Todos los campos son obligatorios.')
      return
    }
    if (!paisId) {
      setError('No se pudo identificar el país. Recarga la página.')
      return
    }
    setSending(true); setError(null)
    try {
      await submitContact({ ...form, pais_id: paisId })
      setSuccess(true)
      setForm({ nombre: '', correo: '', telefono: '', finalidad: '', mensaje: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <PublicLayout>
      {/* ══ HERO ══ */}
      <section style={{
        background: country?.heroBg ?? 'linear-gradient(135deg,#E63B6F,#7B2D8B)',
        padding: '72px 40px 100px',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: `1px solid ${accent}25`, top: -120, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: `1px solid ${c2}20`, bottom: -80, left: 60, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          {country?.logo && (
            <img src={country.logo} alt={country.tagline} style={{ height: 80, width: 80, objectFit: 'contain', marginBottom: 20, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '5px 16px', marginBottom: 18 }}>
            <span style={{ fontSize: 14 }}>{country?.flag}</span>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contacto</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.5px' }}>
            Contáctanos en {country?.name ?? countrySlug}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)', lineHeight: 1.68, maxWidth: 520, margin: '0 auto' }}>
            Cuéntanos cómo podemos apoyarte. Tu solicitud será gestionada por el equipo del país seleccionado.
          </p>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${c1},${c2},${c3})` }} />
      </section>

      {/* ══ FORM — overlaps hero ══ */}
      <section style={{ maxWidth: 960, margin: '-52px auto 80px', padding: '0 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0,
          background: '#fff', borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 24px 70px -16px rgba(0,0,0,0.22)',
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          {/* ── Left panel ── */}
          <div style={{
            background: country?.heroBg ?? `linear-gradient(160deg,#2A1042,#7B2D8B)`,
            padding: '48px 28px',
            color: '#fff',
            display: 'flex', flexDirection: 'column', gap: 28,
          }}>
            {country?.logo ? (
              <img src={country.logo} alt={country.tagline} style={{ height: 64, width: 64, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
            ) : (
              <div style={{ fontSize: 36 }}>✉️</div>
            )}

            <div>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 10, lineHeight: 1.3 }}>
                Estamos aquí para orientarte
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
                Completa el formulario con tus datos. Esto nos permite clasificar tu solicitud y darte seguimiento personalizado.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <InfoItem icon="🌍" label="País" value={`${country?.flag ?? ''} ${country?.name ?? countrySlug}`} accent={accent} />
              <InfoItem icon="⏱️" label="Respuesta" value="En menos de 48 horas" accent={accent} />
              <InfoItem icon="🔒" label="Privacidad" value="Tus datos están seguros" accent={accent} />
            </div>

            {/* decorative dots */}
            <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
              {[c1, c2, c3].map((c, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
            </div>
          </div>

          {/* ── Right form ── */}
          <div style={{ padding: '48px 40px' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${accent}18`, border: `2px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                  ✅
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 22, color: '#111', marginBottom: 4 }}>¡Solicitud enviada!</h3>
                <p style={{ color: '#666', fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
                  Recibimos tu mensaje. El equipo de <strong>{country?.name ?? countrySlug}</strong> se pondrá en contacto pronto.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  style={{ marginTop: 8, height: 44, padding: '0 28px', background: `linear-gradient(135deg,${c1},${c2})`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: `0 8px 20px ${accent}40` }}
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 20, color: '#111', marginBottom: 4 }}>Enviar solicitud</h3>
                  <p style={{ fontSize: 13, color: '#888' }}>Los campos marcados con * son obligatorios.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Nombre completo" required>
                    <input style={inputStyle('nombre')} placeholder="Carlos Ramírez" value={form.nombre} onChange={set('nombre')} onFocus={() => setFocusedField('nombre')} onBlur={() => setFocusedField(null)} />
                  </Field>
                  <Field label="Correo electrónico" required>
                    <input style={inputStyle('correo')} type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={set('correo')} onFocus={() => setFocusedField('correo')} onBlur={() => setFocusedField(null)} />
                  </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Teléfono" required>
                    <input style={inputStyle('telefono')} placeholder="3001234567" value={form.telefono} onChange={set('telefono')} onFocus={() => setFocusedField('telefono')} onBlur={() => setFocusedField(null)} />
                  </Field>
                  <Field label="Finalidad" required>
                    <select style={selectStyle('finalidad')} value={form.finalidad} onChange={set('finalidad')} onFocus={() => setFocusedField('finalidad')} onBlur={() => setFocusedField(null)}>
                      <option value="">Selecciona una opción</option>
                      {FINALIDADES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Mensaje" required>
                  <textarea
                    placeholder="Cuéntanos brevemente tu necesidad..."
                    value={form.mensaje}
                    onChange={set('mensaje')}
                    onFocus={() => setFocusedField('mensaje')}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle('mensaje'), height: 'auto', minHeight: 120, padding: '12px 14px', resize: 'vertical', lineHeight: 1.6 }}
                  />
                </Field>

                {error && (
                  <div style={{ background: '#fff5f5', color: '#cc0000', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, fontWeight: 500, border: '1px solid #ffd5d5' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    alignSelf: 'flex-start', height: 48, padding: '0 32px',
                    background: sending ? '#ccc' : `linear-gradient(135deg,${c1},${c2})`,
                    color: '#fff', border: 'none', borderRadius: 12,
                    fontWeight: 700, fontSize: 15, cursor: sending ? 'not-allowed' : 'pointer',
                    boxShadow: sending ? 'none' : `0 8px 24px ${accent}45`,
                    transition: 'all 0.2s', fontFamily: 'inherit',
                  }}
                >
                  {sending ? 'Enviando…' : 'Enviar solicitud →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

function InfoItem({ icon, label, value, accent }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  )
}
