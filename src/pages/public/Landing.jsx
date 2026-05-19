import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getPublicCountries } from '../../api/public'
import ChatWidget from '../../chat/components/ChatWidget'

export default function Landing() {
  const [countries, setCountries] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getPublicCountries()
      .then(r => setCountries(r.data?.data || r.data || []))
      .catch(() => {})
  }, [])

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(30,10,50,0.35)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0 40px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.3px' }}>
          Latinoamérica Comparte
        </span>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 10,
            padding: '0 18px',
            height: 38,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'background .15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
        >
          CMS Login
        </button>
      </header>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #7B2D8B 0%, #E63B6F 55%, #F47C3C 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          top: -100, left: -120, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
          bottom: -80, right: -60, pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.18)',
          borderRadius: 999,
          padding: '6px 18px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: '#fff',
          marginBottom: 28,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}>
          CMS público multipais
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: 20,
          letterSpacing: '-1px',
          textShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          UN PROPÓSITO QUE<br />NACIÓ DE COLOMBIA
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'rgba(255,255,255,0.85)',
          fontWeight: 600,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          marginBottom: 52,
        }}>
          HOY INSPIRA A TODA LATINOAMÉRICA
        </p>

        {/* Country circles */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}>
          {countries.map(c => (
            <Link
              key={c.id}
              to={`/${c.slug}/noticias`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform .2s, box-shadow .2s',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)' }}
              >
                <span style={{ fontWeight: 900, fontSize: 22, color: 'var(--purple)', lineHeight: 1 }}>
                  {c.codigo}
                </span>
                <span style={{ fontWeight: 600, fontSize: 11.5, color: 'var(--purple)', marginTop: 4, textAlign: 'center', padding: '0 8px' }}>
                  {c.nombre}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p style={{
          maxWidth: 600,
          color: 'rgba(255,255,255,0.8)',
          fontSize: 16,
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          Una red que une personas, empresas y comunidades para construir una región más humana, productiva y consciente.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          {countries[0] && (
            <Link
              to={`/${countries[0].slug}/noticias`}
              style={{
                background: '#fff',
                color: 'var(--purple)',
                borderRadius: 12,
                padding: '0 28px',
                height: 48,
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                transition: 'transform .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Ver noticias
            </Link>
          )}
          {countries[0] && (
            <Link
              to={`/${countries[0].slug}/solicitudes`}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: 12,
                padding: '0 28px',
                height: 48,
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              Enviar solicitud
            </Link>
          )}
        </div>
      </section>

      <ChatWidget />
    </div>
  )
}