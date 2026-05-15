import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTestimonialById, createTestimonial, updateTestimonial } from '../../api/testimonials'
import { getActiveCountries } from '../../api/countries'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    pais_id: '', nombre: '', cargo: '', empresa: '', contenido: '', foto_url: '',
    instagram_url: '', facebook_url: '', estado: 'borrador', destacado: false
  })
  const [countries, setCountries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getActiveCountries().then((r) => setCountries(r.data))
    if (isEdit) {
      getTestimonialById(id).then((r) => {
        const d = r.data
        setForm({
          pais_id: d.pais_id || '',
          nombre: d.nombre || '',
          cargo: d.cargo || '',
          empresa: d.empresa || '',
          contenido: d.contenido || '',
          foto_url: d.foto_url || '',
          estado: d.estado || 'borrador',
          destacado: d.destacado || false,
          instagram_url: d.instagram_url || '',
          facebook_url: d.facebook_url || '',
        })
      })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) await updateTestimonial(id, form)
      else await createTestimonial(form)
      navigate('/testimonials')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Contenido"
        title={isEdit ? 'Editar testimonio' : 'Nuevo testimonio'}
        subtitle="Completa la información del testimonio de comunidad."
      />

      <div style={{ maxWidth: 760 }}>
        <form onSubmit={handleSubmit}>
          <div className="cms-card" style={{ padding: 0, marginBottom: 16 }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line-2)' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Datos del testimonio</h3>
            </div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="cms-field">
                <label className="cms-label" htmlFor="nombre">Nombre <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="nombre" name="nombre" className="cms-input" value={form.nombre} onChange={handleChange} required placeholder="Nombre completo" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="pais_id">País <span style={{ color: 'var(--red)' }}>*</span></label>
                <select id="pais_id" name="pais_id" className="cms-select" value={form.pais_id} onChange={handleChange} required>
                  <option value="">Seleccionar país…</option>
                  {countries.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="cargo">Cargo</label>
                <input id="cargo" name="cargo" className="cms-input" value={form.cargo} onChange={handleChange} placeholder="Ej: Participante" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="empresa">Empresa / Organización</label>
                <input id="empresa" name="empresa" className="cms-input" value={form.empresa} onChange={handleChange} placeholder="Ej: Latino América" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="estado">Estado</label>
                <select id="estado" name="estado" className="cms-select" value={form.estado} onChange={handleChange}>
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="foto_url">URL de foto <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="foto_url" name="foto_url" className="cms-input" value={form.foto_url} onChange={handleChange} required placeholder="https://..." />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="instagram_url">Instagram</label>
                <input id="instagram_url" name="instagram_url" className="cms-input" value={form.instagram_url} onChange={handleChange} placeholder="https://instagram.com/usuario" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="facebook_url">Facebook</label>
                <input id="facebook_url" name="facebook_url" className="cms-input" value={form.facebook_url} onChange={handleChange} placeholder="https://facebook.com/usuario" />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox" name="destacado" id="destacado"
                  checked={form.destacado} onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: 'var(--pink)', cursor: 'pointer' }}
                />
                <label htmlFor="destacado" className="cms-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                  Marcar como destacado
                </label>
              </div>
              <div className="cms-field" style={{ gridColumn: 'span 2' }}>
                <label className="cms-label" htmlFor="contenido">Testimonio <span style={{ color: 'var(--red)' }}>*</span></label>
                <textarea id="contenido" name="contenido" className="cms-textarea" value={form.contenido} onChange={handleChange} required rows={6} placeholder="Escribe el testimonio aquí…" />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/testimonials')} className="cms-btn-ghost">Cancelar</button>
            <button type="submit" disabled={loading} className="cms-btn-primary">
              {loading ? 'Guardando…' : isEdit ? 'Actualizar testimonio' : 'Crear testimonio'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
