const styles = {
  publicado: { background: 'var(--green-bg)', color: 'var(--green)' },
  borrador:  { background: 'var(--yellow-bg)', color: 'var(--yellow)' },
  activo:    { background: 'var(--green-bg)', color: 'var(--green)' },
  inactivo:  { background: 'var(--red-bg)', color: 'var(--red)' },
  pendiente: { background: 'var(--yellow-bg)', color: 'var(--yellow)' },
  gestionada:{ background: 'var(--green-bg)', color: 'var(--green)' },
  true:      { background: 'var(--green-bg)', color: 'var(--green)' },
  false:     { background: '#EEF0F4', color: '#5C5772' },
}

export default function StatusBadge({ value }) {
  const key = String(value)
  const label = value === true ? 'Sí' : value === false ? 'No' : value
  const style = styles[key] || { background: '#EEF0F4', color: '#5C5772' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap',
      ...style,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />
      <span className="capitalize">{label}</span>
    </span>
  )
}
