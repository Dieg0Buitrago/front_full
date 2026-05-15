import {
  Users, MessageSquare, Activity, TrendingUp,
  Filter, Download, ShieldCheck, Sparkles, RefreshCw,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip,
  Cell, PieChart, Pie,
} from 'recharts'
import { cn } from '../lib/utils'

const DATA_ACTIVITY = [
  { time: '00:00', value: 4 }, { time: '04:00', value: 2 },
  { time: '08:00', value: 9 }, { time: '12:00', value: 15 },
  { time: '16:00', value: 18 }, { time: '20:00', value: 11 },
  { time: '23:59', value: 6 },
]

const ROLE_COLORS = {
  guest:      '#06b6d4',
  admin:      '#8b5cf6',
  superadmin: '#3b82f6',
  user:       '#6366f1',
}

export default function Administration({ view, isDark = true, stats = null, onRefresh }) {
  const content = () => {
    switch (view) {
      case 'ai-config':     return <AIConfigUI isDark={isDark} />
      case 'chatbot-flows': return <FlowsUI isDark={isDark} />
      default:              return <DashboardUI isDark={isDark} stats={stats} onRefresh={onRefresh} />
    }
  }

  return (
    <div className={cn(
      'p-6 space-y-8 overflow-y-auto h-full scrollbar-hide transition-colors duration-500',
      isDark ? 'bg-transparent text-neutral-100' : 'bg-neutral-50 text-neutral-900',
    )}>
      {content()}
    </div>
  )
}

function DashboardUI({ isDark, stats, onRefresh }) {
  const sessions           = stats?.sessions           ?? []
  const activeSessions     = stats?.activeSessions     ?? null
  const totalConversations = stats?.totalConversations ?? null
  const totalMessages      = stats?.totalMessages      ?? null
  const totalSessions      = stats?.totalSessions      ?? null
  const loading            = stats === null

  const roleCounts = sessions.reduce((acc, s) => {
    acc[s.rol] = (acc[s.rol] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(roleCounts).map(([rol, count]) => ({
    name: rol, value: count, color: ROLE_COLORS[rol] ?? '#8e9299',
  }))
  const pieDisplay = pieData.length > 0 ? pieData : [{ name: 'Sin datos', value: 1, color: '#8e929920' }]

  function fmt(n) {
    if (n === null) return '—'
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
  }

  function timeAgo(dateStr) {
    if (!dateStr) return '—'
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diff < 60) return `Hace ${diff}s`
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}min`
    return `Hace ${Math.floor(diff / 3600)}h`
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-theme-accent font-bold text-[10px] uppercase tracking-[0.3em]">Vista General</p>
          <h1 className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-neutral-900')}>Admin Executive</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className={cn('text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 border',
            isDark ? 'bg-theme-glass border-theme-border text-white/70 hover:bg-white/10' : 'bg-black/5 border-neutral-200 text-neutral-700')}>
            <Download size={14} /> Exportar
          </button>
          <button onClick={onRefresh} className="bg-theme-accent text-white text-sm font-bold px-5 py-2 rounded-xl flex items-center gap-2">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Sesiones Activas" value={fmt(activeSessions)} delta={activeSessions !== null ? `${activeSessions} ahora` : 'cargando'} icon={Users} color="cyan" isDark={isDark} live />
        <StatCard label="Conversaciones" value={fmt(totalConversations)} delta={totalSessions !== null ? `${totalSessions} total` : 'cargando'} icon={MessageSquare} color="purple" isDark={isDark} />
        <StatCard label="Mensajes Totales" value={fmt(totalMessages)} delta="acumulado" icon={Activity} color="blue" isDark={isDark} />
        <StatCard label="Sesiones Totales" value={fmt(totalSessions)} delta="históricas" icon={TrendingUp} color="indigo" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={cn('lg:col-span-2 rounded-2xl p-5 space-y-4 border', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
          <h3 className={cn('font-bold', isDark ? 'text-white/80' : 'text-neutral-900')}>Actividad del Día</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_ACTIVITY}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff05' : '#00000005'} vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#8e9299' : '#00000040', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#151515' : '#ffffff', borderRadius: 12, border: isDark ? '1px solid #ffffff10' : '1px solid #00000010', fontSize: 12 }} itemStyle={{ color: '#3b82f6' }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn('rounded-2xl p-5 space-y-4 flex flex-col border', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
          <h3 className={cn('font-bold', isDark ? 'text-white/80' : 'text-neutral-900')}>Roles Conectados</h3>
          <div className="flex-1 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieDisplay} innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value">
                  {pieDisplay.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#151515' : '#ffffff', borderRadius: 10, border: 'none', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {pieDisplay.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className={isDark ? 'text-theme-text-dim' : 'text-neutral-500'}>{item.name}</span>
                </div>
                <span className={cn('font-bold', isDark ? 'text-white/80' : 'text-neutral-900')}>{item.name === 'Sin datos' ? '0' : item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cn('rounded-2xl overflow-hidden border', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
        <div className={cn('p-4 flex items-center justify-between border-b', isDark ? 'border-white/5' : 'border-neutral-100')}>
          <div className="flex items-center gap-3">
            <h3 className={cn('font-bold', isDark ? 'text-white/80' : 'text-neutral-900')}>Sesiones en Vivo</h3>
            {activeSessions !== null && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">
                <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                {activeSessions} activas
              </span>
            )}
          </div>
          <button className="p-2 text-theme-text-dim hover:bg-black/5 rounded-lg transition-colors">
            <Filter size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={cn('text-[10px] uppercase font-bold tracking-widest border-b', isDark ? 'text-theme-text-dim border-white/5' : 'text-neutral-400 border-neutral-100')}>
              <tr>
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Última actividad</th>
                <th className="px-5 py-3 text-right">Mensajes</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className={cn('px-5 py-8 text-center text-sm', isDark ? 'text-theme-text-dim' : 'text-neutral-400')}>
                    {loading ? 'Cargando sesiones...' : 'No hay sesiones registradas'}
                  </td>
                </tr>
              ) : (
                sessions.slice(0, 10).map((s, i) => (
                  <tr key={`${s.userId}-${i}`} className={cn('border-b transition-colors', isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-neutral-50 hover:bg-neutral-50')}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border', isDark ? 'bg-white/10 border-white/10 text-white/60' : 'bg-neutral-200 border-neutral-300 text-neutral-600')}>
                          {s.userId.slice(0, 2).toUpperCase()}
                        </div>
                        <p className={cn('font-medium font-mono text-xs', isDark ? 'text-white/90' : 'text-neutral-900')}>{s.userId}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: `${ROLE_COLORS[s.rol] ?? '#8e9299'}20`, color: ROLE_COLORS[s.rol] ?? '#8e9299' }}>
                        {s.rol}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                        s.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : isDark ? 'bg-white/5 text-white/30 border-white/10' : 'bg-neutral-100 text-neutral-400 border-neutral-200')}>
                        <div className={cn('w-1 h-1 rounded-full', s.isActive ? 'bg-green-400 animate-pulse' : 'bg-neutral-400')} />
                        {s.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-theme-text-dim text-xs">{timeAgo(s.lastActivityAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={cn('font-mono text-xs font-bold', isDark ? 'text-white/60' : 'text-neutral-600')}>{s.historyLength}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function AIConfigUI({ isDark }) {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <p className="text-theme-accent-sec font-bold text-[10px] uppercase tracking-[0.3em]">Neural Engine</p>
        <h1 className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-neutral-900')}>Configuración IA</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn('p-6 rounded-2xl border space-y-6', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="text-theme-accent" size={16} /> Parámetros del Modelo
          </h3>
          <div className="space-y-5">
            <ConfigSlider label="Temperatura"  value="0.8"  description="Controla la aleatoriedad de las respuestas." isDark={isDark} pct={80} />
            <ConfigSlider label="Max Tokens"   value="2048" description="Longitud máxima de la respuesta generada."  isDark={isDark} pct={60} />
            <ConfigSlider label="Top P"        value="0.95" description="Muestreo de núcleo para diversidad léxica."  isDark={isDark} pct={95} />
          </div>
        </div>
        <div className={cn('p-6 rounded-2xl border space-y-5', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShieldCheck className="text-theme-accent-sec" size={16} /> Privacidad & Filtros
          </h3>
          <ConfigToggle label="Filtro de Contenido"  active isDark={isDark} />
          <ConfigToggle label="Recordar Contexto"    active isDark={isDark} />
          <ConfigToggle label="Anonimización de PII" active={false} isDark={isDark} />
          <ConfigToggle label="Modo Educativo"       active={false} isDark={isDark} />
        </div>
      </div>
      <div className={cn('p-6 rounded-2xl border', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
        <h3 className="text-lg font-bold mb-4">System Prompt Maestro</h3>
        <textarea className={cn('w-full h-32 rounded-xl p-4 text-sm font-mono outline-none border resize-none',
          isDark ? 'bg-black/40 border-theme-border text-white/80 focus:border-theme-accent/50' : 'bg-neutral-50 border-neutral-200 text-neutral-800')}
          placeholder="Eres un asistente experto..." />
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-5 py-2 rounded-xl text-neutral-500 font-bold text-sm hover:bg-black/5 transition-all">Descartar</button>
          <button className="px-6 py-2 rounded-xl bg-theme-accent text-white font-bold text-sm">Guardar Cambios</button>
        </div>
      </div>
    </div>
  )
}

function FlowsUI({ isDark }) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-theme-accent font-bold text-[10px] uppercase tracking-[0.3em]">Gestión de Diálogo</p>
        <h1 className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-neutral-900')}>Flujos de Chatbot</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn('p-5 rounded-2xl border space-y-4', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
          <h3 className="font-bold flex items-center gap-2"><Activity size={14} className="text-theme-accent" /> Árboles Activos</h3>
          <div className="space-y-2">
            {['Bienvenida General', 'Soporte Ventas', 'Onboarding Pro', 'Recuperación Lead'].map((f, i) => (
              <div key={i} className={cn('p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:translate-x-1',
                isDark ? 'bg-white/5 border-white/5 hover:bg-theme-accent/10' : 'bg-neutral-50 border-neutral-100')}>
                <span className="text-sm font-medium">{f}</span>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}
            <button className="w-full py-2 rounded-xl border border-dashed border-theme-accent/30 text-theme-accent text-xs font-bold hover:bg-theme-accent/5 transition-all mt-2">
              + NUEVO FLUJO
            </button>
          </div>
        </div>
        <div className={cn('md:col-span-2 p-5 rounded-2xl border space-y-4', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
          <h3 className="font-bold">Editor de Nodos: <span className="text-theme-accent">Bienvenida General</span></h3>
          <div className={cn('p-4 rounded-xl border relative', isDark ? 'bg-black/40 border-white/10' : 'bg-neutral-50 border-neutral-200')}>
            <div className="absolute -top-3 left-4 px-2 bg-theme-accent text-[10px] font-bold text-white rounded">NODO INICIAL</div>
            <p className="text-xs text-theme-text-dim mb-2 uppercase tracking-widest font-bold">Respuesta del Bot</p>
            <textarea className="w-full bg-transparent border-none focus:ring-0 text-sm h-12 resize-none outline-none"
              defaultValue="¡Hola! Soy tu asistente RAG. ¿En qué puedo ayudarte hoy?" />
          </div>
          <div className="flex justify-end">
            <button className="px-5 py-2 rounded-xl bg-theme-accent text-white text-sm font-bold">Publicar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, delta, icon: Icon, color, isDark, live }) {
  const colors = {
    cyan:   'text-cyan-400 bg-cyan-400/10',
    purple: 'text-theme-accent-sec bg-theme-accent-sec/10',
    blue:   'text-blue-400 bg-blue-400/10',
    indigo: 'text-indigo-400 bg-indigo-400/10',
  }
  return (
    <div className={cn('border p-5 rounded-2xl space-y-3 group', isDark ? 'bg-theme-panel border-theme-border hover:bg-white/[0.06]' : 'bg-white border-neutral-200 hover:shadow-md')}>
      <div className="flex items-center justify-between">
        <div className={cn('p-2.5 rounded-xl', colors[color])}>
          <Icon size={16} />
        </div>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1',
          isDark ? 'text-theme-text-dim bg-white/5 border-white/5' : 'text-neutral-400 bg-neutral-100 border-neutral-200')}>
          {live && <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse inline-block" />}
          {delta}
        </span>
      </div>
      <div>
        <p className={cn('text-xs font-bold uppercase tracking-wider', isDark ? 'text-theme-text-dim' : 'text-neutral-400')}>{label}</p>
        <p className={cn('text-2xl font-bold mt-1', isDark ? 'text-white' : 'text-neutral-900')}>{value}</p>
      </div>
    </div>
  )
}

function ConfigSlider({ label, value, description, isDark, pct }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className={cn('text-sm font-bold', isDark ? 'text-theme-text-dim' : 'text-neutral-600')}>{label}</label>
        <span className="text-xs text-theme-accent font-mono font-bold">{value}</span>
      </div>
      <div className={cn('h-1.5 w-full rounded-full overflow-hidden', isDark ? 'bg-black/40' : 'bg-neutral-100')}>
        <div className="h-full bg-theme-accent" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-neutral-500">{description}</p>
    </div>
  )
}

function ConfigToggle({ label, active, isDark }) {
  return (
    <div className={cn('flex items-center justify-between p-3 rounded-xl border',
      isDark ? 'bg-black/20 border-theme-border' : 'bg-neutral-50 border-neutral-100')}>
      <span className={cn('text-sm', isDark ? 'text-theme-text-dim' : 'text-neutral-600')}>{label}</span>
      <div className={cn('w-9 h-5 rounded-full relative cursor-pointer', active ? 'bg-theme-accent-sec' : isDark ? 'bg-neutral-800' : 'bg-neutral-200')}>
        <div className={cn('absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all', active ? 'left-5' : 'left-1')} />
      </div>
    </div>
  )
}