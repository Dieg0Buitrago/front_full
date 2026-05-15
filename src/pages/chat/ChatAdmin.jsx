import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import Administration from '../../chat/components/Administration'
import { useAdminStats } from '../../chat/hooks/useAdminStats'
import { LayoutDashboard, Cpu, GitBranch, Sun, Moon } from 'lucide-react'

const VIEWS = [
  { id: 'dashboard',      label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'ai-config',      label: 'Config IA',    Icon: Cpu },
  { id: 'chatbot-flows',  label: 'Flujos',       Icon: GitBranch },
]

export default function ChatAdmin() {
  const { user } = useAuth()
  const [view, setView] = useState('dashboard')
  const [isDark, setIsDark] = useState(true)

  const session = {
    token: localStorage.getItem('token') || undefined,
    userName: user?.username,
  }
  const { stats, refetch } = useAdminStats(session)

  return (
    <Layout>
      <PageHeader
        eyebrow="Chat"
        title="Administración del Chat"
        subtitle="Estadísticas, configuración y flujos del asistente IA."
      />

      {/* Sub-navegación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {VIEWS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
              fontWeight: 600, fontSize: 13, transition: 'all .15s',
              background: view === id ? 'linear-gradient(90deg, #E63B6F, #F47C3C)' : '#fff',
              color: view === id ? '#fff' : '#6B6680',
              border: view === id ? 'none' : '1px solid #E6E7EE',
              boxShadow: view === id ? '0 6px 16px -6px rgba(230,59,111,.5)' : 'none',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}

        <button
          onClick={() => setIsDark(d => !d)}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            border: '1px solid #E6E7EE', background: '#fff',
            color: '#6B6680', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>
      </div>

      {/* Panel de administración */}
      <div style={{
        borderRadius: 16, overflow: 'hidden', minHeight: 600,
        background: isDark ? '#0a0a0c' : '#f4f5f9',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E6E7EE',
      }}>
        <Administration
          view={view}
          isDark={isDark}
          stats={stats}
          onRefresh={refetch}
        />
      </div>
    </Layout>
  )
}