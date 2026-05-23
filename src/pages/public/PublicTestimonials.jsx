import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicTestimonials } from '../../api/public'
import { useCountryTheme } from '../../contexts/CountryContext'
import PublicLayout from './PublicLayout'

function TestimonialCard({ item, accent, c1, c2 }) {
  const [hov, setHov] = useState(false)
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: '28px 26px',
        display: 'flex', flexDirection: 'column', gap: 16,
        transition: 'transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov
          ? `0 24px 50px -12px rgba(0,0,0,0.14), 0 0 0 2px ${accent}30`
          : '0 2px 12px rgba(0,0,0,0.07)',
        border: `1px solid ${hov ? accent + '30' : 'rgba(0,0,0,0.07)'}`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* accent bar top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${c1},${c2})`, opacity: hov ? 1 : 0.4, transition: 'opacity 0.2s' }} />

      {/* Quote mark */}
      <div style={{ fontSize: 52, lineHeight: 1, color: accent, fontFamily: 'Georgia, serif', opacity: 0.35, marginBottom: -10, userSelect: 'none' }}>"</div>

      <p style={{ fontSize: 14.5, color: '#333', lineHeight: 1.78, flex: 1, fontStyle: 'italic' }}>
        {item.contenido}
      </p>

      {item.destacado && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${accent}15`, border: `1px solid ${accent}30`, borderRadius: 999, padding: '3px 12px', alignSelf: 'flex-start' }}>
          <span style={{ fontSize: 11 }}>⭐</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Destacado</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        {item.foto_url ? (
          <img src={item.foto_url} alt={item.nombre} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${accent}40` }} />
        ) : (
          <div style={{ width: 50, height: 50, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20 }}>
            {item.nombre?.[0]?.toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{item.nombre}</div>
          {(item.cargo || item.empresa) && (
            <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>
              {[item.cargo, item.empresa].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {item.instagram_url && (
            <a href={item.instagram_url} target="_blank" rel="noopener noreferrer"
              style={{ color: '#ccc', display: 'flex', alignItems: 'center', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = accent}
              onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </a>
          )}
          {item.facebook_url && (
            <a href={item.facebook_url} target="_blank" rel="noopener noreferrer"
              style={{ color: '#ccc', display: 'flex', alignItems: 'center', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1877F2'}
              onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
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
  const country  = useCountryTheme()
  const accent   = country?.accent ?? '#E8305A'
  const c1       = country?.c1 ?? '#E8305A'
  const c2       = country?.c2 ?? '#F47B3E'
  const c3       = country?.c3 ?? '#3AB8D4'

  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [search, setSearch]             = useState('')
  const [onlyFeatured, setOnlyFeatured] = useState(false)

  useEffect(() => {
    setLoading(true); setError(null)
    getPublicTestimonials(countrySlug)
      .then(r => setTestimonials(r.data?.data || r.data || []))
      .catch(() => setError('No se pudieron cargar los testimonios.'))
      .finally(() => setLoading(false))
  }, [countrySlug])

  const filtered = testimonials.filter(t => {
    if (onlyFeatured && !t.destacado) return false
    if (!search) return true
    const q = search.toLowerCase()
    return t.nombre?.toLowerCase().includes(q) || t.empresa?.toLowerCase().includes(q) || t.cargo?.toLowerCase().includes(q) || t.contenido?.toLowerCase().includes(q)
  })

  return (
    <PublicLayout>
      {/* ══ HERO ══ */}
      <section style={{
        background: country?.heroBg ?? 'linear-gradient(135deg,#2EAEE0,#7B2D8B)',
        padding: '72px 40px 60px',
        textAlign: 'center', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: `1px solid ${accent}30`, top: -100, right: -80, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: `1px solid ${c2}25`, bottom: -60, left: 80, pointerEvents: 'none' }} />

        {country?.logo && (
          <img src={country.logo} alt={country.tagline} style={{ height: 80, width: 80, objectFit: 'contain', marginBottom: 20, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        )}

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '5px 16px', marginBottom: 18 }}>
          <span style={{ fontSize: 14 }}>{country?.flag}</span>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Testimonios</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>
          Historias que inspiran
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', maxWidth: 480, margin: '0 auto' }}>
          Experiencias reales de personas y comunidades que forman parte de {country?.name ?? countrySlug} Comparte.
        </p>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${c1},${c2},${c3})` }} />
      </section>

      {/* ══ CONTENT ══ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 36, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                placeholder="Buscar por nombre, empresa o contenido..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: 38, paddingRight: 14, height: 42, border: `1.5px solid ${search ? accent : '#e5e5e5'}`, borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            {/* Toggle destacados */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0, paddingBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: onlyFeatured ? accent : '#888' }}>Solo destacados</span>
              <div
                onClick={() => setOnlyFeatured(v => !v)}
                style={{ width: 44, height: 24, borderRadius: 999, background: onlyFeatured ? accent : '#ddd', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
              >
                <div style={{ position: 'absolute', top: 3, left: onlyFeatured ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
              </div>
            </label>

            <div style={{ background: `linear-gradient(135deg,${c1},${c2})`, color: '#fff', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 15, textAlign: 'center', flexShrink: 0, boxShadow: `0 8px 20px ${accent}40` }}>
              {filtered.length} <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.85 }}>resultado{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fff5f5', color: '#cc0000', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 14, fontWeight: 500 }}>{error}</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <p style={{ color: '#888', fontSize: 15 }}>No hay testimonios publicados{search ? ' para esa búsqueda' : ' para este país'}.</p>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#f0f0f0', borderRadius: 20, height: 280 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
            {filtered.map(item => (
              <TestimonialCard key={item.id} item={item} accent={accent} c1={c1} c2={c2} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
