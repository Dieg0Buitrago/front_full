import Sidebar from './Sidebar'
import ChatWidget from '../chat/components/ChatWidget'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B86A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header className="cms-topbar">
          <div style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500 }}>
            <span>Comparte</span>
            <span style={{ margin: '0 6px', color: 'var(--line)' }}>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>CMS</span>
          </div>

          {/* Search */}
          <div style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: 10,
            width: 320, height: 38,
            border: '1px solid var(--line)', borderRadius: 10,
            padding: '0 12px',
            background: 'var(--bg)',
          }}>
            <SearchIcon />
            <input
              placeholder="Buscar…"
              style={{
                border: 0, outline: 0, background: 'transparent',
                flex: 1, fontSize: 13, color: 'var(--ink)',
              }}
            />
            <span style={{
              fontSize: 10.5, fontWeight: 700, color: '#8B86A0',
              padding: '2px 6px', borderRadius: 5,
              background: '#fff', border: '1px solid var(--line)',
            }}>⌘K</span>
          </div>

          <button className="cms-ic-btn" aria-label="Notificaciones" style={{ position: 'relative' }}>
            <BellIcon />
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 32px 56px', overflow: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Chat widget flotante */}
      <ChatWidget />
    </div>
  )
}
