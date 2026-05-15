import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCountries, updateCountryStatus } from '../../api/countries'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

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
        subtitle="Países configurados con acceso al CMS y sitios Comparte."
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
              Mostrando <strong style={{ color: 'var(--ink)' }}>{items.length}</strong> países
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>País</th>
                <th>Slug</th>
                <th>Código</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>Sin países registrados</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <GlobeIcon />
                      </span>
                      <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 }}>{item.nombre}</div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12.5, color: 'var(--muted)' }}>{item.slug}</td>
                  <td>
                    {item.codigo ? (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#EEF0F4', color: '#5C5772', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                        {item.codigo}
                      </span>
                    ) : <span style={{ color: 'var(--muted)' }}>—</span>}
                  </td>
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
