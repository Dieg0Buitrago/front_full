function hexToRgb(hex) {
  const h = (hex || '#1a1a2e').replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
  }
}

function darken(hex, factor) {
  const { r, g, b } = hexToRgb(hex)
  const d = v => Math.round(v * factor).toString(16).padStart(2, '0')
  return `#${d(r)}${d(g)}${d(b)}`
}

export function buildTheme(c) {
  if (!c) return null
  const c1 = c.color_primario || '#E8305A'
  const c2 = c.color_secundario || '#F47B3E'
  const c3 = c.color_acento || '#3AB8D4'
  const oscuro = c.color_oscuro || '#1a1a2e'
  const { r, g, b } = hexToRgb(oscuro)
  const dark1 = darken(oscuro, 0.38)
  const dark2 = darken(oscuro, 0.65)
  const navR = Math.round(r * 0.38)
  const navG = Math.round(g * 0.38)
  const navB = Math.round(b * 0.38)

  return {
    id: c.id,
    slug: c.slug,
    name: c.nombre,
    flag: c.flag || '',
    logo: c.logo_url || null,
    tagline: c.tagline || `${c.nombre} Comparte`,
    desc: c.descripcion_publica || '',
    values: Array.isArray(c.valores) ? c.valores : [],
    c1, c2, c3,
    accent: c3,
    accentDark: oscuro,
    cardBg: `linear-gradient(155deg, ${dark1} 0%, ${dark2} 55%, ${oscuro} 100%)`,
    heroBg: `linear-gradient(135deg, ${dark1} 0%, ${dark2} 45%, ${c1} 100%)`,
    navBg: `rgba(${navR},${navG},${navB},0.92)`,
    sectionBg: '#f5f5f8',
  }
}
