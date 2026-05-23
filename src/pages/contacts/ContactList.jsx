import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getContactRequests, deleteContactRequest } from '../../api/contacts'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { useAuth } from '../../context/AuthContext'

export default function ContactList() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)

  const load = () =>
    getContactRequests()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    await deleteContactRequest(confirm)
    setConfirm(null)
    load()
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Comunidad"
        title="Solicitudes de Contacto"
        count={items.length}
        subtitle="Mensajes enviados desde los formularios públicos de los sitios Comparte."
      />

      {loading ? (
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div className="cms-table-card" style={{ borderLeftColor: 'var(--cyan)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-2)', background: '#FCFBFD' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{items.length}</strong> solicitudes
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>País</th>
                <th>Finalidad</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>Sin solicitudes registradas</td></tr>
              ) : items.map((item) => (
                <tr key={item.id} style={{ opacity: item.estado === 'gestionada' || item.estado === 'cerrada' ? 0.6 : 1 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 12, letterSpacing: '.02em',
                      }}>
                        {(item.nombre || '?').slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 }}>{item.nombre}</div>
                        {item.telefono && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{item.telefono}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--ink)' }}>{item.correo}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>{item.paises?.nombre || '—'}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--muted)', textTransform: 'capitalize' }}>{item.finalidad || '—'}</td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Link to={`/contacts/${item.id}`} style={{ color: 'var(--pink)', fontWeight: 600, fontSize: 12.5, textDecoration: 'none' }}>Ver</Link>
                      {isAdmin && (
                        <button onClick={() => setConfirm(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 600, fontSize: 12.5 }}>Eliminar</button>
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
          message="¿Seguro que quieres eliminar esta solicitud? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  )
}
