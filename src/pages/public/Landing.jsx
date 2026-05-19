import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COUNTRY_LIST } from '../../config/countries'
import ChatWidget from '../../chat/components/ChatWidget'

const B = { pink: '#E8305A', orange: '#F47B3E', purple: '#7B2D8B', cyan: '#3AB8D4' }

function CirclesDecor() {
  const items = [
    { s: 14, x: '8%',  y: '18%', c: B.pink,   o: 0.5 },
    { s: 10, x: '20%', y: '10%', c: B.orange,  o: 0.4 },
    { s: 18, x: '5%',  y: '40%', c: B.cyan,    o: 0.3 },
    { s: 12, x: '28%', y: '7%',  c: B.purple,  o: 0.4 },
    { s: 8,  x: '70%', y: '14%', c: B.pink,    o: 0.35 },
    { s: 16, x: '82%', y: '22%', c: B.orange,  o: 0.4 },
    { s: 10, x: '90%', y: '10%', c: B.cyan,    o: 0.3 },
    { s: 14, x: '63%', y: '32%', c: B.purple,  o: 0.3 },
    { s: 20, x: '92%', y: '62%', c: B.pink,    o: 0.18 },
    { s: 12, x: '4%',  y: '72%', c: B.orange,  o: 0.22 },
    { s: 9,  x: '48%', y: '6%',  c: B.cyan,    o: 0.3 },
    { s: 11, x: '55%', y: '88%', c: B.purple,  o: 0.2 },
  ]
  return (
    <>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'absolute', left: it.x, top: it.y,
          width: it.s, height: it.s, borderRadius: '50%',
          border: `2px solid ${it.c}`, opacity: it.o, pointerEvents: 'none',
        }} />
      ))}
    </>
  )
}

function CountryCard({ country }) {
  const [hovered, setHovered]   = useState(false)
  const [linkHov, setLinkHov]   = useState(null)

  const links = [
    { key: 'news', label: 'Noticias',    path: `/${country.slug}/noticias`,    icon: '📰' },
    { key: 'test', label: 'Testimonios', path: `/${country.slug}/testimonios`, icon: '💬' },
    { key: 'cont', label: 'Contáctanos', path: `/${country.slug}/solicitudes`, icon: '✉️', primary: true },
  ]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 300px', maxWidth: 400,
        borderRadius: 28,
        background: country.cardBg,
        border: `1px solid ${hovered ? country.accent + '50' : 'rgba(255,255,255,0.07)'}`,
        overflow: 'hidden',
        transition: 'transform 0.38s cubic-bezier(.22,.68,0,1.2), box-shadow 0.38s ease, border-color 0.2s',
        transform: hovered ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${country.accent}30, inset 0 1px 0 rgba(255,255,255,0.08)`
          : '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* top bar */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${country.c1}, ${country.c2}, ${country.c3})`,
        opacity: hovered ? 1 : 0.6, transition: 'opacity 0.2s',
      }} />

      <div style={{ padding: '36px 32px 30px' }}>

        {/* Logo image */}
        <div style={{
          width: 130, height: 130,
          marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}>
          <img
            src={country.logo}
            alt={country.tagline}
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}
          />
        </div>

        {/* Name */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.1 }}>
            {country.name}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: country.accent, textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.1 }}>
            COMPARTE
          </div>
        </div>

        <div style={{ width: 40, height: 3, borderRadius: 99, background: `linear-gradient(90deg,${country.c1},${country.c2})`, margin: '14px 0' }} />

        <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 13.5, lineHeight: 1.72, marginBottom: 24 }}>
          {country.desc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {links.map(lnk => (
            <Link
              key={lnk.key}
              to={lnk.path}
              onMouseEnter={() => setLinkHov(lnk.key)}
              onMouseLeave={() => setLinkHov(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 15px', borderRadius: 12,
                textDecoration: 'none', fontSize: 13.5, fontWeight: 600,
                transition: 'all 0.15s ease',
                ...(lnk.primary ? {
                  background: linkHov === lnk.key ? country.accent : `${country.accent}1a`,
                  border: `1px solid ${country.accent}55`,
                  color: linkHov === lnk.key ? '#111' : country.accent,
                } : {
                  background: linkHov === lnk.key ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: linkHov === lnk.key ? '#fff' : 'rgba(255,255,255,0.72)',
                }),
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{lnk.icon}</span>
                {lnk.label}
              </span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate  = useNavigate()
  const [btnHov, setBtnHov] = useState(false)

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ══ HEADER ══ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(8,4,18,0.7)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {[B.pink, B.orange, B.purple, B.cyan].map((c, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.9 }} />
            ))}
          </div>
          <span style={{ fontWeight: 800, fontSize: 15.5, color: '#fff', letterSpacing: '-0.2px' }}>
            Latinoamérica Comparte
          </span>
        </div>
        <button
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          onClick={() => navigate('/login')}
          style={{
            background: btnHov ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.09)',
            color: '#fff', border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 10, padding: '0 18px', height: 36,
            fontWeight: 700, fontSize: 12.5, cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          CMS Login
        </button>
      </header>

      {/* ══ HERO ══ */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6b2580 0%, #c42c5a 42%, #e8612a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 24px 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        <CirclesDecor />
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -200, left: -240, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -120, right: -100, pointerEvents: 'none' }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999, padding: '7px 22px', marginBottom: 40,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {COUNTRY_LIST.map(c => <span key={c.slug} style={{ fontSize: 15 }}>{c.flag}</span>)}
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>
            CMS Público Multipais
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 7vw, 5.4rem)',
          fontWeight: 900, color: '#fff', lineHeight: 1.04,
          letterSpacing: '-2px', marginBottom: 18,
          textShadow: '0 4px 32px rgba(0,0,0,0.2)', maxWidth: 920,
        }}>
          UN PROPÓSITO QUE<br />NACIÓ DE COLOMBIA
        </h1>

        <p style={{ fontSize: 'clamp(0.85rem,2.2vw,1.1rem)', color: 'rgba(255,255,255,0.82)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 22 }}>
          HOY INSPIRA A TODA LATINOAMÉRICA
        </p>

        <p style={{ maxWidth: 520, color: 'rgba(255,255,255,0.68)', fontSize: 15.5, lineHeight: 1.78, marginBottom: 52 }}>
          Una red que une personas, empresas y comunidades para construir una región más humana, productiva y consciente.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {COUNTRY_LIST.map(c => (
            <Link key={c.slug} to={`/${c.slug}/noticias`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '9px 22px', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'background 0.15s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <span style={{ fontSize: 17 }}>{c.flag}</span>
              {c.name}
            </Link>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.45 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Explorar</span>
          <div style={{ width: 1, height: 38, background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)' }} />
        </div>
      </section>

      {/* ══ COUNTRIES ══ */}
      <section style={{ background: '#09080f', padding: '96px 40px 104px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 450, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(123,45,139,0.13) 0%, transparent 68%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', gap: 6, marginBottom: 18, alignItems: 'center' }}>
            {[B.pink, B.orange, B.purple, B.cyan].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 14 }}>
            Elige tu país
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 15, maxWidth: 400, margin: '0 auto', lineHeight: 1.65 }}>
            Accede a noticias, testimonios y más contenido de cada comunidad
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1280, margin: '0 auto' }}>
          {COUNTRY_LIST.map(c => <CountryCard key={c.slug} country={c} />)}
        </div>
      </section>

      {/* ══ MISSION ══ */}
      <section style={{ background: '#fff', padding: '96px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', background: `linear-gradient(90deg,${B.pink},${B.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 20 }}>
            Nuestra misión
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 22 }}>
            Compartir es la fuerza<br />que transforma regiones
          </h2>
          <p style={{ fontSize: 16.5, color: '#545454', lineHeight: 1.82, maxWidth: 640, margin: '0 auto 60px' }}>
            Latinoamérica Comparte nació en Colombia con la convicción de que la solidaridad, la colaboración y el propósito compartido pueden transformar comunidades. Hoy expandimos ese espíritu a Argentina, Chile y Ecuador.
          </p>
          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 720, margin: '0 auto' }}>
            {[
              { label: 'Comunidad', color: B.pink,   icon: '🤝' },
              { label: 'Propósito', color: B.orange, icon: '🎯' },
              { label: 'Transparencia', color: B.purple, icon: '🌟' },
              { label: 'Impacto',    color: B.cyan,  icon: '🌱' },
            ].map(v => (
              <div key={v.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: '1 1 130px' }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: v.color + '14', border: `2px solid ${v.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                  {v.icon}
                </div>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1a1a1a' }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#06050c', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {[B.pink, B.orange, B.purple, B.cyan].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.65 }} />
            ))}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12.5, fontWeight: 600 }}>
            Latinoamérica Comparte © {new Date().getFullYear()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {COUNTRY_LIST.map(c => (
            <Link key={c.slug} to={`/${c.slug}/noticias`}
              style={{ color: 'rgba(255,255,255,0.32)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = c.accent}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.32)'}
            >
              {c.flag} {c.name}
            </Link>
          ))}
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}
