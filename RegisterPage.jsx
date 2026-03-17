import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwörter stimmen nicht überein.')
      return
    }
    if (password.length < 6) {
      toast.error('Passwort muss mindestens 6 Zeichen haben.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Registrierung erfolgreich! Bitte bestätige deine E-Mail.')
      navigate('/login')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>PD</div>
          <h1 style={styles.title}>Konto erstellen</h1>
          <p style={styles.subtitle}>Parture Design Partner-Zugang</p>
        </div>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>E-Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.com" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Passwort</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Passwort bestätigen</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••" style={styles.input} required />
          </div>
          <button type="submit" style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} disabled={loading}>
            {loading ? 'Registrieren...' : 'Registrieren'}
          </button>
        </form>

        <div style={styles.links}>
          <span style={{ color: '#666', fontSize: 13 }}>Bereits ein Konto?</span>
          <Link to="/login" style={styles.link}>Einloggen</Link>
        </div>
      </div>
    </div>
  )
}

const gold = '#b8962e'
const dark = '#0a0a0a'

const styles = {
  page: { minHeight: '100vh', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  card: { background: '#111', border: '1px solid rgba(184,150,46,0.25)', borderRadius: 4, padding: '48px 40px', width: '100%', maxWidth: 420 },
  header: { textAlign: 'center', marginBottom: 36 },
  logo: { width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, #8a6e20)`, color: dark, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', letterSpacing: 1 },
  title: { color: '#fff', fontSize: 22, fontWeight: 600, margin: '0 0 6px', letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 13, margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#bbb', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,150,46,0.2)', borderRadius: 2, color: '#fff', padding: '12px 14px', fontSize: 14, outline: 'none', width: '100%' },
  btn: { marginTop: 8, padding: '14px', background: gold, color: dark, border: 'none', borderRadius: 2, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', width: '100%' },
  links: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 },
  link: { color: gold, fontSize: 13, textDecoration: 'none' },
}
