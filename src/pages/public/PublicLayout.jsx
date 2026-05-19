import { useState } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { getCountry } from '../../config/countries'

export default function PublicLayout({ children }) {
  const { countrySlug } = useParams()
  const navigate  = useNavigate()
  const location  = useLocation()
  const country   = getCountry(countrySlug)
  const accent    = country?.accent ?? '#E8305A'
  const navBg     = country?.navBg  ?? 'rgba(8,4,18,0.92)'

  const [loginHov, setLoginHov] = useState(false)

  const navLinks = countrySlug ? [
    { label: 'Noticias',     to: `/${countrySlug}/noticias`    },
    { label: 'Testimonios',  to: `/${countrySlug}/testimonios` },
    { label: 'Solicitudes',  to: `/${countrySlug}/solicitudes` },
  ] : []

  return (
    <div style={{ minHeight: '100vh', background: country?.sectionBg ?? '#FAFAFC', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ══ HEADER ══ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: navBg,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${accent}30`,
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        {/* Logo + country name */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          {country?.logo && (
            <img src={country.logo} alt={country.tagline} style={{ height: 36, width: 36, objectFit: 'contain' }} />
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.2px' }}>
              {country ? country.name : 'Latinoamérica'}{' '}
              <span style={{ color: accent }}>Comparte</span>
            </div>
            {country && (
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {country.flag} Sitio público
              </div>
            )}
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map(lnk => {
            const active = location.pathname === lnk.to
            return (
              <NavLink key={lnk.to} to={lnk.to} accent={accent} active={active}>
                {lnk.label}
              </NavLink>
            )
          })}
          <button
            onMouseEnter={() => setLoginHov(true)}
            onMouseLeave={() => setLoginHov(false)}
            onClick={() => navigate('/login')}
            style={{
              marginLeft: 12,
              background: loginHov ? accent : `${accent}22`,
              color: loginHov ? '#111' : accent,
              border: `1px solid ${accent}55`,
              borderRadius: 10, padding: '0 18px', height: 36,
              fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            CMS Login
          </button>
        </nav>
      </header>

      <main>{children}</main>

      {/* ══ FOOTER ══ */}
      <footer style={{
        background: '#06050c',
        borderTop: `1px solid ${accent}25`,
        padding: '40px 40px 32px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {country?.logo && (
                <img src={country.logo} alt={country.tagline} style={{ height: 48, width: 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
              )}
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.2px' }}>
                  {country ? country.name : 'Latinoamérica'} <span style={{ color: accent }}>Comparte</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>
                  Red de propósito compartido
                </div>
              </div>
            </div>

            {/* Nav links */}
            {navLinks.length > 0 && (
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                {navLinks.map(lnk => (
                  <Link key={lnk.to} to={lnk.to}
                    style={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = accent}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                  >
                    {lnk.label}
                  </Link>
                ))}
                <Link to="/"
                  style={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                >
                  ← Inicio
                </Link>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>
              © {new Date().getFullYear()} Latinoamérica Comparte · Todos los derechos reservados
            </span>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = accent}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
            >
              Ver todos los países
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, accent, active, children }) {
  const [hov, setHov] = useState(false)

  let color = 'rgba(255,255,255,0.55)'
  if (active) color = accent
  else if (hov) color = '#fff'

  let bg = 'transparent'
  if (active) bg = `${accent}18`
  else if (hov) bg = 'rgba(255,255,255,0.07)'

  return (
    <Link to={to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '6px 14px', borderRadius: 8,
        color, background: bg,
        textDecoration: 'none', fontWeight: 600, fontSize: 13.5,
        borderBottom: active ? `2px solid ${accent}` : '2px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </Link>
  )
}
