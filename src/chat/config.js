const config = {
  AUTH_URL: import.meta.env.VITE_AUTH_URL || 'http://localhost:3001',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3030',
  SOCKET_NAMESPACE: '/chat',
}

export default config