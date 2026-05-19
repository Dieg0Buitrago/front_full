import { Link, useParams, useNavigate } from 'react-router-dom'

export default function PublicLayout({ children }) {
  const { countrySlug } = useParams()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFC', fontFamily: 'inherit' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link
          to="/"
          style={{ fontWeight: 800, fontSize: 17, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.3px' }}
        >
          Latinoamérica <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Comparte</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {countrySlug && (
            <>
              <NavLink to={`/${countrySlug}/noticias`}>Noticias</NavLink>
              <NavLink to={`/${countrySlug}/testimonios`}>Testimonios</NavLink>
              <NavLink to={`/${countrySlug}/solicitudes`}>Solicitudes</NavLink>
            </>
          )}
          <button
            onClick={() => navigate('/login')}
            style={{
              marginLeft: 12,
              background: 'var(--grad)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '0 18px',
              height: 38,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 8px 18px -8px rgba(230,59,111,.5)',
            }}
          >
            CMS Login
          </button>
        </nav>
      </header>

      <main>{children}</main>

      <footer style={{
        background: 'var(--ink)',
        color: '#9B96B0',
        textAlign: 'center',
        padding: '28px 32px',
        fontSize: 13,
      }}>
        © {new Date().getFullYear()} Latinoamérica Comparte · Todos los derechos reservados
      </footer>
    </div>
  )
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        color: 'var(--muted)',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: 14,
        transition: 'color .15s, background .15s',
      }}
      onMouseEnter={e => { e.target.style.color = 'var(--ink)'; e.target.style.background = 'var(--line-2)' }}
      onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.background = 'transparent' }}
    >
      {children}
    </Link>
  )
}