import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useT } from '@/lib/i18n'

const LANGS = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
]

export default function LoginPage({ lang, setLang }) {
  const t = useT(lang)
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError(t.loginError); return }
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) setError(t.loginError)
  }

  return (
    <div style={s.page}>
      {/* Language switcher */}
      <div style={s.langBar}>
        {LANGS.map(l => (
          <button key={l.code} onClick={() => setLang(l.code)}
            style={{ ...s.langBtn, ...(lang === l.code ? s.langActive : {}) }}>
            {l.label}
          </button>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.logo}>PD</div>
        <h1 style={s.title}>{t.loginTitle}</h1>
        <p style={s.sub}>{t.loginSub}</p>

        <form onSubmit={handleLogin} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="partner@email.com" style={s.input} required
              onFocus={e => e.target.style.borderColor = '#b8962e'}
              onBlur={e => e.target.style.borderColor = 'rgba(184,150,46,0.2)'}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>{t.password}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" style={s.input} required
              onFocus={e => e.target.style.borderColor = '#b8962e'}
              onBlur={e => e.target.style.borderColor = 'rgba(184,150,46,0.2)'}
            />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ ...s.btn, ...(loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
            {loading ? t.loggingIn : t.login}
          </button>
        </form>
      </div>
    </div>
  )
}

const gold = '#b8962e'
const s = {
  page: { minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative' },
  langBar: { position: 'absolute', top: 20, right: 24, display: 'flex', gap: 4 },
  langBtn: { background: 'none', border: '1px solid rgba(184,150,46,0.2)', color: '#888', padding: '4px 10px', fontSize: 11, letterSpacing: 1, cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit' },
  langActive: { borderColor: gold, color: gold },
  card: { background: '#111', border: '1px solid rgba(184,150,46,0.25)', padding: '52px 44px', width: '100%', maxWidth: 420, textAlign: 'center' },
  logo: { width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, #8a6e20)`, color: '#0a0a0a', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', letterSpacing: 1 },
  title: { color: '#fff', fontSize: 22, fontWeight: 600, margin: '0 0 6px', letterSpacing: 1 },
  sub: { color: '#777', fontSize: 13, margin: '0 0 32px', letterSpacing: 0.3 },
  form: { display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { color: '#bbb', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,150,46,0.2)', color: '#fff', padding: '12px 14px', fontSize: 14, outline: 'none', width: '100%', fontFamily: 'inherit', transition: 'border-color .2s', borderRadius: 2 },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', fontSize: 13, borderRadius: 2 },
  btn: { padding: '14px', background: gold, color: '#0a0a0a', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer', transition: 'background .2s', fontFamily: 'inherit', marginTop: 4, borderRadius: 2 },
}
