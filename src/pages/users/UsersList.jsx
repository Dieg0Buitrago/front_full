import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, updateUserStatus, deleteUser } from '../../api/users'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const rolStyle = { fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, textTransform: 'capitalize' }
const rolColors = {
  superadmin: { background: '#F1EBFB', color: 'var(--purple)' },
  admin_pais: { background: '#DDF1FA', color: 'var(--cyan)' },
  editor:     { background: 'var(--yellow-bg)', color: 'var(--yellow)' },
}

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)

  const load = () =>
    getUsers()
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleStatus = async (u) => {
    const next = u.estado === 'activo' ? 'inactivo' : 'activo'
    await updateUserStatus(u.id, { estado: next })
    load()
  }

  const handleDelete = async () => {
    await deleteUser(confirm)
    setConfirm(null)
    load()
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Administración"
        title="Usuarios"
        count={users.length}
        subtitle="Administradores y editores con acceso al CMS."
        action={
          <Link to="/users/new" className="cms-btn-primary">
            <PlusIcon /> Nuevo usuario
          </Link>
        }
      />

      {loading ? (
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div className="cms-table-card" style={{ borderLeftColor: 'var(--green)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-2)', background: '#FCFBFD' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{users.length}</strong> usuarios
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Username</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>Sin usuarios registrados</td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--orange), var(--pink))',
                        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 12,
                      }}>
                        {`${u.nombre?.[0] || ''}${u.apellido?.[0] || ''}`.toUpperCase() || u.username?.[0]?.toUpperCase() || '?'}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 }}>{u.nombre} {u.apellido}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--muted)' }}>{u.username}</td>
                  <td>
                    <span style={{ ...rolStyle, ...(rolColors[u.roles?.nombre] || { background: '#EEF0F4', color: '#5C5772' }) }}>
                      {u.roles?.nombre || '—'}
                    </span>
                  </td>
                  <td><StatusBadge value={u.estado} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Link to={`/users/${u.id}/edit`} style={{ color: 'var(--pink)', fontWeight: 600, fontSize: 12.5, textDecoration: 'none' }}>Editar</Link>
                      <button onClick={() => handleStatus(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--yellow)', fontWeight: 600, fontSize: 12.5 }}>
                        {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                      <button onClick={() => setConfirm(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 600, fontSize: 12.5 }}>Eliminar</button>
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
          message="¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  )
}
