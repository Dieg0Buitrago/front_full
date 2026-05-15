import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTestimonials, updateTestimonialStatus, deleteTestimonial } from '../../api/testimonials'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { useAuth } from '../../context/AuthContext'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

export default function TestimonialsList() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)

  const load = () =>
    getTestimonials()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleStatus = async (item) => {
    const next = item.estado === 'publicado' ? 'borrador' : 'publicado'
    await updateTestimonialStatus(item.id, { estado: next })
    load()
  }

  const handleDelete = async () => {
    await deleteTestimonial(confirm)
    setConfirm(null)
    load()
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Contenido"
        title="Testimonios"
        count={items.length}
        subtitle="Historias y experiencias de la comunidad Comparte."
        action={
          <Link to="/testimonials/new" className="cms-btn-primary">
            <PlusIcon /> Nuevo testimonio
          </Link>
        }
      />

      {loading ? (
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div className="cms-table-card" style={{ borderLeftColor: 'var(--orange)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-2)', background: '#FCFBFD' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{items.length}</strong> testimonios
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>País</th>
                <th>Destacado</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>Sin testimonios registrados</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {item.foto_url ? (
                        <img src={item.foto_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <span style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, var(--orange), var(--pink))',
                          color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 12,
                        }}>
                          {item.nombre?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 }}>{item.nombre}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{item.paises?.nombre || '—'}</td>
                  <td><StatusBadge value={item.destacado} /></td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Link to={`/testimonials/${item.id}/edit`} style={{ color: 'var(--pink)', fontWeight: 600, fontSize: 12.5, textDecoration: 'none' }}>Editar</Link>
                      {isAdmin && (
                        <>
                          <button onClick={() => handleStatus(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--yellow)', fontWeight: 600, fontSize: 12.5 }}>
                            {item.estado === 'publicado' ? 'Despublicar' : 'Publicar'}
                          </button>
                          <button onClick={() => setConfirm(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 600, fontSize: 12.5 }}>Eliminar</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message="¿Seguro que quieres eliminar este testimonio? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  )
}
