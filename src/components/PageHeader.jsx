export default function PageHeader({ eyebrow, title, subtitle, count, action }) {
  return (
    <div className="cms-page-head">
      <div>
        <div className="cms-eyebrow">{eyebrow || 'Gestión'}</div>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.15, letterSpacing: '-.025em', fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 12 }}>
          {title}
          {count !== undefined && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 28, padding: '0 11px', borderRadius: 999,
              background: '#fff', border: '1px solid var(--line)',
              fontSize: 12, fontWeight: 700, color: 'var(--ink)',
              verticalAlign: '5px',
            }}>
              <span style={{ background: 'linear-gradient(90deg,var(--pink),var(--orange))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontWeight: 800 }}>
                {count}
              </span>
            </span>
          )}
        </h1>
        {subtitle && (
          <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 14 }}>{subtitle}</p>
        )}
      </div>
      {action && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{action}</div>}
    </div>
  )
}
