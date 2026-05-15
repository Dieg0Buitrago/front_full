import { useEffect, useState } from 'react'
import { getDashboardStats } from '../../api/dashboard'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'

const kpiConfigs = [
  { key: 'noticias_publicadas',    label: 'Noticias',    variant: 'kpi-pink',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h12l4 4v12H4z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg> },
  { key: 'testimonios_publicados', label: 'Testimonios', variant: 'kpi-orange', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
  { key: 'solicitudes_pendientes', label: 'Contactos',   variant: 'kpi-purple', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v4H4z"/><path d="M6 8v12h12V8"/><path d="M9 13h6"/></svg> },
  { key: 'archivos_total',         label: 'Archivos',    variant: 'kpi-cyan',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> },
  { key: 'usuarios_activos',       label: 'Usuarios',    variant: 'kpi-green',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { key: 'paises_activos',         label: 'Países',      variant: 'kpi-violet', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg> },
]

function KpiCard({ label, value, icon, variant }) {
  return (
    <div className={`cms-card ${variant}`} style={{
      padding: '18px 18px 16px',
      borderLeft: '4px solid var(--kpi-c, var(--pink))',
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: '0 1px 0 rgba(20,10,40,.02), 0 8px 20px -16px rgba(20,10,40,.18)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--kpi-bg, #FBE5EC)',
          color: 'var(--kpi-c, var(--pink))',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.01em' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const displayName = user?.nombre || user?.username || 'Administrador'

  return (
    <Layout>
      {/* Greeting hero */}
      <div style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 18,
        padding: '24px 28px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -30, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(230,59,111,.18), transparent 70%), radial-gradient(closest-side at 60% 60%, rgba(244,124,60,.14), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div className="cms-eyebrow">Panel de control</div>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, lineHeight: 1.2, letterSpacing: '-.02em', fontWeight: 800, color: 'var(--ink)' }}>
            Bienvenido,{' '}
            <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              {displayName}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 10, padding: '3px 10px', borderRadius: 999, background: '#F1EBFB', color: 'var(--purple)', fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', verticalAlign: '4px', textTransform: 'capitalize' }}>
              {user?.rol}
            </span>
          </h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>Resumen general de tu plataforma Comparte.</p>
        </div>
      </div>

      {/* KPI grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, height: 130, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {kpiConfigs
            .filter(c => stats[c.key] !== undefined)
            .map(c => (
              <KpiCard key={c.key} label={c.label} value={stats[c.key]} icon={c.icon} variant={c.variant} />
            ))}
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>
          No se pudieron cargar las estadísticas.
        </div>
      )}
    </Layout>
  )
}
