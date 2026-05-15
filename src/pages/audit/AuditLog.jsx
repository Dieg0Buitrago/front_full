import { useEffect, useState } from 'react'
import { getAuditLogs } from '../../api/audit'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'

const actionColors = {
  CREATE: { background: 'var(--green-bg)',  color: 'var(--green)' },
  UPDATE: { background: '#DDF1FA',           color: 'var(--cyan)' },
  DELETE: { background: 'var(--red-bg)',    color: 'var(--red)' },
  LOGIN:  { background: '#F1EBFB',           color: 'var(--purple)' },
  LOGOUT: { background: '#EEF0F4',           color: '#5C5772' },
}

function getActionStyle(accion) {
  if (!accion) return { background: '#EEF0F4', color: '#5C5772' }
  const key = accion.toUpperCase()
  for (const [k, v] of Object.entries(actionColors)) {
    if (key.includes(k)) return v
  }
  return { background: '#EEF0F4', color: '#5C5772' }
}

const fmt = (date) => date ? new Date(date).toLocaleString('es-CO') : '—'

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAuditLogs()
      .then((r) => setLogs(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <PageHeader
        eyebrow="Administración"
        title="Bitácora de auditoría"
        count={logs.length}
        subtitle="Registro de todas las acciones realizadas por los usuarios del sistema."
      />

      {loading ? (
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div className="cms-table-card" style={{ borderLeftColor: 'var(--purple)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-2)', background: '#FCFBFD' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{logs.length}</strong> registros
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Recurso</th>
                <th style={{ textAlign: 'right' }}>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>Sin registros de auditoría</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {fmt(log.created_at || log.fecha)}
                  </td>
                  <td style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>
                    {log.usuario_nombre || log.usuario_id || '—'}
                  </td>
                  <td>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                      fontFamily: 'monospace', letterSpacing: '.04em', textTransform: 'uppercase',
                      ...getActionStyle(log.accion),
                    }}>
                      {log.accion}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'capitalize' }}>
                    {log.recurso || log.tabla || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelected(selected?.id === log.id ? null : log)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pink)', fontWeight: 600, fontSize: 12.5 }}
                    >
                      {selected?.id === log.id ? 'Cerrar' : 'Ver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="cms-card" style={{ padding: 0, marginTop: 16, maxWidth: 760 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
              Detalle del registro #{selected.id}
            </h3>
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 18, lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
          <pre style={{
            margin: 0, padding: '16px 20px', fontSize: 12, lineHeight: 1.6,
            background: '#FAFAFA', color: 'var(--ink)', overflowX: 'auto',
            borderRadius: '0 0 16px 16px', fontFamily: 'monospace',
          }}>
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      )}
    </Layout>
  )
}
