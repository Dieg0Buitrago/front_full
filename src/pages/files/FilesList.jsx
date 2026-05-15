import { useEffect, useState, useRef } from 'react'
import { getFiles, createFile, deleteFile } from '../../api/files'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import ConfirmModal from '../../components/ConfirmModal'
import { getCountries } from '../../api/countries'
import { useAuth } from '../../context/AuthContext'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const typeBadgeStyle = {
  fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em',
  padding: '2px 8px', borderRadius: 999,
}
const typeColors = {
  pdf:   { background: 'var(--red-bg)',   color: 'var(--red)' },
  word:  { background: '#DDF1FA',          color: 'var(--cyan)' },
  excel: { background: 'var(--green-bg)', color: 'var(--green)' },
  otro:  { background: '#EEF0F4',          color: '#5C5772' },
}
const MIME_MAP = {
  pdf:   'application/pdf',
  word:  'application/msword',
  excel: 'application/vnd.ms-excel',
  otro:  'application/octet-stream',
}
function tipoFromMime(mime = '') {
  if (mime.includes('pdf'))   return 'pdf'
  if (mime.includes('word') || mime.includes('msword')) return 'word'
  if (mime.includes('excel') || mime.includes('spreadsheet')) return 'excel'
  return 'otro'
}
function fmtBytes(b) {
  if (!b) return ''
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}

const EMPTY_FORM = { nombre: '', nombre_original: '', url: '', pais_id: '', tipo: 'pdf', tamano: 0 }

export default function FilesList() {
  const { isAdmin } = useAuth()
  const [items, setItems]     = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [sizeLabel, setSizeLabel] = useState('')
  const abortRef = useRef(null)

  const load = () =>
    getFiles()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
    getCountries().then((r) => setCountries(r.data))
  }, [])

  const handleDelete = async () => {
    await deleteFile(confirm)
    setConfirm(null)
    load()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleUrlBlur = async (e) => {
    const url = e.target.value.trim()
    if (!url) return
    setSizeLabel('Calculando…')
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    try {
      const res = await fetch(url, { method: 'HEAD', signal: abortRef.current.signal })
      const len = res.headers.get('content-length')
      const bytes = len ? Number(len) : 0
      setForm((f) => ({ ...f, tamano: bytes }))
      setSizeLabel(bytes ? fmtBytes(bytes) : 'Tamaño no disponible')
    } catch {
      setForm((f) => ({ ...f, tamano: 0 }))
      setSizeLabel('Tamaño no disponible')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        nombre:          form.nombre,
        nombre_original: form.nombre_original || form.nombre,
        url:             form.url,
        pais_id:         form.pais_id,
        tipo_mime:       MIME_MAP[form.tipo] || MIME_MAP.otro,
        tamano:          Number(form.tamano) || 0,
      }
      await createFile(payload)
      setShowForm(false)
      setForm(EMPTY_FORM)
      setSizeLabel('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Repositorio"
        title="Archivos"
        count={items.length}
        subtitle="Documentos y recursos disponibles en los sitios Comparte."
        action={
          isAdmin && (
            <button onClick={() => setShowForm(!showForm)} className={showForm ? 'cms-btn-outline' : 'cms-btn-primary'} style={{ height: 40 }}>
              {showForm ? 'Cancelar' : <><PlusIcon /> Registrar archivo</>}
            </button>
          )
        }
      />

      {showForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
          <div className="cms-card" style={{ padding: 0, maxWidth: 720 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Registrar nuevo archivo</h3>
            </div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="cms-field">
                <label className="cms-label" htmlFor="nombre">Nombre <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="nombre" name="nombre" className="cms-input" value={form.nombre} onChange={handleChange} required placeholder="Nombre descriptivo" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="nombre_original">Nombre original del archivo <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="nombre_original" name="nombre_original" className="cms-input" value={form.nombre_original} onChange={handleChange} required placeholder="reporte_2025.pdf" />
              </div>
              <div className="cms-field">
                <label className="cms-label" htmlFor="pais_id">País <span style={{ color: 'var(--red)' }}>*</span></label>
                <select id="pais_id" name="pais_id" className="cms-select" value={form.pais_id} onChange={handleChange} required>
                  <option value="">Seleccionar país…</option>
                  {countries.filter(c => c.estado === 'activo' || c.activo).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="cms-field" style={{ gridColumn: 'span 2' }}>
                <label className="cms-label" htmlFor="tipo">Tipo</label>
                <select id="tipo" name="tipo" className="cms-select" value={form.tipo} onChange={handleChange}>
                  <option value="pdf">PDF</option>
                  <option value="word">Word</option>
                  <option value="excel">Excel</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="cms-field" style={{ gridColumn: 'span 2' }}>
                <label className="cms-label" htmlFor="url">
                  URL del archivo <span style={{ color: 'var(--red)' }}>*</span>
                  {sizeLabel && (
                    <span style={{ marginLeft: 10, fontWeight: 500, fontSize: 12, color: sizeLabel === 'Calculando…' ? 'var(--muted)' : 'var(--green)' }}>
                      {sizeLabel}
                    </span>
                  )}
                </label>
                <input
                  id="url" name="url" className="cms-input"
                  value={form.url} onChange={handleChange} onBlur={handleUrlBlur}
                  required placeholder="https://..."
                />
              </div>
            </div>
            {error && (
              <div style={{ margin: '0 20px 16px', background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>{error}</div>
            )}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} className="cms-btn-primary" style={{ height: 40 }}>
                {saving ? 'Guardando…' : 'Registrar archivo'}
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div className="cms-table-card" style={{ borderLeftColor: 'var(--cyan)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-2)', background: '#FCFBFD' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{items.length}</strong> archivos
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>País</th>
                <th>Tipo</th>
                <th>Tamaño</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>Sin archivos registrados</td></tr>
              ) : items.map((item) => {
                const paisNombre = item.paises?.nombre || '—'
                const t = item.tipo || tipoFromMime(item.tipo_mime)
                return (
                  <tr key={item.id}>
                    <td>
                      <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--pink)', fontWeight: 600, fontSize: 13.5, textDecoration: 'none' }}>
                        {item.nombre}
                      </a>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>{paisNombre}</td>
                    <td>
                      <span style={{ ...typeBadgeStyle, ...(typeColors[t] || typeColors.otro) }}>{t}</span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>{item.tamano ? fmtBytes(item.tamano) : '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {isAdmin && (
                        <button onClick={() => setConfirm(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 600, fontSize: 12.5 }}>Eliminar</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message="¿Seguro que quieres eliminar este archivo? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  )
}