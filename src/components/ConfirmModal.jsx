export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Eliminar', dangerous = true }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(20,10,40,.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 18, padding: 28,
        width: '100%', maxWidth: 400,
        boxShadow: '0 30px 80px rgba(20,10,40,.22)',
        border: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          {dangerous && (
            <span style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'var(--red-bg)', color: 'var(--red)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </span>
          )}
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
              {dangerous ? 'Confirmar eliminación' : 'Confirmar acción'}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{message}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button onClick={onCancel} className="cms-btn-outline" style={{ height: 38, padding: '0 16px', fontSize: 13 }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={dangerous ? 'cms-btn-danger' : 'cms-btn-primary'} style={{ height: 38, padding: '0 16px', fontSize: 13 }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
