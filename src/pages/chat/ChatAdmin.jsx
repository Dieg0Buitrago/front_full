import { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import { useAdminStats } from '../../chat/hooks/useAdminStats'
import { FileText, UploadCloud, X, RefreshCw } from 'lucide-react'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

const ACCEPTED = '.xlsx,.xls,.pdf,.doc,.docx,.ppt,.pptx'
const ACCEPTED_LABEL = 'PDF, Word, Excel, PowerPoint · máx. 25 MB'

const ROLE_COLORS = {
  guest:      '#06b6d4',
  admin:      '#8b5cf6',
  superadmin: '#3b82f6',
  user:       '#6366f1',
}

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)   return `Hace ${diff}s`
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)}min`
  return `Hace ${Math.floor(diff / 3600)}h`
}

export default function ChatAdmin() {
  const { user } = useAuth()
  const token = localStorage.getItem('token')

  const session = { token, userName: user?.username }
  const { stats, refetch } = useAdminStats(session)

  const sessions         = stats?.sessions        ?? []
  const activeSessions   = stats?.activeSessions  ?? null
  const loading          = stats === null

  // ── RAG upload state ────────────────────────────────────────────────────────
  const fileRef                   = useRef(null)
  const [file, setFile]           = useState(null)
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult]       = useState(null) // { ok, message }

  const pickFile = (f) => {
    if (!f) return
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${SOCKET_URL}/rag/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || `Error ${res.status}`)
      setResult({ ok: true, message: json.message || 'Base de conocimientos actualizada correctamente.' })
      setFile(null)
    } catch (err) {
      setResult({ ok: false, message: err.message || 'Error al subir el archivo.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Chat"
        title="Administración del Chatbot"
        subtitle="Gestiona la base de conocimientos del asistente IA y supervisa las sesiones activas."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>

        {/* ── Base de conocimientos ─────────────────────────────────────────── */}
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--blue-bg,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} style={{ color: 'var(--blue,#2563eb)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Base de conocimientos (RAG)</h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>Sube el documento que el asistente usará como fuente de respuestas.</p>
            </div>
          </div>

          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragging ? 'var(--blue,#2563eb)' : file ? 'var(--green,#16a34a)' : 'var(--line)'}`,
                borderRadius: 14,
                padding: '36px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? 'var(--blue-bg,#dbeafe)' : file ? '#f0fdf4' : 'var(--field,#fafafa)',
                transition: 'all 0.15s',
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED}
                style={{ display: 'none' }}
                onChange={e => pickFile(e.target.files?.[0])}
              />
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <FileText size={28} style={{ color: 'var(--green,#16a34a)', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setFile(null); setResult(null); if (fileRef.current) fileRef.current.value = '' }}
                    style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <UploadCloud size={36} style={{ color: 'var(--muted)', marginBottom: 10 }} />
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                    Arrastra el archivo aquí o haz clic para seleccionar
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>{ACCEPTED_LABEL}</p>
                </div>
              )}
            </div>

            {/* Result message */}
            {result && (
              <div style={{
                padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: result.ok ? '#f0fdf4' : 'var(--red-bg)',
                color: result.ok ? 'var(--green,#16a34a)' : 'var(--red)',
                border: `1px solid ${result.ok ? '#bbf7d0' : 'rgba(216,51,74,.2)'}`,
              }}>
                {result.ok ? '✓ ' : '✗ '}{result.message}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              {file && (
                <button
                  type="button"
                  className="cms-btn-ghost"
                  onClick={() => { setFile(null); setResult(null); if (fileRef.current) fileRef.current.value = '' }}
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="cms-btn-primary"
                style={{ minWidth: 160, opacity: !file || uploading ? 0.6 : 1, cursor: !file || uploading ? 'not-allowed' : 'pointer' }}
              >
                {uploading ? 'Procesando…' : 'Actualizar base de conocimientos'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Sesiones activas ──────────────────────────────────────────────── */}
        <div className="cms-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Sesiones en vivo</h3>
              {activeSessions !== null && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  {activeSessions} activas
                </span>
              )}
            </div>
            <button
              onClick={refetch}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>

          <table className="cms-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Última actividad</th>
                <th style={{ textAlign: 'right' }}>Mensajes</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', fontSize: 13 }}>
                    {loading ? 'Conectando…' : 'No hay sesiones registradas'}
                  </td>
                </tr>
              ) : sessions.slice(0, 15).map((s, i) => (
                <tr key={`${s.userId}-${i}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: '#eef0f4', color: '#5c5772',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 10, fontFamily: 'monospace',
                      }}>
                        {s.userId.slice(0, 2).toUpperCase()}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--ink)' }}>{s.userId}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 999,
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em',
                      background: `${ROLE_COLORS[s.rol] ?? '#8e9299'}18`,
                      color: ROLE_COLORS[s.rol] ?? '#8e9299',
                    }}>
                      {s.rol}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                      background: s.isActive ? '#f0fdf4' : '#f4f5f9',
                      color: s.isActive ? '#16a34a' : '#9ca3af',
                      border: s.isActive ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.isActive ? '#16a34a' : '#9ca3af', display: 'inline-block' }} />
                      {s.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>{timeAgo(s.lastActivityAt)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>
                    {s.historyLength}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  )
}
