import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getNewsById, createNews, updateNews, uploadNewsImage } from '../../api/news'
import { getActiveCountries } from '../../api/countries'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import { ImagePlus, X, Upload } from 'lucide-react'

export default function NewsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    titulo: '', resumen: '', contenido: '', slug: '', pais_id: '', estado: 'borrador',
  })
  const [countries, setCountries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [imageUrl, setImageUrl]         = useState('')
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError]     = useState('')
  const [imageSuccess, setImageSuccess] = useState(false)

  const fileRef = useRef(null)

  useEffect(() => {
    getActiveCountries().then((r) => setCountries(r.data))
    if (isEdit) {
      getNewsById(id).then((r) => {
        const d = r.data
        setForm({
          titulo:    d.titulo    || '',
          resumen:   d.resumen   || '',
          contenido: d.contenido || '',
          slug:      d.slug      || '',
          pais_id:   d.pais_id   || '',
          estado:    d.estado    || 'borrador',
        })
        if (d.imagen_principal_url) setImageUrl(d.imagen_principal_url)
      })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'titulo' && !isEdit
        ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
        : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await updateNews(id, form)
        navigate('/news')
      } else {
        const res = await createNews(form)
        const newId = res.data?.data?.id
        // Redirigir al edit para que el usuario pueda subir la imagen
        navigate(`/news/${newId}/edit`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageError('')
    setImageSuccess(false)
  }

  const handleImageUpload = async () => {
    if (!imageFile) return
    setImageLoading(true)
    setImageError('')
    setImageSuccess(false)
    try {
      const res = await uploadNewsImage(id, imageFile)
      setImageUrl(res.data.url)
      setImageFile(null)
      setImagePreview('')
      setImageSuccess(true)
      setTimeout(() => setImageSuccess(false), 3000)
    } catch (err) {
      setImageError(err.response?.data?.message || 'Error al subir la imagen')
    } finally {
      setImageLoading(false)
    }
  }

  const handleRemovePreview = () => {
    setImageFile(null)
    setImagePreview('')
    setImageError('')
    if (fileRef.current) fileRef.current.value = ''
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

            {/* Imagen principal */}
            <div className="cms-field">
              <label className="cms-label">Imagen destacada</label>

              {isEdit ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Preview: imagen actual o seleccionada */}
                  {(imagePreview || imageUrl) ? (
                    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--field)' }}>
                      <img
                        src={imagePreview || imageUrl}
                        alt="Imagen destacada"
                        style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemovePreview}
                          title="Quitar selección"
                          style={{
                            position: 'absolute', top: 6, right: 6,
                            width: 26, height: 26, borderRadius: '50%',
                            background: 'rgba(0,0,0,0.55)', border: 'none',
                            color: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        height: 110, borderRadius: 10, border: '2px dashed var(--line)',
                        background: 'var(--field)', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 6,
                        cursor: 'pointer', transition: 'border-color .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--pink)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
                    >
                      <ImagePlus size={22} style={{ color: 'var(--muted)' }} />
                      <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>Haz clic para seleccionar</span>
                      <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>JPG, PNG, WebP · máx. 20 MB</span>
                    </div>
                  )}

                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleFileChange} />

                  {/* Botones de acción */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="cms-btn-outline"
                      style={{ flex: 1, height: 36, fontSize: 12 }}
                    >
                      {imageUrl && !imagePreview ? 'Cambiar imagen' : 'Seleccionar archivo'}
                    </button>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={imageLoading}
                        className="cms-btn-primary"
                        style={{ flex: 1, height: 36, fontSize: 12 }}
                      >
                        {imageLoading ? (
                          'Subiendo…'
                        ) : (
                          <><Upload size={13} style={{ marginRight: 5 }} />Subir imagen</>
                        )}
                      </button>
                    )}
                  </div>

                  {imageError && (
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--red)' }}>{imageError}</p>
                  )}
                  {imageSuccess && (
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>✓ Imagen actualizada correctamente</p>
                  )}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', background: 'var(--field)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px' }}>
                  Guarda la noticia primero para poder subir una imagen.
                </p>
              )}
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
            <button
              type="button"
              onClick={() => {
                setForm(f => ({ ...f, estado: 'borrador' }))
                document.getElementById('news-form').requestSubmit()
              }}
              className="cms-btn-outline"
              style={{ height: 40 }}
              disabled={loading}
            >
              Guardar borrador
            </button>
            <button type="submit" form="news-form" disabled={loading} className="cms-btn-primary">
              {loading ? 'Guardando…' : isEdit ? 'Actualizar noticia' : 'Crear y continuar →'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
