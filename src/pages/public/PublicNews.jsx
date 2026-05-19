import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicNews } from '../../api/public'
import PublicLayout from './PublicLayout'

function NewsCard({ item, countrySlug }) {
  return (
    <Link
      to={`/${countrySlug}/noticias/${item.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <article style={{
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'transform .2s, box-shadow .2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px -12px rgba(20,10,40,0.18)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {item.imagen_principal_url ? (
          <div style={{ height: 200, overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={item.imagen_principal_url}
              alt={item.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div style={{
            height: 200, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--pink) 0%, var(--orange) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
        )}

        <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {item.fecha_publicacion && (
            <time style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>
              {new Date(item.fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 10, flex: 1 }}>
            {item.titulo}
          </h3>
          {item.resumen && (
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.resumen}
            </p>
          )}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--pink)', fontWeight: 700, fontSize: 13 }}>
            Leer más
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function PublicNews() {
  const { countrySlug } = useParams()
  const [news, setNews]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    getPublicNews(countrySlug)
      .then(r => setNews(r.data?.data || r.data || []))
      .catch(() => setError('Error al cargar noticias públicas'))
      .finally(() => setLoading(false))
  }, [countrySlug])

  const countryName = countrySlug ? countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1) : ''

  const filtered = news.filter(n =>
    !search ||
    n.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    n.resumen?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PublicLayout>
      {/* Page hero */}
      <section style={{
        background: 'linear-gradient(135deg, #7B2D8B 0%, #E63B6F 100%)',
        padding: '60px 40px 48px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.18)',
          borderRadius: 999, padding: '5px 16px',
          fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
          textTransform: 'uppercase', marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.25)',
        }}>
          Noticias Públicas
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 12 }}>
          Noticias de {countryName}
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', maxWidth: 480, margin: '0 auto' }}>
          Consulta novedades, historias y actualizaciones publicadas para este país.
        </p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Search + count */}
        <div style={{
          background: '#fff', border: '1px solid var(--line)',
          borderRadius: 14, padding: '20px 24px',
          display: 'flex', gap: 16, alignItems: 'center',
          marginBottom: 32, flexWrap: 'wrap',
          boxShadow: '0 4px 14px -8px rgba(20,10,40,0.1)',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>
              Buscar noticia
            </label>
            <input
              className="cms-input"
              placeholder="Buscar por título o resumen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{
            background: 'var(--grad)',
            color: '#fff',
            borderRadius: 10,
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: 15,
            textAlign: 'center',
            flexShrink: 0,
            boxShadow: '0 8px 18px -8px rgba(230,59,111,.5)',
          }}>
            {filtered.length}<br />
            <span style={{ fontSize: 11, fontWeight: 600, opacity: .85 }}>resultado(s)</span>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--red-bg)', color: 'var(--red)', borderRadius: 10, padding: '12px 18px', marginBottom: 12, fontSize: 14, fontWeight: 500 }}>
            {error}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ background: 'var(--yellow-bg)', color: 'var(--yellow)', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 500 }}>
            No hay noticias publicadas para este país.
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontSize: 14 }}>
            Cargando noticias…
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {filtered.map(item => (
              <NewsCard key={item.id} item={item} countrySlug={countrySlug} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}