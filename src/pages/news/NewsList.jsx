import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNews, updateNewsStatus, deleteNews } from '../../api/news'
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

export default function NewsList() {
  const { isAdmin } = useAuth()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)

  const load = () =>
    getNews()
      .then((r) => setNews(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleStatus = async (item) => {
    const next = item.estado === 'publicado' ? 'borrador' : 'publicado'
    await updateNewsStatus(item.id, { estado: next })
    load()
  }

  const handleDelete = async () => {
    await deleteNews(confirm)
    setConfirm(null)
    load()
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Contenido"
        title="Noticias"
        count={news.length}
        subtitle="Gestiona los artículos publicados en los sitios Comparte."
        action={
          <Link to="/news/new" className="cms-btn-primary">
            <PlusIcon /> Nueva noticia
          </Link>
        }
      />

      {loading ? (
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</div>
      ) : (
        <div className="cms-table-card" style={{ borderLeftColor: 'var(--pink)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-2)', background: '#FCFBFD', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{news.length}</strong> artículos
            </span>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>País</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {news.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
                    Sin noticias registradas
                  </td>
                </tr>
              ) : news.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 }}>{item.titulo}</div>
                    {item.slug && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{item.slug}</div>}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{item.paises?.nombre || '—'}</td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Link to={`/news/${item.id}/edit`} style={{ color: 'var(--pink)', fontWeight: 600, fontSize: 12.5, textDecoration: 'none' }}>
                        Editar
                      </Link>
                      <button onClick={() => handleStatus(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--yellow)', fontWeight: 600, fontSize: 12.5 }}>
                        {item.estado === 'publicado' ? 'Despublicar' : 'Publicar'}
                      </button>
                      {isAdmin && (
                        <button onClick={() => setConfirm(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 600, fontSize: 12.5 }}>
                          Eliminar
                        </button>
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
          message="¿Seguro que quieres eliminar esta noticia? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  )
}
