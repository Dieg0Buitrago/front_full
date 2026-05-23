import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicNews } from '../../api/public'
import { useCountryTheme } from '../../contexts/CountryContext'
import PublicLayout from './PublicLayout'

function NewsCard({ item, countrySlug, accent }) {
  const [hov, setHov] = useState(false)
  return (
    <Link to={`/${countrySlug}/noticias/${item.slug}`} style={{ textDecoration: 'none' }}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: '#fff',
          borderRadius: 18,
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease',
          transform: hov ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hov
            ? `0 24px 50px -12px rgba(0,0,0,0.18), 0 0 0 2px ${accent}30`
            : '0 2px 12px rgba(0,0,0,0.07)',
          border: `1px solid ${hov ? accent + '30' : 'rgba(0,0,0,0.07)'}`,
        }}
      >
        {item.imagen_principal_url ? (
          <div style={{ height: 200, overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={item.imagen_principal_url}
              alt={item.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hov ? 'scale(1.05)' : 'scale(1)' }}
            />
          </div>
        ) : (
          <div style={{ height: 200, flexShrink: 0, background: `linear-gradient(135deg, ${accent}33 0%, ${accent}66 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
        )}

        {/* top accent bar on hover */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}88)`, opacity: hov ? 1 : 0, transition: 'opacity 0.2s', flexShrink: 0 }} />

        <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {item.fecha_publicacion && (
            <time style={{ fontSize: 11.5, color: accent, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {new Date(item.fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
          <h3 style={{ fontSize: 16.5, fontWeight: 700, color: '#111', lineHeight: 1.38, marginBottom: 10, flex: 1 }}>
            {item.titulo}
          </h3>
          {item.resumen && (
            <p style={{ fontSize: 13.5, color: '#666', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 16 }}>
              {item.resumen}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: accent, fontWeight: 700, fontSize: 13 }}>
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
  const country  = useCountryTheme()
  const accent   = country?.accent ?? '#E8305A'
  const c1       = country?.c1 ?? '#E8305A'
  const c2       = country?.c2 ?? '#F47B3E'
  const c3       = country?.c3 ?? '#3AB8D4'

  const [news, setNews]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    setLoading(true); setError(null)
    getPublicNews(countrySlug)
      .then(r => setNews(r.data?.data || r.data || []))
      .catch(() => setError('No se pudieron cargar las noticias.'))
      .finally(() => setLoading(false))
  }, [countrySlug])

  const filtered = news.filter(n =>
    !search ||
    n.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    n.resumen?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PublicLayout>
      {/* ══ HERO ══ */}
      <section style={{
        background: country?.heroBg ?? 'linear-gradient(135deg,#7B2D8B,#E63B6F)',
        padding: '72px 40px 60px',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: `1px solid ${accent}30`, top: -100, right: -80, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: `1px solid ${c2}25`, bottom: -60, left: 80, pointerEvents: 'none' }} />

        {country?.logo && (
          <img src={country.logo} alt={country.tagline} style={{ height: 80, width: 80, objectFit: 'contain', marginBottom: 20, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4)) brightness(0) invert(1)', opacity: 0.9 }} />
        )}

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '5px 16px', marginBottom: 18 }}>
          <span style={{ fontSize: 14 }}>{country?.flag}</span>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Noticias</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>
          {country ? `${country.name} Comparte` : countrySlug}
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', maxWidth: 480, margin: '0 auto' }}>
          Novedades, historias e iniciativas que impulsan a nuestra comunidad.
        </p>

        {/* color bar at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${c1},${c2},${c3})` }} />
      </section>

      {/* ══ CONTENT ══ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Search bar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Buscar por título o resumen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: 38, paddingRight: 14, height: 42, border: `1.5px solid ${search ? accent : '#e5e5e5'}`, borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ background: `linear-gradient(135deg,${c1},${c2})`, color: '#fff', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 15, textAlign: 'center', flexShrink: 0, boxShadow: `0 8px 20px ${accent}40` }}>
            {filtered.length} <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.85 }}>resultado{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fff5f5', color: '#cc0000', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 14, fontWeight: 500, border: '1px solid #ffd5d5' }}>
            {error}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: '#888', fontSize: 15 }}>No hay noticias publicadas{search ? ' para esa búsqueda' : ' para este país'}.</p>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#f0f0f0', borderRadius: 18, height: 340, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {filtered.map(item => (
              <NewsCard key={item.id} item={item} countrySlug={countrySlug} accent={accent} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
