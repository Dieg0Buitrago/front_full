import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavItem({ to, icon, label, count }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `cms-nav-item${isActive ? ' active' : ''}`}
    >
      <span style={{ flexShrink: 0, color: 'inherit' }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
      {count !== undefined && <span className="cms-nav-count">{count}</span>}
    </NavLink>
  )
}

const NavLabel = ({ children }) => (
  <div style={{
    color: '#6B6680', fontSize: 10, fontWeight: 700,
    letterSpacing: '.14em', textTransform: 'uppercase',
    padding: '14px 12px 8px',
  }}>
    {children}
  </div>
)

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/>
    <rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>
  </svg>
)
const IconNews = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h12l4 4v12H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>
  </svg>
)
const IconChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)
const IconInbox = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v4H4z"/><path d="M6 8v12h12V8"/><path d="M9 13h6"/>
  </svg>
)
const IconFolder = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
  </svg>
)
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
  </svg>
)
const IconClipboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="2"/>
  </svg>
)
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 3v4M8 11V9a4 4 0 018 0v2"/>
    <circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/>
  </svg>
)

export default function Sidebar() {
  const { user, logout, isSuperAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = [user?.nombre, user?.apellido]
    .filter(Boolean)
    .map(s => s[0])
    .join('')
    .toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'var(--ink)',
      color: '#CCC8DC',
      padding: '22px 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      borderRight: '1px solid #100E1A',
      flexShrink: 0,
    }}>

      {/* Brand row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 18px' }}>
        <span style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: `
            radial-gradient(circle at 30% 30%, #E63B6F 0 22%, transparent 23%),
            radial-gradient(circle at 70% 30%, #F47C3C 0 22%, transparent 23%),
            radial-gradient(circle at 30% 70%, #7B2D8B 0 22%, transparent 23%),
            radial-gradient(circle at 70% 70%, #2EAEE0 0 22%, transparent 23%),
            #2A2540`,
          boxShadow: '0 4px 14px rgba(230,59,111,.25), inset 0 0 0 1px rgba(255,255,255,.05)',
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '-.01em' }}>Comparte CMS</span>
          <span style={{ color: '#8B86A0', fontWeight: 600, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 2 }}>Red LATAM</span>
        </div>
      </div>

      {/* Nav: Principal */}
      <NavLabel>Principal</NavLabel>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NavItem to="/dashboard" icon={<IconDashboard />} label="Dashboard" />
        <NavItem to="/news"         icon={<IconNews />}      label="Noticias" />
        <NavItem to="/testimonials" icon={<IconChat />}      label="Testimonios" />
        <NavItem to="/contacts"     icon={<IconInbox />}     label="Contactos" />
        <NavItem to="/files"        icon={<IconFolder />}    label="Archivos" />
      </nav>

      {/* Nav: Comunidad (superadmin only) */}
      {isSuperAdmin && (
        <>
          <NavLabel>Comunidad</NavLabel>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <NavItem to="/users"     icon={<IconUsers />}     label="Usuarios" />
            <NavItem to="/countries" icon={<IconGlobe />}     label="Países" />
            <NavItem to="/audit"     icon={<IconClipboard />} label="Auditoría" />
          </nav>
        </>
      )}

      {/* Nav: Chat (superadmin only) */}
      {isSuperAdmin && (
        <>
          <NavLabel>Chat</NavLabel>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <NavItem to="/chat/admin" icon={<IconBot />} label="Administración" />
          </nav>
        </>
      )}

      {/* Nav: Cuenta */}
      <NavLabel>Cuenta</NavLabel>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NavItem to="/profile" icon={<IconUser />} label="Mi perfil" />
      </nav>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* User row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 8px 4px',
          borderTop: '1px solid rgba(255,255,255,.06)',
          marginTop: 6,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '999px', flexShrink: 0,
            background: 'linear-gradient(135deg, #F47C3C, #E63B6F)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 12,
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.15)',
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : user?.username}
            </div>
            <div style={{ color: '#8B86A0', fontSize: 11, textTransform: 'capitalize', marginTop: 1 }}>
              {user?.rol}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              background: 'transparent', border: 0,
              color: '#8B86A0', cursor: 'pointer',
              padding: 6, borderRadius: 8,
              display: 'inline-flex', alignItems: 'center',
              transition: 'background .12s, color .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#252036'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8B86A0' }}
          >
            <IconLogout />
          </button>
        </div>
      </div>
    </aside>
  )
}
