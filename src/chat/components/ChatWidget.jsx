import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Bot, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ChatInterface from './ChatInterface'

function getOrCreateTabId() {
  const key = 'chat_tab_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

export default function ChatWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const tabId = getOrCreateTabId()
  const session = {
    userId: user?.id ? String(user.id) : `anon-${tabId}`,
    userName: user?.nombre
      ? `${user.nombre} ${user.apellido || ''}`.trim()
      : (user?.username || 'Invitado'),
    rol: user?.rol || 'guest',
    token: localStorage.getItem('token') || undefined,
    tabId,
  }

  return (
    <>
      {/* Panel del chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: 88,
              right: 24,
              width: 400,
              height: 620,
              borderRadius: 20,
              overflow: 'hidden',
              zIndex: 9998,
              boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            <ChatInterface
              session={session}
              isDark={isDark}
              toggleTheme={() => setIsDark(d => !d)}
              showAdminLink={user?.rol === 'superadmin'}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setOpen(o => !o)}
        title={open ? 'Cerrar chat' : 'Abrir chat'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 54,
          height: 54,
          borderRadius: '50%',
          border: 0,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(59,130,246,0.55)',
          zIndex: 9999,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="bot"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.14 }}>
              <Bot size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}