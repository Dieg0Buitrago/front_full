import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicTestimonials } from '../../api/public'
import PublicLayout from './PublicLayout'

function TestimonialCard({ item }) {
  return (
    <article style={{
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 16,
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      transition: 'transform .2s, box-shadow .2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px -12px rgba(20,10,40,0.15)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Quote mark */}
      <div style={{ fontSize: 48, lineHeight: 1, color: 'var(--pink)', fontFamily: 'Georgia, serif', opacity: .4, marginBottom: -8 }}>
        "
      </div>

      <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.75, flex: 1, fontStyle: 'italic' }}>
        {item.contenido}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: '1px solid var(--line-2)' }}>
        {item.foto_url ? (
          <img
            src={item.foto_url}
            alt={item.nombre}
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--line)' }}
          />
        ) : (
          <div style={{
            width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--purple), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 20,
          }}>
            {item.nombre?.[0]?.toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {item.nombre}
            {item.destacado && (
              <span style={{ fontSize: 10, background: 'var(--yellow-bg)', color: 'var(--yellow)', borderRadius: 999, padding: '2px 8px', fontWeight: 700 }}>
                Destacado
              </span>
            )}
          </div>
          {(item.cargo || item.empresa) && (
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
              {[item.cargo, item.empresa].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>

        {/* Social links */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {item.instagram_url && (
            <a href={item.instagram_url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--pink)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </a>
          )}
          {item.facebook_url && (
            <a href={item.facebook_url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1877F2'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function PublicTestimonials() {
  const { countrySlug } = useParams()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [search, setSearch]             = useState('')
  const [onlyFeatured, setOnlyFeatured] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getPublicTestimonials(countrySlug)
      .then(r => setTestimonials(r.data?.data || r.data || []))
      .catch(() => setError('Error al cargar testimonios públicos'))
      .finally(() => setLoading(false))
  }, [countrySlug])

  const countryName = countrySlug ? countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1) : ''

  const filtered = testimonials.filter(t => {
    if (onlyFeatured && !t.destacado) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      t.nombre?.toLowerCase().includes(q) ||
      t.empresa?.toLowerCase().includes(q) ||
      t.cargo?.toLowerCase().includes(q) ||
      t.contenido?.toLowerCase().includes(q)
    )
  })

  return (
    <PublicLayout>
      {/* Page hero */}
      <section style={{
        background: 'linear-gradient(135deg, #2EAEE0 0%, #7B2D8B 100%)',
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
          Historias que Inspiran
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 12 }}>
          Testimonios de {countryName}
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', maxWidth: 520, margin: '0 auto' }}>
          Conoce experiencias reales de personas, empresas y comunidades que hacen parte de esta red.
        </p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Search + filters */}
        <div style={{
          background: '#fff', border: '1px solid var(--line)',
          borderRadius: 14, padding: '20px 24px',
          marginBottom: 32,
          boxShadow: '0 4px 14px -8px rgba(20,10,40,0.1)',
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>
                Buscar testimonio
              </label>
              <input
                className="cms-input"
                placeholder="Buscar por nombre, empresa, cargo o contenido..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13, color: 'var(--purple)', flexShrink: 0, paddingBottom: 2 }}>
              Solo destacados
              <div
                onClick={() => setOnlyFeatured(v => !v)}
                style={{
                  width: 44, height: 24, borderRadius: 999,
                  background: onlyFeatured ? 'var(--purple)' : 'var(--line)',
                  position: 'relative', cursor: 'pointer',
                  transition: 'background .2s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 3, left: onlyFeatured ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  transition: 'left .2s',
                }} />
              </div>
            </label>
          </div>

          <div style={{
            marginTop: 16,
            background: 'linear-gradient(90deg, var(--purple), var(--pink))',
            color: '#fff',
            borderRadius: 10,
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: 15,
            textAlign: 'center',
            boxShadow: '0 8px 18px -8px rgba(123,45,139,.4)',
          }}>
            {filtered.length} &nbsp;
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
            No hay testimonios publicados para este país.
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontSize: 14 }}>
            Cargando testimonios…
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {filtered.map(item => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}