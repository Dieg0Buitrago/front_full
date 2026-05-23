import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCountryById, createCountry, updateCountry, uploadCountryLogo } from '../../api/countries'
import { buildTheme } from '../../config/countries'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'

// ── helpers ─────────────────────────────────────────────────────────────────

function ColorPicker({ label, name, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
          <input
            type="color"
            value={value || '#000000'}
            onChange={e => onChange({ target: { name, value: e.target.value } })}
            style={{ width: '100%', height: '100%', padding: 2, border: '1.5px solid var(--line)', borderRadius: 10, cursor: 'pointer', background: 'none' }}
          />
        </div>
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder="#000000"
          maxLength={7}
          style={{ flex: 1, height: 40, padding: '0 12px', border: '1.5px solid var(--line)', borderRadius: 10, fontSize: 13, fontFamily: 'monospace', color: 'var(--ink)', background: 'var(--bg-input, #fff)', outline: 'none' }}
        />
        {value && (
          <div style={{ width: 40, height: 40, borderRadius: 10, background: value, border: '1.5px solid var(--line)', flexShrink: 0 }} />
        )}
      </div>
    </div>
  )
}

function ValoresTags({ value, onChange }) {
  const [input, setInput] = useState('')
  const tags = Array.isArray(value) ? value : []

  const addTag = (raw) => {
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean)
    const next = [...new Set([...tags, ...parts])]
    onChange(next)
    setInput('')
  }

  const removeTag = (idx) => onChange(tags.filter((_, i) => i !== idx))

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {tags.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--blue-bg, #dbeafe)', color: 'var(--blue, #1d4ed8)', borderRadius: 999, padding: '3px 10px', fontSize: 12.5, fontWeight: 600 }}>
            {t}
            <button type="button" onClick={() => removeTag(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (input.trim()) addTag(input) } }}
          placeholder="Solidaridad, Identidad… (Enter para agregar)"
          className="cms-input"
          style={{ flex: 1 }}
        />
        <button type="button" onClick={() => { if (input.trim()) addTag(input) }} className="cms-btn-ghost" style={{ flexShrink: 0 }}>+</button>
      </div>
    </div>
  )
}

// ── Preview card (mirrors Landing CountryCard) ───────────────────────────────

function PreviewCard({ form }) {
  const dbShape = {
    nombre: form.nombre || 'País',
    slug: form.slug || 'pais',
    flag: form.flag || '🌍',
    tagline: form.tagline || '',
    descripcion_publica: form.descripcion_publica || 'Descripción del país en el sitio público.',
    valores: form.valores,
    color_primario: form.color_primario || '#E8305A',
    color_secundario: form.color_secundario || '#F47B3E',
    color_acento: form.color_acento || '#3AB8D4',
    color_oscuro: form.color_oscuro || '#1a1a2e',
    logo_url: form._logoPreview || null,
  }
  const theme = buildTheme(dbShape)

  return (
    <div style={{ position: 'sticky', top: 80 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, textAlign: 'center' }}>
        Vista previa — Tarjeta pública
      </div>
      <div style={{
        borderRadius: 22,
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: 340, margin: '0 auto',
      }}>
        <div style={{ height: 5, background: `linear-gradient(90deg, ${theme.c1}, ${theme.c2}, ${theme.c3})` }} />
        <div style={{ padding: '28px 26px 24px' }}>
          {/* Logo */}
          <div style={{ width: 90, height: 90, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: `${theme.c1}10`, border: `1px solid ${theme.c1}20`, overflow: 'hidden' }}>
            {theme.logo ? (
              <img src={theme.logo} alt={theme.name} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 38 }}>{theme.flag || theme.name?.[0]}</span>
            )}
          </div>
          {/* Name */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.1 }}>{theme.name}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: theme.c1, textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.1 }}>COMPARTE</div>
          </div>
          <div style={{ width: 36, height: 3, borderRadius: 99, background: `linear-gradient(90deg,${theme.c1},${theme.c2})`, margin: '12px 0' }} />
          <p style={{ color: '#666', fontSize: 12.5, lineHeight: 1.65, marginBottom: 18 }}>
            {theme.desc || 'Descripción del país en el sitio público.'}
          </p>
          {/* Values */}
          {theme.values.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {theme.values.slice(0, 3).map((v, i) => (
                <span key={i} style={{ fontSize: 11, padding: '2px 10px', borderRadius: 999, background: `${theme.c1}15`, color: theme.c1, fontWeight: 700 }}>{v}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero preview */}
      <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, textAlign: 'center' }}>
        Encabezado público
      </div>
      <div style={{ borderRadius: 16, overflow: 'hidden', background: theme.heroBg, padding: '24px 20px', textAlign: 'center', color: '#fff', maxWidth: 340, margin: '0 auto' }}>
        <div style={{ fontSize: 22, marginBottom: 6 }}>{theme.flag}</div>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{theme.name} <span style={{ color: theme.accent }}>Comparte</span></div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{theme.tagline}</div>
        <div style={{ marginTop: 12, height: 3, borderRadius: 99, background: `linear-gradient(90deg,${theme.c1},${theme.c2},${theme.c3})` }} />
      </div>
    </div>
  )
}

// ── Main form ────────────────────────────────────────────────────────────────

const DEFAULTS = {
  nombre: '', slug: '', codigo: '', estado: 'activo', flag: '',
  tagline: '', descripcion_publica: '', valores: [],
  color_primario: '#E8305A', color_secundario: '#F47B3E',
  color_acento: '#3AB8D4', color_oscuro: '#1a1a2e',
}

export default function CountryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const logoInputRef = useRef(null)

  const [form, setForm] = useState(DEFAULTS)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // logo upload state
  const [logoFile, setLogoFile] = useState(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoSuccess, setLogoSuccess] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getCountryById(id).then(r => {
      const d = r.data
      setForm({
        nombre: d.nombre || '',
        slug: d.slug || '',
        codigo: d.codigo || '',
        estado: d.estado || 'activo',
        flag: d.flag || '',
        tagline: d.tagline || '',
        descripcion_publica: d.descripcion_publica || '',
        valores: Array.isArray(d.valores) ? d.valores : [],
        color_primario: d.color_primario || '#E8305A',
        color_secundario: d.color_secundario || '#F47B3E',
        color_acento: d.color_acento || '#3AB8D4',
        color_oscuro: d.color_oscuro || '#1a1a2e',
        _logoPreview: d.logo_url || null,
      })
    })
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: value,
      ...(name === 'nombre' && !isEdit ? {
        slug: value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      } : {}),
    }))
  }

  const handleLogoChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoSuccess(false)
    const url = URL.createObjectURL(file)
    setForm(f => ({ ...f, _logoPreview: url }))
  }

  const handleLogoUpload = async () => {
    if (!logoFile || !id) return
    setLogoUploading(true)
    try {
      const r = await uploadCountryLogo(id, logoFile)
      setForm(f => ({ ...f, _logoPreview: r.data?.url || f._logoPreview }))
      setLogoFile(null)
      setLogoSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir el logo')
    } finally {
      setLogoUploading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form }
      delete payload._logoPreview
      if (isEdit) {
        await updateCountry(id, payload)
        if (logoFile) await handleLogoUpload()
      } else {
        const r = await createCountry(payload)
        const newId = r.data?.data?.id
        if (newId && logoFile) {
          setLogoUploading(true)
          await uploadCountryLogo(newId, logoFile).catch(() => {})
          setLogoUploading(false)
        }
      }
      navigate('/countries')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const SectionTitle = ({ children }) => (
    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: 10, borderBottom: '1px solid var(--line-2)', marginBottom: 16 }}>
      {children}
    </div>
  )

  return (
    <Layout>
      <PageHeader
        eyebrow="Países"
        title={isEdit ? 'Editar país' : 'Nuevo país'}
        subtitle="Configura la identidad y branding del país en el sitio público."
      />

      <form id="country-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── Left: fields ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Basic info */}
            <div className="cms-card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionTitle>Información básica</SectionTitle>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="cms-field">
                  <label className="cms-label">Nombre <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input name="nombre" className="cms-input" value={form.nombre} onChange={handleChange} required placeholder="Argentina" />
                </div>
                <div className="cms-field">
                  <label className="cms-label">
                    Slug <span style={{ color: 'var(--red)' }}>*</span>
                    {!isEdit && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: 'var(--cyan-bg,#DDF1FA)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Auto</span>}
                  </label>
                  <input name="slug" className="cms-input" value={form.slug} onChange={handleChange} required placeholder="argentina" style={{ fontFamily: 'monospace', fontSize: 13 }} />
                  <span className="cms-hint">Solo letras, números y guiones.</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 1fr', gap: 16 }}>
                <div className="cms-field">
                  <label className="cms-label">Código</label>
                  <input name="codigo" className="cms-input" value={form.codigo} onChange={handleChange} maxLength={10} placeholder="AR" style={{ textTransform: 'uppercase' }} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Bandera</label>
                  <input name="flag" className="cms-input" value={form.flag} onChange={handleChange} placeholder="🇦🇷" style={{ fontSize: 20, textAlign: 'center' }} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Estado</label>
                  <select name="estado" className="cms-select" value={form.estado} onChange={handleChange}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Branding text */}
            <div className="cms-card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionTitle>Texto público</SectionTitle>

              <div className="cms-field">
                <label className="cms-label">Tagline</label>
                <input name="tagline" className="cms-input" value={form.tagline} onChange={handleChange} placeholder="Argentina Comparte" />
                <span className="cms-hint">Aparece en el encabezado del sitio público.</span>
              </div>

              <div className="cms-field">
                <label className="cms-label">Descripción pública</label>
                <textarea name="descripcion_publica" className="cms-textarea" value={form.descripcion_publica} onChange={handleChange} rows={3} placeholder="Conectamos comunidades argentinas para construir un futuro más justo y solidario." />
              </div>

              <div className="cms-field">
                <label className="cms-label">Valores (palabras clave)</label>
                <ValoresTags value={form.valores} onChange={v => setForm(f => ({ ...f, valores: v }))} />
                <span className="cms-hint">Aparecen como etiquetas en la tarjeta del país.</span>
              </div>
            </div>

            {/* Colors */}
            <div className="cms-card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionTitle>Paleta de colores</SectionTitle>
              <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: -8 }}>
                Estos colores generan automáticamente los fondos, gradientes y acentos del sitio del país.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <ColorPicker label="Color primario" name="color_primario" value={form.color_primario} onChange={handleChange} />
                <ColorPicker label="Color secundario" name="color_secundario" value={form.color_secundario} onChange={handleChange} />
                <ColorPicker label="Color acento" name="color_acento" value={form.color_acento} onChange={handleChange} />
                <ColorPicker label="Color oscuro (fondos)" name="color_oscuro" value={form.color_oscuro} onChange={handleChange} />
              </div>
            </div>

            {/* Logo */}
            <div className="cms-card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionTitle>Logo del país</SectionTitle>

              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Preview */}
                <div
                  onClick={() => logoInputRef.current?.click()}
                  style={{
                    width: 120, height: 120, borderRadius: 16, flexShrink: 0,
                    border: '2px dashed var(--line)',
                    background: form._logoPreview ? '#000' : 'var(--bg-panel,#18181c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
                >
                  {form._logoPreview ? (
                    <img src={form._logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--ink-3)' }}>
                      <div style={{ fontSize: 28, marginBottom: 4 }}>🖼</div>
                      <div style={{ fontSize: 10.5, fontWeight: 600 }}>Clic para subir</div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                    Sube el logo SVG o PNG del país. Se mostrará en la tarjeta, el encabezado y el pie de página del sitio público.
                  </p>
                  <input ref={logoInputRef} type="file" accept="image/*,.svg" style={{ display: 'none' }} onChange={handleLogoChange} />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => logoInputRef.current?.click()} className="cms-btn-ghost" style={{ fontSize: 13 }}>
                      Elegir archivo
                    </button>
                    {logoFile && isEdit && (
                      <button type="button" onClick={handleLogoUpload} disabled={logoUploading} className="cms-btn-primary" style={{ fontSize: 13, height: 36 }}>
                        {logoUploading ? 'Subiendo…' : 'Subir logo'}
                      </button>
                    )}
                  </div>
                  {logoFile && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{logoFile.name}</span>}
                  {logoSuccess && <span style={{ fontSize: 12, color: 'var(--green,#16a34a)', fontWeight: 600 }}>✓ Logo subido correctamente</span>}
                  {!isEdit && logoFile && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>El logo se subirá al guardar el país.</span>}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(216,51,74,.25)', color: 'var(--red)', fontSize: 13, padding: '12px 16px', borderRadius: 10 }}>{error}</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => navigate('/countries')} className="cms-btn-ghost">Cancelar</button>
              <button type="submit" form="country-form" disabled={loading} className="cms-btn-primary" style={{ height: 40, minWidth: 140 }}>
                {loading ? 'Guardando…' : isEdit ? 'Actualizar país' : 'Crear país'}
              </button>
            </div>
          </div>

          {/* ── Right: live preview ────────────────────────────────────────── */}
          <PreviewCard form={form} />
        </div>
      </form>
    </Layout>
  )
}
