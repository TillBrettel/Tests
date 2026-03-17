import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

const LANGS = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
]

const TXT = {
  de: { login: 'Einloggen', email: 'E-Mail', password: 'Passwort', loggingIn: 'Einloggen...', loginError: 'E-Mail oder Passwort falsch.', partnerAccess: 'Partner Login', partnerSub: 'Exklusiver Zugang für Parture Design Partner' },
  en: { login: 'Login', email: 'Email', password: 'Password', loggingIn: 'Logging in...', loginError: 'Incorrect email or password.', partnerAccess: 'Partner Login', partnerSub: 'Exclusive access for Parture Design partners' },
  es: { login: 'Entrar', email: 'Correo', password: 'Contraseña', loggingIn: 'Entrando...', loginError: 'Correo o contraseña incorrectos.', partnerAccess: 'Acceso Partner', partnerSub: 'Acceso exclusivo para socios de Parture Design' },
  it: { login: 'Accedi', email: 'Email', password: 'Password', loggingIn: 'Accesso...', loginError: 'Email o password errati.', partnerAccess: 'Accesso Partner', partnerSub: 'Accesso esclusivo per i partner Parture Design' },
}

// ── Image imports (place your images in /public/images/ or use URLs) ──
// Update these paths to match where your images are hosted
const IMG = {
  bg1: '/images/backgroundImage_1.jpeg',
  bg2: '/images/backgroundImage_2.jpeg',
  bg6: '/images/backgroundImage_6.jpeg',
  logo: '/images/value_0.jpeg',
  ex1: '/images/value_3.png',
  ex2: '/images/value_4.png',
  ex3: '/images/value_5.png',
}

export default function LandingPage({ lang, setLang }) {
  const t = TXT[lang] || TXT.de
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError(t.loginError); return }
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    // On success → main.jsx automatically switches to BuilderPage
    if (err) setError(t.loginError)
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0a0a0a', color: '#c8bfa8', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ ...nav.bar, background: scrolled ? 'rgba(10,10,10,0.97)' : 'linear-gradient(180deg,rgba(0,0,0,0.85),transparent)', borderBottom: scrolled ? '1px solid rgba(184,150,46,0.15)' : 'none' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 600, color: '#b8962e', letterSpacing: 4, textTransform: 'uppercase' }}>Parture Design</span>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['about', 'companies', 'examples', 'partner', 'login'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={nav.link}
              onMouseEnter={e => e.target.style.color = '#b8962e'}
              onMouseLeave={e => e.target.style.color = '#c8bfa8'}>
              {id}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              style={{ ...nav.langBtn, ...(lang === l.code ? nav.langActive : {}) }}>
              {l.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG.bg1}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(.32) sepia(.25)', transform: 'scale(1.06)', animation: 'hz 20s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(184,150,46,.1) 0%,transparent 60%),linear-gradient(180deg,transparent 40%,#0a0a0a 100%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
          <img src={IMG.logo} alt="Parture Design" style={{ width: 'min(380px,72vw)', marginBottom: 24, filter: 'drop-shadow(0 0 50px rgba(184,150,46,.35))', animation: 'fi 1.4s ease forwards' }} />
          <div style={{ fontSize: 11, letterSpacing: 6, textTransform: 'uppercase', color: '#b8962e', marginBottom: 18, animation: 'fu 1s ease .5s both' }}>SaaS Web Agency</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(44px,8vw,100px)', fontWeight: 300, lineHeight: .95, color: '#fff', letterSpacing: -2, animation: 'fu 1s ease .8s both', margin: 0 }}>
            Where Local<br />Business<br /><em style={{ fontStyle: 'italic', color: '#d4aa50' }}>Goes Online.</em>
          </h1>
          <p style={{ marginTop: 24, fontSize: 15, color: '#c8bfa8', maxWidth: 440, lineHeight: 1.8, animation: 'fu 1s ease 1.1s both' }}>
            Professional websites in hours, not weeks — affordable, modern, built for growth.
          </p>
          <button onClick={() => scrollTo('about')} style={{ ...btn.outline, marginTop: 40, animation: 'fu 1s ease 1.4s both' }}>
            Discover Our Mission →
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(184,150,46,.7)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', animation: 'fi 1s ease 2s both' }}>
          <div style={{ width: 1, height: 34, background: 'linear-gradient(#b8962e,transparent)', animation: 'sp 2s ease-in-out infinite' }} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ borderTop: '1px solid rgba(184,150,46,.15)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <SLabel>Who We Are</SLabel>
            <STitle>A New Era for <em style={{ fontStyle: 'italic', color: '#d4aa50' }}>Local Business</em></STitle>
            <GBar />
            <p style={{ ...body, fontFamily: 'Georgia,serif', fontSize: 20, fontStyle: 'italic', color: 'rgba(255,255,255,.82)', marginBottom: 22 }}>
              We are a modern SaaS Agency focused on helping local businesses build a strong online presence quickly and affordably.
            </p>
            <p style={body}>Many small companies still struggle with outdated websites, expensive agencies, or complicated technology. Our goal is to change that — making websites simple, fast, and accessible for everyone.</p>
            <p style={body}>Using our custom website builder, we create high-quality websites in just a few hours. Our mission: to make websites accessible to every local business while building a global network of entrepreneurs who grow together through technology.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginTop: 40, border: '1px solid rgba(184,150,46,.18)' }}>
              {[['3h', 'Avg. Build Time'], ['100%', 'Mobile Ready'], ['∞', 'Scale Potential'], ['50%', 'Partner Revenue']].map(([n, l]) => (
                <div key={l} style={{ padding: 26, background: '#111' }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 44, fontWeight: 300, color: '#b8962e', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#c8bfa8', marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
              <img src={IMG.bg2} alt="Vision" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(.15) brightness(.8)' }} />
              <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(184,150,46,.28)', pointerEvents: 'none' }} />
            </div>
            <div style={{ position: 'absolute', top: -14, right: -14, width: 52, height: 52, borderTop: '2px solid #b8962e', borderRight: '2px solid #b8962e' }} />
          </div>
        </div>
      </section>

      {/* ── FOR COMPANIES ── */}
      <section id="companies">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '70vh' }}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={IMG.bg1} alt="For Companies" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.45) sepia(.15)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 50%,#111 100%)' }} />
          </div>
          <div style={{ background: '#111', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid rgba(184,150,46,.12)' }}>
            <SLabel>For Businesses</SLabel>
            <STitle>Your Business<br /><em style={{ fontStyle: 'italic', color: '#d4aa50' }}>Deserves</em><br />to Be Found.</STitle>
            <GBar />
            <p style={body}>Today, a strong online presence is essential. Many customers search online before visiting a store, restaurant, or service. Without a website, you risk losing potential clients.</p>
            <p style={body}>At Parture Design, we create professional and affordable websites for local businesses — modern, mobile-friendly, designed to clearly present your business and services.</p>
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid rgba(184,150,46,.18)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['✉', 'Parturedesign@gmail.com'], ['◎', '@Parturedesign on Instagram']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#f0e0b0' }}>
                  <div style={{ width: 28, height: 28, border: '1px solid rgba(184,150,46,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <a href="https://www.instagram.com/parturedesign" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#b8962e', textDecoration: 'none', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginTop: 20 }}>
              ◎ Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── EXAMPLES ── */}
      <section id="examples" style={{ borderTop: '1px solid rgba(184,150,46,.15)' }}>
        <div style={wrap}>
          <SLabel>Our Work</SLabel>
          <STitle>Client <em style={{ fontStyle: 'italic', color: '#d4aa50' }}>Examples</em></STitle>
          <GBar />
          <p style={{ ...body, maxWidth: 460, marginBottom: 56 }}>Real websites built for real businesses — each crafted efficiently using our system.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 }}>
            {[[IMG.ex1, 'Restaurant — King Döner'], [IMG.ex2, 'Nutrition — Mirian Nutrition'], [IMG.ex3, 'Family Page — Brettel Familie']].map(([src, label]) => (
              <ExCard key={label} src={src} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER ── */}
      <section id="partner" style={{ background: '#111', borderTop: '1px solid rgba(184,150,46,.15)', borderBottom: '1px solid rgba(184,150,46,.15)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
          <div>
            <SLabel>Opportunity</SLabel>
            <STitle>Become a <em style={{ fontStyle: 'italic', color: '#d4aa50' }}>Partner</em></STitle>
            <GBar />
            <p style={body}>Join Parture Design and start earning by helping local businesses get online. Use our website builder, templates, and sales system — earning a share of every sale you deliver.</p>
          </div>
          <div>
            {[['01', 'Contact Us', 'Reach out via Email or Instagram to start your partner journey.'],
              ['02', 'Get Access', 'Receive our builder, full template library, and sales guides.'],
              ['03', 'Find Clients', 'Connect with businesses in your area and build websites in hours.'],
              ['04', 'Earn Revenue', 'Collect your share of every website via profit-sharing.']].map(([n, title, desc]) => (
                <div key={n} style={{ display: 'flex', gap: 24, padding: '24px 0', borderBottom: '1px solid rgba(184,150,46,.1)' }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 40, fontWeight: 300, color: 'rgba(184,150,46,.22)', lineHeight: 1, flexShrink: 0, width: 50 }}>{n}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: '#fff', marginBottom: 5 }}>{title}</strong>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: '#c8bfa8', margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            <div style={{ background: '#1a1a1a', border: '1px solid rgba(184,150,46,.2)', padding: 40, marginTop: 40 }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 300, color: '#fff', marginBottom: 10, marginTop: 0 }}>Ready to Start?</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#c8bfa8', marginBottom: 24 }}>We provide all tools and guidance — you focus on selling and supporting clients.</p>
              <a href="mailto:Parturedesign@gmail.com" style={btn.gold}>Contact Us Today →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGIN ── */}
      <section id="login" style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG.bg6}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(.22) sepia(.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(184,150,46,.07) 0%,transparent 65%)' }} />
        <div style={{ position: 'relative', background: 'rgba(8,8,8,.9)', border: '1px solid rgba(184,150,46,.22)', padding: '52px 56px', textAlign: 'center', maxWidth: 440, width: '90%', backdropFilter: 'blur(20px)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#b8962e,#8a6e20)', color: '#000', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', letterSpacing: 1 }}>PD</div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 36, fontWeight: 300, color: '#fff', marginBottom: 6, marginTop: 0 }}>{t.partnerAccess}</h2>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 32, letterSpacing: .3 }}>{t.partnerSub}</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ color: '#bbb', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t.email}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="partner@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#b8962e'}
                onBlur={e => e.target.style.borderColor = 'rgba(184,150,46,.2)'} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ color: '#bbb', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t.password}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#b8962e'}
                onBlur={e => e.target.style.borderColor = 'rgba(184,150,46,.2)'} required />
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#fca5a5', padding: '10px 14px', fontSize: 13, borderRadius: 2 }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ ...btn.gold, width: '100%', justifyContent: 'center', opacity: loading ? .6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
              {loading ? t.loggingIn : t.login}
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(184,150,46,.14)', padding: '56px 56px 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 52 }}>
        <div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 300, color: '#b8962e', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>Parture Design</div>
          <p style={{ fontSize: 13, color: '#c8bfa8', lineHeight: 1.85, maxWidth: 240 }}>Making professional websites accessible to every local business — fast, affordable, built to grow.</p>
          <a href="https://www.instagram.com/parturedesign" target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#b8962e', textDecoration: 'none', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginTop: 20 }}>
            ◎ @parturedesign
          </a>
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#b8962e', marginBottom: 20 }}>Navigate</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['about', 'companies', 'examples', 'partner', 'login'].map(id => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: 'none', border: 'none', color: '#c8bfa8', fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', textTransform: 'capitalize', padding: 0, transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = '#b8962e'}
                onMouseLeave={e => e.target.style.color = '#c8bfa8'}>
                {id}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#b8962e', marginBottom: 20 }}>Contact</div>
          <p style={{ fontSize: 13, color: '#c8bfa8', marginBottom: 8 }}>Email: <a href="mailto:Parturedesign@gmail.com" style={{ color: '#f0e0b0', textDecoration: 'none' }}>Parturedesign@gmail.com</a></p>
          <p style={{ fontSize: 13, color: '#c8bfa8' }}>Instagram: <a href="https://www.instagram.com/parturedesign" target="_blank" rel="noreferrer" style={{ color: '#f0e0b0', textDecoration: 'none' }}>@Parturedesign</a></p>
        </div>
        <div style={{ gridColumn: '1/-1', marginTop: 40, borderTop: '1px solid rgba(184,150,46,.1)', padding: '18px 0', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(200,191,168,.35)' }}>
          <span>© 2025 Parture Design. All rights reserved.</span>
          <span>Professional websites for local businesses.</span>
        </div>
      </footer>

      <style>{`
        @keyframes hz { from { transform: scale(1.06) } to { transform: scale(1.13) } }
        @keyframes fu { from { opacity: 0; transform: translateY(26px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fi { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sp { 0%,100% { opacity:1 } 50% { opacity:.3 } }
        * { box-sizing: border-box }
        body { margin: 0 }
      `}</style>
    </div>
  )
}

function ExCard({ src, label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <img src={src} alt={label} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'top', filter: hovered ? 'brightness(.92)' : 'brightness(.72)', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'all .55s ease', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(0,0,0,.82) 100%)', display: 'flex', alignItems: 'flex-end', padding: 24, opacity: hovered ? 1 : 0, transition: 'opacity .4s' }}>
        <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#f0e0b0' }}>{label}</span>
      </div>
    </div>
  )
}

function SLabel({ children }) {
  return <div style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: '#b8962e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>
}
function STitle({ children }) {
  return <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: 0, marginTop: 0 }}>{children}</h2>
}
function GBar() {
  return <div style={{ width: 56, height: 2, background: 'linear-gradient(90deg,#b8962e,transparent)', margin: '20px 0 28px' }} />
}

const wrap = { maxWidth: 1280, margin: '0 auto', padding: '100px 56px' }
const body = { fontSize: 15, lineHeight: 1.95, color: '#c8bfa8', marginBottom: 16 }
const inputStyle = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(184,150,46,.2)', color: '#fff', padding: '12px 14px', fontSize: 14, outline: 'none', width: '100%', borderRadius: 2, fontFamily: 'inherit', transition: 'border-color .2s' }
const nav = {
  bar: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 56px', backdropFilter: 'blur(4px)', transition: 'background .4s, border-bottom .4s' },
  link: { background: 'none', border: 'none', color: '#c8bfa8', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'color .2s', padding: 0 },
  langBtn: { background: 'none', border: '1px solid rgba(255,255,255,.1)', color: '#777', padding: '4px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 },
  langActive: { borderColor: '#b8962e', color: '#b8962e' },
}
const btn = {
  outline: { background: 'none', border: '1px solid #b8962e', color: '#b8962e', padding: '14px 36px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer', transition: 'all .3s', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 },
  gold: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: '#b8962e', color: '#0a0a0a', textDecoration: 'none', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, transition: 'all .3s', border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
}
