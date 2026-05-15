import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import config from '../config'

export function useAdminStats(session) {
  const socketRef = useRef(null)
  const [stats, setStats] = useState(null)
  const tabIdRef = useRef(`stats-${crypto.randomUUID()}`)

  const fetchStats = useCallback(() => {
    const sock = socketRef.current
    if (!sock?.connected) return
    sock.emit('admin:stats', {}, (data) => {
      if (data && !data.error) setStats(data)
    })
  }, [])

  useEffect(() => {
    if (!session?.token) return

    const sock = io(`${config.SOCKET_URL}${config.SOCKET_NAMESPACE}`, {
      auth: { token: session.token, tabId: tabIdRef.current },
    })
    socketRef.current = sock

    sock.on('connect', fetchStats)
    const interval = setInterval(fetchStats, 8000)

    return () => {
      clearInterval(interval)
      sock.disconnect()
    }
  }, [session?.token, fetchStats])

  return { stats, refetch: fetchStats }
}