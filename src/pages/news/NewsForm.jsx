import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getNewsById, createNews, updateNews } from '../../api/news'
import { getActiveCountries } from '../../api/countries'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'

export default function NewsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    titulo: '', resumen: '', contenido: '', slug: '', pais_id: '', estado: 'borrador', imagen_principal_url: '',
  })
  const [countries, setCountries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getActiveCountries().then((r) => setCountries(r.data))
    if (isEdit) {
      getNewsById(id).then((r) => {
        const d = r.data
        setForm({
          titulo: d.titulo || '',
          resumen: d.resumen || '',
          contenido: d.contenido || '',
          slug: d.slug || '',
          pais_id: d.pais_id || '',
          estado: d.estado || 'borrador',
          imagen_principal_url: d.imagen_principal_url || '',
        })
      })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'titulo' && !isEdit ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) await updateNews(id, form)
      else await createNews(form)
      navigate('/news')
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
        title={isEdit ? 'Editar noticia' : 'Nueva noticia'}
        subtitle={isEdit ? 'Modifica los campos y guarda los cambios.' : 'Completa el formulario para crear un nuevo artículo.'}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, maxWidth: 1000 }}>
        {/* LEFT: Metadata card */}
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line-2)' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Detalles de publicación</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="cms-field">
              <label className="cms-label" htmlFor="titulo">Título <span style={{ color: 'var(--red)' }}>*</span></label>
              <input id="titulo" name="titulo" className="cms-input" value={form.titulo} onChange={handleChange} required placeholder="Título del artículo" />
            </div>

            <div className="cms-field">
              <label className="cms-label" htmlFor="resumen">Resumen <span style={{ color: 'var(--red)' }}>*</span></label>
              <textarea id="resumen" name="resumen" className="cms-textarea" value={form.resumen} onChange={handleChange} required rows={3} placeholder="Breve descripción del artículo…" style={{ resize: 'vertical' }} />
            </div>

            <div className="cms-field">
              <label className="cms-label" htmlFor="slug">
                Slug
                {!isEdit && <span style={{ marginLeft: 6, fontSize: 10.5, fontWeight: 700, background: 'var(--green-bg)', color: 'var(--green)', padding: '1px 7px', borderRadius: 999 }}>Auto</span>}
              </label>
              <input id="slug" name="slug" className="cms-input" value={form.slug} onChange={handleChange} required placeholder="url-del-articulo" style={{ fontFamily: 'monospace', fontSize: 13 }} />
              <span className="cms-hint">Se genera automáticamente desde el título</span>
            </div>

            <div className="cms-field">
              <label className="cms-label" htmlFor="pais_id">País <span style={{ color: 'var(--red)' }}>*</span></label>
              <select id="pais_id" name="pais_id" className="cms-select" value={form.pais_id} onChange={handleChange} required>
                <option value="">Seleccionar país…</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="cms-field">
              <label className="cms-label" htmlFor="estado">Estado</label>
              <select id="estado" name="estado" className="cms-select" value={form.estado} onChange={handleChange}>
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>

            <div className="cms-field">
              <label className="cms-label" htmlFor="imagen_principal_url">URL de imagen destacada</label>
              <input id="imagen_principal_url" name="imagen_principal_url" className="cms-input" value={form.imagen_principal_url} onChange={handleChange} placeholder="https://cdn.example.com/imagen.jpg" />
            </div>
          </div>
        </div>

        {/* RIGHT: Content card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="cms-card" style={{ padding: 0, flex: 1 }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line-2)' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Contenido</h3>
            </div>
            <div style={{ padding: 20 }}>
              <form id="news-form" onSubmit={handleSubmit}>
                <textarea
                  name="contenido"
                  className="cms-textarea"
                  value={form.contenido}
                  onChange={handleChange}
                  required
                  rows={16}
                  placeholder="Escribe el cuerpo del artículo aquí…"
                  style={{ minHeight: 320 }}
                />
              </form>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>
              {error}
            </div>
          )}

          {/* Action bar */}
          <div style={{
            background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
            padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
          }}>
            <button type="button" onClick={() => navigate('/news')} className="cms-btn-ghost">
              Cancelar
            </button>
            <button type="button" onClick={() => { setForm(f => ({ ...f, estado: 'borrador' })); document.getElementById('news-form').requestSubmit() }} className="cms-btn-outline" style={{ height: 40 }} disabled={loading}>
              Guardar borrador
            </button>
            <button type="submit" form="news-form" disabled={loading} className="cms-btn-primary">
              {loading ? 'Guardando…' : isEdit ? 'Actualizar noticia' : 'Publicar noticia'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
