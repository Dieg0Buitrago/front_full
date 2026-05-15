import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import config from '../config'

export function useSocket(session) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const conversationIdRef = useRef(null)
  const backendUserIdRef = useRef(session.userId)

  const addMessage = useCallback((text, role = 'bot', sender = 'Asistente', instant = false) => {
    setMessages(prev => [...prev, { text, role, sender, id: Date.now() + Math.random(), timestamp: Date.now(), instant }])
  }, [])

  const ensureConversation = useCallback(() => {
    return new Promise(resolve => {
      if (conversationIdRef.current) return resolve(conversationIdRef.current)
      const sock = socketRef.current
      if (!sock) return resolve(null)
      sock.emit(
        'conversation:create',
        { title: `Chat de ${session.userName}`, participantIds: [session.userId] },
        conv => {
          conversationIdRef.current = conv.id
          resolve(conv.id)
        },
      )
      sock.once('conversation:created', conv => {
        conversationIdRef.current = conv.id
        resolve(conv.id)
      })
    })
  }, [session.userName, session.userId])

  const sendMessage = useCallback(async text => {
    if (!text?.trim() || !socketRef.current) return
    addMessage(text, 'user', session.userName)
    setTyping(true)
    const conversationId = await ensureConversation()
    socketRef.current.emit('message:send', { conversationId, content: text })
  }, [addMessage, ensureConversation, session.userName])

  const resetConversation = useCallback(() => {
    if (!socketRef.current) return
    setMessages([])
    setTyping(false)
    conversationIdRef.current = null
    socketRef.current.emit('conversation:reset')
  }, [])

  const uploadDocument = useCallback(async file => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${config.SOCKET_URL}/rag/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}` },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data.message
  }, [session.token])

  useEffect(() => {
    if (!session?.tabId) return

    const sock = io(`${config.SOCKET_URL}${config.SOCKET_NAMESPACE}`, {
      auth: { token: session.token ?? undefined, tabId: session.tabId },
    })
    socketRef.current = sock

    sock.on('connect', () => setConnected(true))
    sock.on('disconnect', () => setConnected(false))

    sock.on('session:ready', ({ sessionId, userId }) => {
      setSessionId(sessionId)
      backendUserIdRef.current = userId
    })

    sock.on('error', ({ message }) => {
      setTyping(false)
      addMessage(`⚠ ${message}`, 'bot', 'Sistema')
    })

    sock.on('on-message', ({ message }) => {
      addMessage(message, 'bot', 'Asistente')
    })

    sock.on('message:new', msg => {
      if (msg.senderId !== backendUserIdRef.current) {
        addMessage(msg.content, 'bot', msg.senderId)
      }
    })

    sock.on('message:rag', msg => {
      setTyping(false)
      addMessage(msg.content, 'bot', 'Asistente')
    })

    sock.on('rag:error', ({ message }) => {
      setTyping(false)
      addMessage(`⚠ ${message}`, 'bot', 'Sistema')
    })

    sock.on('session:history', ({ messages }) => {
      messages.forEach(({ sender, message }) => addMessage(message, sender, sender, true))
    })

    sock.on('session:expired', ({ message }) => {
      setConnected(false)
      addMessage(message, 'bot', 'Sistema')
    })

    sock.on('conversation:reset', () => {
      setMessages([])
      setTyping(false)
      conversationIdRef.current = null
    })

    return () => { sock.disconnect() }
  }, [session.tabId, session.userId, addMessage])

  return {
    connected,
    sessionId,
    messages,
    typing,
    sendMessage,
    uploadDocument,
    resetConversation,
    disconnect: () => socketRef.current?.disconnect(),
  }
}