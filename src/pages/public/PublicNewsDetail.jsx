import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicNewsDetail } from '../../api/public'
import PublicLayout from './PublicLayout'

export default function PublicNewsDetail() {
  const { countrySlug, newsSlug } = useParams()
  const [item, setItem]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    setLoading(true)
    getPublicNewsDetail(countrySlug, newsSlug)
      .then(r => setItem(r.data?.data || r.data))
      .catch(() => setError('No se pudo cargar esta noticia.'))
      .finally(() => setLoading(false))
  }, [countrySlug, newsSlug])

  return (
    <PublicLayout>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px 80px' }}>
        <Link
          to={`/${countrySlug}/noticias`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--muted)', fontWeight: 600, fontSize: 13,
            textDecoration: 'none', marginBottom: 32,
            transition: 'color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver a noticias
        </Link>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)', fontSize: 14 }}>
            Cargando…
          </div>
        )}

        {error && (
          <div style={{ background: 'var(--red-bg)', color: 'var(--red)', borderRadius: 10, padding: '14px 18px', fontSize: 14 }}>
            {error}
          </div>
        )}

        {item && (
          <article>
            {item.imagen_principal_url && (
              <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 36, boxShadow: '0 8px 30px -10px rgba(20,10,40,0.2)' }}>
                <img src={item.imagen_principal_url} alt={item.titulo} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
              {item.paises?.nombre && (
                <span style={{
                  background: 'var(--line-2)', color: 'var(--muted)',
                  borderRadius: 999, padding: '4px 12px',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {item.paises.nombre}
                </span>
              )}
              {item.fecha_publicacion && (
                <time style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
                  {new Date(item.fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.25, marginBottom: 18 }}>
              {item.titulo}
            </h1>

            {item.resumen && (
              <p style={{
                fontSize: 17, color: 'var(--muted)', lineHeight: 1.7,
                borderLeft: '4px solid var(--pink)', paddingLeft: 18,
                marginBottom: 32, fontStyle: 'italic',
              }}>
                {item.resumen}
              </p>
            )}

            <div style={{
              fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}>
              {item.contenido}
            </div>

            {item.usuarios && (
              <div style={{
                marginTop: 48, paddingTop: 24,
                borderTop: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--grad)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 16,
                }}>
                  {item.usuarios.nombre?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
                    {item.usuarios.nombre} {item.usuarios.apellido}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Autor</div>
                </div>
              </div>
            )}
          </article>
        )}
      </div>
    </PublicLayout>
  )
}