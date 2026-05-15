import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCountryById, createCountry, updateCountry } from '../../api/countries'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'

export default function CountryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ nombre: '', slug: '', codigo: '', estado: 'activo', descripcion: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getCountryById(id).then((r) => {
        const d = r.data
        setForm({
          nombre: d.nombre || '',
          slug: d.slug || '',
          codigo: d.codigo || '',
          estado: d.estado || 'activo',
          descripcion: d.descripcion || '',
        })
      })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'nombre' && !isEdit ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) await updateCountry(id, form)
      else await createCountry(form)
      navigate('/countries')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Comunidad"
        title={isEdit ? 'Editar país' : 'Nuevo país'}
        subtitle="Configura la información del país en el sistema."
      />

      <div style={{ maxWidth: 560 }}>
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Datos del país</h3>
          </div>

          <form id="country-form" onSubmit={handleSubmit}>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="cms-field">
                <label className="cms-label" htmlFor="nombre">Nombre <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="nombre" name="nombre" className="cms-input" value={form.nombre} onChange={handleChange} required placeholder="Nombre del país" />
              </div>

              <div className="cms-field">
                <label className="cms-label" htmlFor="slug">
                  Slug <span style={{ color: 'var(--red)' }}>*</span>
                  {!isEdit && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: 'var(--cyan-bg, #DDF1FA)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Auto</span>
                  )}
                </label>
                <input id="slug" name="slug" className="cms-input" value={form.slug} onChange={handleChange} required placeholder="nombre-del-pais" style={{ fontFamily: 'monospace', fontSize: 13 }} />
                <span className="cms-hint">Identificador único en URL. Solo letras minúsculas, números y guiones.</span>
              </div>

              <div className="cms-field">
                <label className="cms-label" htmlFor="codigo">Código</label>
                <input id="codigo" name="codigo" className="cms-input" value={form.codigo} onChange={handleChange} maxLength={10} placeholder="CO, MX, AR…" style={{ textTransform: 'uppercase', width: 120 }} />
              </div>

              <div className="cms-field">
                <label className="cms-label" htmlFor="estado">Estado</label>
                <select id="estado" name="estado" className="cms-select" value={form.estado} onChange={handleChange}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="cms-field">
                <label className="cms-label" htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" className="cms-textarea" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Descripción opcional…" />
              </div>
            </div>

            {error && (
              <div style={{ margin: '0 20px 16px', background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>{error}</div>
            )}
          </form>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={() => navigate('/countries')} className="cms-btn-ghost">Cancelar</button>
            <button type="submit" form="country-form" disabled={loading} className="cms-btn-primary" style={{ height: 40 }}>
              {loading ? 'Guardando…' : isEdit ? 'Actualizar país' : 'Crear país'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
