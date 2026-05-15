import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, RotateCcw, Paperclip, Bot, Moon, Sun, UserCog, LogOut, Copy, Check, ArrowDown, User } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '../lib/utils'
import { useSocket } from '../hooks/useSocket'

const SUGGESTIONS = [
  '¿Cuál es tu horario de atención?',
  'Quiero más información',
  'Necesito soporte técnico',
  '¿Cómo puedo contactarlos?',
]

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

function getAvatarColor(name = '') {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function getInitials(name = '') {
  return name.slice(0, 2).toUpperCase()
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  } catch {}
}

function SkeletonBubble({ right = false, width, isDark }) {
  return (
    <div className={cn('flex items-end gap-3', right ? 'flex-row-reverse' : 'flex-row')}>
      {!right && (
        <div className={cn('w-9 h-9 rounded-full flex-shrink-0 animate-pulse', isDark ? 'bg-white/8' : 'bg-neutral-200')} />
      )}
      <div className={cn(
        'h-10 rounded-[20px] animate-pulse',
        width ?? (right ? 'w-48' : 'w-64'),
        right ? 'rounded-br-none' : 'rounded-bl-none',
        isDark ? 'bg-white/[0.06]' : 'bg-neutral-200',
      )} />
    </div>
  )
}

const MAX_CHARS = 500

export default function ChatInterface({
  session,
  isDark = true,
  toggleTheme,
  showAdminLink = false,
  onLogout,
  adminSidebar = false,
  onClose,
}) {
  const [input, setInput]               = useState('')
  const [showUpload, setShowUpload]     = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [displayTexts, setDisplayTexts] = useState({})
  const [copiedId, setCopiedId]         = useState(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [unreadCount, setUnreadCount]   = useState(0)

  const fileRef      = useRef(null)
  const scrollRef    = useRef(null)
  const textareaRef  = useRef(null)
  const navigate     = useNavigate()
  const typedRef     = useRef(new Set())
  const intervalsRef = useRef({})
  const isAtBottomRef  = useRef(true)
  const prevMsgCount   = useRef(0)

  const { connected, sessionId, messages, typing, sendMessage, uploadDocument, resetConversation } = useSocket(session)

  const isSuperadmin = session?.rol === 'superadmin'

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'bot' || last.instant) return
    if (typedRef.current.has(last.id)) return
    typedRef.current.add(last.id)
    playPopSound()

    const text  = last.text
    const speed = Math.max(8, 1200 / text.length)
    let i = 0

    const id = setInterval(() => {
      i++
      setDisplayTexts(prev => ({ ...prev, [last.id]: text.slice(0, i) }))
      if (i >= text.length) {
        clearInterval(id)
        delete intervalsRef.current[last.id]
      }
    }, speed)

    intervalsRef.current[last.id] = id
  }, [messages])

  useEffect(() => {
    return () => Object.values(intervalsRef.current).forEach(clearInterval)
  }, [])

  const scrollToBottom = useCallback((force = false) => {
    const el = scrollRef.current
    if (!el) return
    if (force || isAtBottomRef.current) {
      el.scrollTop = el.scrollHeight
      setUnreadCount(0)
      setShowScrollBtn(false)
    }
  }, [])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
    isAtBottomRef.current = atBottom
    setShowScrollBtn(!atBottom)
    if (atBottom) setUnreadCount(0)
  }

  useEffect(() => {
    const total = messages.length + (typing ? 1 : 0)
    if (total > prevMsgCount.current) {
      const last = messages[messages.length - 1]
      if (isAtBottomRef.current) {
        setTimeout(() => scrollToBottom(true), 30)
      } else if (last?.role !== 'user') {
        setUnreadCount(p => p + 1)
      }
    }
    prevMsgCount.current = total
  }, [messages, typing, scrollToBottom])

  function handleSend() {
    const text = input.trim()
    if (!text || !connected || input.length > MAX_CHARS) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    sendMessage(text)
  }

  function handleInputChange(e) {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  async function handleUpload() {
    const file = fileRef.current?.files[0]
    if (!file) return
    setUploadStatus('Subiendo...')
    try {
      const msg = await uploadDocument(file)
      setUploadStatus(`✓ ${msg}`)
    } catch (e) {
      setUploadStatus(`⚠ ${e.message}`)
    }
  }

  function handleCopy(id, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1800)
    })
  }

  const mdComponents = {
    code({ children, className }) {
      const match = /language-(\w+)/.exec(className || '')
      const isBlock = /\n/.test(String(children)) || !!match
      if (isBlock) {
        return (
          <SyntaxHighlighter
            style={isDark ? oneDark : oneLight}
            language={match?.[1] ?? 'text'}
            PreTag="div"
            customStyle={{ borderRadius: 12, fontSize: 12, margin: '6px 0' }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      }
      return (
        <code className={cn('px-1.5 py-0.5 rounded text-xs font-mono', isDark ? 'bg-white/10 text-blue-300' : 'bg-neutral-100 text-indigo-600')}>
          {children}
        </code>
      )
    },
    p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
    li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-theme-accent underline underline-offset-2 hover:opacity-80">
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className={cn('w-full text-xs border-collapse', isDark ? 'border-white/10' : 'border-neutral-200')}>{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className={cn('px-3 py-1.5 text-left font-bold border', isDark ? 'border-white/10 bg-white/5' : 'border-neutral-200 bg-neutral-50')}>{children}</th>
    ),
    td: ({ children }) => (
      <td className={cn('px-3 py-1.5 border', isDark ? 'border-white/5' : 'border-neutral-100')}>{children}</td>
    ),
  }

  const chatArea = (
    <div className={cn(
      'flex flex-col h-full relative overflow-hidden transition-colors duration-500',
      isDark ? 'bg-theme-bg' : 'bg-neutral-50',
    )}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-theme-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-theme-accent-sec/20 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* Controles flotantes top-right */}
      {!adminSidebar && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
          {toggleTheme && (
            <button onClick={toggleTheme} title={isDark ? 'Modo claro' : 'Modo oscuro'}
              className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all border backdrop-blur-sm',
                isDark ? 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-black/40 hover:text-black hover:bg-black/10')}>
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          )}
          {showAdminLink && (
            <button onClick={() => navigate('/chat/admin')} title="Panel de administración"
              className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all border backdrop-blur-sm',
                isDark ? 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-black/40 hover:text-black hover:bg-black/10')}>
              <UserCog size={13} />
            </button>
          )}
          {onLogout && (
            <button onClick={onLogout} title="Cerrar sesión"
              className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all border backdrop-blur-sm',
                isDark ? 'bg-white/5 border-white/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20' : 'bg-black/5 border-black/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10')}>
              <LogOut size={13} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} title="Cerrar chat"
              className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all border backdrop-blur-sm text-lg leading-none',
                isDark ? 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-black/40 hover:text-black hover:bg-black/10')}>
              ×
            </button>
          )}
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pt-6 pb-44 overflow-hidden relative z-10">
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto space-y-5 scrollbar-hide py-2 px-1">
          <AnimatePresence initial={false}>
            {!connected && messages.length === 0 && (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5 pt-4">
                <SkeletonBubble isDark={isDark} />
                <SkeletonBubble right isDark={isDark} width="w-36" />
                <SkeletonBubble isDark={isDark} width="w-80" />
              </motion.div>
            )}

            {connected && messages.length === 0 && !typing && (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center min-h-[55%] gap-5 py-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-[28px] bg-theme-accent/30 blur-[40px] scale-125 pointer-events-none" />
                  <div className={cn('relative w-20 h-20 rounded-[28px] flex items-center justify-center shadow-2xl border',
                    'bg-gradient-to-br from-theme-accent to-theme-accent-sec',
                    isDark ? 'border-white/10' : 'border-white/40')}>
                    <Bot size={38} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h2 className={cn('font-bold text-xl tracking-tight',
                    isDark ? 'text-white' : 'text-neutral-900')}>
                    AETHER AI
                  </h2>
                  <p className={cn('text-xs leading-relaxed', isDark ? 'text-theme-text-dim' : 'text-neutral-500')}>
                    Tu asistente inteligente.<br />¿En qué puedo ayudarte hoy?
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)] animate-pulse" />
                  <span className={cn('text-[10px] font-bold uppercase tracking-widest', isDark ? 'text-white/30' : 'text-neutral-400')}>En línea</span>
                </div>
              </motion.div>
            )}

            {messages.map((msg) => {
              const isUser     = msg.role === 'user'
              const displayTxt = (!msg.instant && displayTexts[msg.id] !== undefined) ? displayTexts[msg.id] : msg.text
              const isAnimating = !msg.instant && displayTexts[msg.id] !== undefined && displayTexts[msg.id] !== msg.text
              const color = getAvatarColor(msg.sender)

              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
                  className={cn('flex items-end gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
                  {!isUser ? (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border border-white/10 text-[10px] font-bold text-white"
                      style={{ backgroundColor: color }}>
                      {getInitials(msg.sender)}
                    </div>
                  ) : (
                    <div className={cn('w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border',
                      isDark ? 'bg-white/10 border-white/10 text-white/60' : 'bg-neutral-200 border-neutral-300 text-neutral-500')}>
                      <User size={12} />
                    </div>
                  )}

                  <div className={cn('flex flex-col space-y-1 max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
                    <div className="relative group">
                      <div className={cn(
                        'px-3 py-2.5 rounded-[18px] text-sm leading-relaxed border shadow-sm',
                        isUser
                          ? 'bg-theme-accent text-white border-transparent rounded-br-none'
                          : isDark
                            ? 'bg-theme-panel border-theme-border text-white/90 rounded-bl-none'
                            : 'bg-white border-neutral-200 text-neutral-800 rounded-bl-none',
                      )}>
                        {!isUser && !isAnimating ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{displayTxt}</ReactMarkdown>
                        ) : (
                          <span>{displayTxt}</span>
                        )}
                      </div>

                      {!isUser && msg.text && (
                        <button onClick={() => handleCopy(msg.id, msg.text)}
                          className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-all w-5 h-5 rounded-full flex items-center justify-center border shadow-md"
                          style={{ backgroundColor: isDark ? '#1e1e23' : '#ffffff', borderColor: isDark ? '#ffffff15' : '#00000015' }}>
                          {copiedId === msg.id ? <Check size={9} className="text-green-400" /> : <Copy size={9} className={isDark ? 'text-white/40' : 'text-neutral-400'} />}
                        </button>
                      )}
                    </div>

                    <div className={cn('flex items-center gap-2 px-1', isUser ? 'flex-row-reverse' : 'flex-row')}>
                      <span className={cn('text-[10px] font-bold tracking-wider uppercase opacity-40', isDark ? 'text-white' : 'text-neutral-900')}>{msg.sender}</span>
                      {msg.timestamp && (
                        <span className={cn('text-[10px] opacity-25', isDark ? 'text-white' : 'text-neutral-900')}>{formatTime(msg.timestamp)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {typing && (
              <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-accent to-theme-accent-sec flex-shrink-0 flex items-center justify-center border border-white/10">
                  <Bot size={14} className="text-white" />
                </div>
                <div className={cn('px-3 py-3 rounded-[18px] rounded-bl-none border', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
                  <div className="flex gap-1 items-center">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay }}
                        className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Botón scroll al final */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom(true)}
            className={cn('absolute bottom-[110px] right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border transition-colors',
              isDark ? 'bg-theme-panel border-theme-border text-white/60 hover:text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900')}>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-theme-accent text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <ArrowDown size={13} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Upload panel superadmin + adminSidebar */}
      {isSuperadmin && adminSidebar && (
        <div className="relative z-10 max-w-2xl mx-auto w-full px-4 pb-3">
          <div className={cn('px-4 py-3 rounded-2xl border flex flex-wrap gap-3 items-center', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
            <span className={cn('text-[10px] font-bold uppercase tracking-widest', isDark ? 'text-theme-text-dim' : 'text-neutral-400')}>Subir documento al RAG</span>
            <input ref={fileRef} type="file" accept=".pdf" className="flex-1 text-xs text-neutral-400 min-w-0" />
            <button onClick={handleUpload} className="px-4 py-1.5 rounded-xl bg-theme-accent text-white text-xs font-bold whitespace-nowrap">Subir</button>
            {uploadStatus && (
              <span className={cn('text-xs font-mono w-full', uploadStatus.startsWith('✓') ? 'text-green-400' : 'text-red-400')}>{uploadStatus}</span>
            )}
          </div>
        </div>
      )}

      {/* Upload flotante sin adminSidebar */}
      {isSuperadmin && !adminSidebar && showUpload && (
        <div className="absolute bottom-[104px] left-0 right-0 max-w-2xl mx-auto px-4 z-20">
          <div className={cn('p-3 rounded-2xl border shadow-xl flex flex-wrap gap-3 items-center', isDark ? 'bg-theme-panel border-theme-border' : 'bg-white border-neutral-200')}>
            <input ref={fileRef} type="file" accept=".pdf" className="flex-1 text-xs text-neutral-400 min-w-0" />
            <button onClick={handleUpload} className="px-4 py-1.5 rounded-xl bg-theme-accent text-white text-xs font-bold whitespace-nowrap">Subir PDF</button>
            {uploadStatus && (
              <span className={cn('text-xs font-mono', uploadStatus.startsWith('✓') ? 'text-green-400' : 'text-red-400')}>{uploadStatus}</span>
            )}
          </div>
        </div>
      )}

      {/* Input flotante */}
      <div className={cn('absolute bottom-0 left-0 w-full p-3 pb-4 z-10',
        isDark ? 'bg-gradient-to-t from-theme-bg via-theme-bg/90 to-transparent' : 'bg-gradient-to-t from-neutral-50 via-neutral-50/90 to-transparent')}>
        <div className="max-w-2xl mx-auto space-y-2">
          {messages.length === 0 && connected && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} disabled={!connected}
                  className={cn('whitespace-nowrap px-3 py-1 rounded-full border text-xs font-semibold transition-all',
                    isDark ? 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10' : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900')}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className={cn('relative border backdrop-blur-[30px] rounded-[20px] px-2 py-1.5 pr-2.5 flex items-end gap-2 transition-all shadow-xl',
            isDark ? 'bg-[#1e1e23cc] border-theme-border shadow-black/40' : 'bg-white border-neutral-200 shadow-neutral-200/50')}>
            <button onClick={() => { resetConversation(); setDisplayTexts({}); typedRef.current.clear() }} title="Nueva conversación"
              className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all mb-0.5',
                isDark ? 'text-white/30 hover:text-white/70 hover:bg-white/10' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100')}>
              <RotateCcw size={13} />
            </button>

            <div className="flex-1 relative">
              <textarea ref={textareaRef} value={input} onChange={handleInputChange}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                disabled={!connected} rows={1} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                placeholder={connected ? 'Escribe un mensaje...' : 'Sin conexión...'}
                style={{ resize: 'none', overflow: 'hidden' }}
                className={cn('w-full bg-transparent border-none outline-none text-sm py-1.5 px-1 leading-snug',
                  isDark ? 'text-white placeholder:text-theme-text-dim' : 'text-neutral-900 placeholder:text-neutral-400',
                  !connected && 'opacity-40')} />
              {input.length > 200 && (
                <span className={cn('absolute bottom-0 right-0 text-[10px] font-mono pointer-events-none',
                  input.length > MAX_CHARS - 50 ? 'text-red-400' : 'text-neutral-500')}>
                  {input.length}/{MAX_CHARS}
                </span>
              )}
            </div>

            {isSuperadmin && !adminSidebar && (
              <button onClick={() => { setShowUpload(v => !v); setUploadStatus('') }} title="Subir documento al RAG"
                className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all mb-0.5',
                  showUpload ? 'bg-theme-accent text-white' : isDark ? 'text-white/30 hover:text-white/70 hover:bg-white/10' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100')}>
                <Paperclip size={13} />
              </button>
            )}

            <button onClick={handleSend} disabled={!input.trim() || !connected || input.length > MAX_CHARS}
              className={cn('flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg mb-0.5',
                input.trim() && connected && input.length <= MAX_CHARS
                  ? 'bg-theme-accent text-white scale-100'
                  : isDark ? 'bg-neutral-800 text-white/20 scale-90' : 'bg-neutral-100 text-neutral-400 scale-90')}>
              <Send size={14} className="translate-x-0.5" />
            </button>
          </div>

          {!connected && (
            <p className="text-center text-xs text-theme-text-dim animate-pulse">Reconectando...</p>
          )}
        </div>
      </div>
    </div>
  )

  if (!adminSidebar) return chatArea

  return (
    <div className="flex h-full">
      <div className={cn('w-48 flex-shrink-0 flex flex-col h-full border-r',
        isDark ? 'bg-[rgba(10,10,12,0.92)] border-white/5 backdrop-blur-xl' : 'bg-white/90 border-black/5')}>
        <div className="p-4 border-b border-white/5">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-theme-accent">// RAG · CHAT</p>
        </div>
        <div className="flex-1 p-4 space-y-5 overflow-y-auto scrollbar-hide">
          <div className="space-y-1.5">
            <p className={cn('text-[9px] font-bold uppercase tracking-[0.2em]', isDark ? 'text-white/25' : 'text-black/30')}>Conexión</p>
            <div className="flex items-center gap-2">
              <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', connected ? 'bg-green-400 animate-pulse' : 'bg-neutral-500')} />
              <span className={cn('text-xs font-mono font-bold', isDark ? 'text-white/60' : 'text-neutral-700')}>{connected ? 'online' : 'offline'}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className={cn('text-[9px] font-bold uppercase tracking-[0.2em]', isDark ? 'text-white/25' : 'text-black/30')}>Session ID</p>
            <p className={cn('text-[10px] font-mono break-all leading-relaxed', isDark ? 'text-white/40' : 'text-neutral-400')}>{sessionId ?? '—'}</p>
          </div>
          <div className="space-y-1.5">
            <p className={cn('text-[9px] font-bold uppercase tracking-[0.2em]', isDark ? 'text-white/25' : 'text-black/30')}>Usuario</p>
            <p className={cn('text-xs font-mono font-bold', isDark ? 'text-white/70' : 'text-neutral-700')}>{session?.userName}</p>
            <p className={cn('text-[10px] font-mono', isDark ? 'text-white/30' : 'text-neutral-400')}>({session?.rol})</p>
          </div>
        </div>
        <div className={cn('p-3 space-y-1 border-t', isDark ? 'border-white/5' : 'border-black/5')}>
          {toggleTheme && (
            <button onClick={toggleTheme} className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-xs font-medium',
              isDark ? 'text-white/40 hover:bg-white/5 hover:text-white/70' : 'text-black/40 hover:bg-black/5')}>
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
              {isDark ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
          )}
          {onLogout && (
            <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500/60 hover:bg-red-500/10 hover:text-red-400 transition-colors text-xs font-medium">
              <LogOut size={13} /> Salir
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">{chatArea}</div>
    </div>
  )
}