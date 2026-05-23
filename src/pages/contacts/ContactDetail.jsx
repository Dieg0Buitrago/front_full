import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContactRequestById, updateContactStatus } from '../../api/contacts'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { useAuth } from '../../context/AuthContext'

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  )
}

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    getContactRequestById(id)
      .then((r) => setItem(r.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleToggleStatus = async () => {
    const next = item.estado === 'pendiente' ? 'gestionada' : 'pendiente'
    setUpdating(true)
    try {
      await updateContactStatus(id, { estado: next })
      setItem((i) => ({ ...i, estado: next }))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <Layout><div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div></Layout>
  if (!item) return <Layout><div style={{ color: 'var(--muted)', fontSize: 14 }}>Solicitud no encontrada.</div></Layout>

  return (
    <Layout>
      <PageHeader
        eyebrow="Comunidad"
        title="Detalle de solicitud"
        action={
          <button onClick={() => navigate('/contacts')} className="cms-btn-outline" style={{ height: 38 }}>
            ← Volver
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, maxWidth: 900 }}>
        {/* Message panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="cms-card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                  color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 13,
                }}>
                  {(item.nombre || '?').slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{item.nombre}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>{item.correo}</div>
                </div>
              </div>
              <StatusBadge value={item.estado} />
            </div>

            {item.mensaje ? (
              <div style={{
                margin: 20, padding: '16px 18px',
                background: '#fff', border: '1px solid var(--line)',
                borderLeft: '3px solid var(--pink)', borderRadius: 12,
                fontSize: 14, lineHeight: 1.65, color: 'var(--ink)',
              }}>
                {item.mensaje}
              </div>
            ) : (
              <div style={{ padding: '24px 20px', color: 'var(--muted)', fontSize: 13 }}>Sin mensaje.</div>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={handleToggleStatus}
              disabled={updating}
              className="cms-btn-primary"
              style={{ alignSelf: 'flex-start' }}
            >
              {updating ? 'Actualizando…' : item.estado === 'pendiente' ? '✓ Marcar como gestionada' : 'Marcar como pendiente'}
            </button>
          )}
        </div>

        {/* Info panel */}
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Información de contacto</h3>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InfoRow label="Nombre completo" value={item.nombre} />
            <InfoRow label="Email" value={item.correo} />
            <InfoRow label="Teléfono" value={item.telefono} />
            <InfoRow label="Finalidad" value={item.finalidad} />
            <InfoRow label="País" value={item.paises?.nombre || item.pais_id} />
            <InfoRow label="Estado" value={item.estado} />
            <InfoRow label="Fecha" value={item.created_at ? new Date(item.created_at).toLocaleString('es-CO') : undefined} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
