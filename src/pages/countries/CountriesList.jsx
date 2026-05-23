import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCountries, updateCountryStatus, uploadCountryLogo } from '../../api/countries'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

function LogoCell({ item, onUploaded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadCountryLogo(item.id, file)
      onUploaded()
    } catch {
      /* ignore — user can try from edit form */
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Avatar: logo image or flag/initials fallback */}
      <div
        onClick={() => inputRef.current?.click()}
        title="Clic para cambiar logo"
        style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: item.color_oscuro
            ? `linear-gradient(135deg, ${item.color_primario || '#E8305A'}, ${item.color_oscuro})`
            : 'linear-gradient(135deg, var(--purple), var(--cyan))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', cursor: 'pointer',
          border: '1.5px solid rgba(255,255,255,0.1)',
          position: 'relative',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        {uploading ? (
          <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        ) : item.logo_url ? (
          <img src={item.logo_url} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 5 }} />
        ) : (
          <span style={{ fontSize: item.flag ? 20 : 13, color: '#fff', fontWeight: 700 }}>
            {item.flag || item.nombre?.[0]?.toUpperCase()}
          </span>
        )}
        <input ref={inputRef} type="file" accept="image/*,.svg" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      {/* Name + tagline */}
      <div>
        <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 }}>{item.nombre}</div>
        {item.tagline && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{item.tagline}</div>}
      </div>
    </div>
  )
}

function ColorDots({ item }) {
  const colors = [item.color_primario, item.color_secundario, item.color_acento, item.color_oscuro].filter(Boolean)
  if (colors.length === 0) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {colors.map((c, i) => (
        <div key={i} title={c} style={{ width: 16, height: 16, borderRadius: 4, background: c, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
      ))}
    </div>
  )
}

export default function CountriesList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    getCountries()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleStatus = async (item) => {
    const next = item.estado === 'activo' ? 'inactivo' : 'activo'
    await updateCountryStatus(item.id, { estado: next })
    load()
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Comunidad"
        title="Países"
        count={items.length}
        subtitle="Países configurados con acceso al CMS y sitios Comparte. Haz clic en el logo para cambiarlo rápidamente."
        action={
          <Link to="/countries/new" className="cms-btn-primary">
            <PlusIcon /> Nuevo país
          </Link>
        }
      />

      {loading ? (
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div className="cms-table-card" style={{ borderLeftColor: 'var(--purple)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-2)', background: '#FCFBFD' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{items.length}</strong> países ·{' '}
              <span style={{ color: 'var(--muted)' }}>Clic en el avatar para subir logo</span>
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>País</th>
                <th>Slug</th>
                <th>Código</th>
                <th>Colores</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>Sin países registrados</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <LogoCell item={item} onUploaded={load} />
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12.5, color: 'var(--muted)' }}>{item.slug}</td>
                  <td>
                    {item.codigo ? (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#EEF0F4', color: '#5C5772', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                        {item.codigo}
                      </span>
                    ) : <span style={{ color: 'var(--muted)' }}>—</span>}
                  </td>
                  <td><ColorDots item={item} /></td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Link to={`/countries/${item.id}/edit`} style={{ color: 'var(--pink)', fontWeight: 600, fontSize: 12.5, textDecoration: 'none' }}>Editar</Link>
                      <button onClick={() => handleStatus(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--yellow)', fontWeight: 600, fontSize: 12.5 }}>
                        {item.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
