import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // AuthContext will handle the redirect via onAuthStateChange

      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Bestätigungs-E-Mail wurde gesendet. Bitte überprüfe dein Postfach.')

      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setMessage('Passwort-Reset-Link wurde an deine E-Mail gesendet.')
      }
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Syne', sans-serif",
      padding: '20px',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(184,150,46,0.07) 0%, transparent 65%)',
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(12,12,12,0.95)',
        border: '1px solid rgba(184,150,46,0.22)',
        padding: '52px 48px',
        backdropFilter: 'blur(24px)',
      }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: 300,
            color: '#b8962e',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Parture Design
          </div>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, #b8962e, transparent)', margin: '0 auto 16px' }} />
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '32px',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: '1px',
            margin: 0,
          }}>
            {mode === 'login' && 'Willkommen'}
            {mode === 'register' && 'Registrieren'}
            {mode === 'reset' && 'Passwort zurücksetzen'}
          </h1>
          <p style={{ fontSize: '12px', color: '#c8bfa8', marginTop: '6px', letterSpacing: '1px' }}>
            {mode === 'login' && 'Partner & Client Zugang'}
            {mode === 'register' && 'Konto erstellen'}
            {mode === 'reset' && 'Link per E-Mail erhalten'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="deine@email.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#b8962e'}
              onBlur={e => e.target.style.borderColor = 'rgba(184,150,46,0.2)'}
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label style={labelStyle}>Passwort</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#b8962e'}
                onBlur={e => e.target.style.borderColor = 'rgba(184,150,46,0.2)'}
              />
            </div>
          )}

          {/* Error / Success messages */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              color: '#fca5a5',
              fontSize: '13px',
              lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(184,150,46,0.08)',
              border: '1px solid rgba(184,150,46,0.25)',
              color: '#f0e0b0',
              fontSize: '13px',
              lineHeight: 1.5,
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '15px',
              background: loading ? 'rgba(184,150,46,0.5)' : '#b8962e',
              color: '#0a0a0a',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Syne', sans-serif",
              fontSize: '11px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: 700,
              transition: 'background 0.3s',
            }}
          >
            {loading ? 'Laden...' : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : 'Link senden'}
          </button>
        </form>

        {/* Mode switcher */}
        <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' }}>
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('reset'); setError(''); setMessage('') }} style={linkBtnStyle}>
                Passwort vergessen?
              </button>
              <button onClick={() => { setMode('register'); setError(''); setMessage('') }} style={linkBtnStyle}>
                Noch kein Konto? <span style={{ color: '#b8962e' }}>Registrieren →</span>
              </button>
            </>
          )}
          {(mode === 'register' || mode === 'reset') && (
            <button onClick={() => { setMode('login'); setError(''); setMessage('') }} style={linkBtnStyle}>
              ← Zurück zum Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#c8bfa8',
  marginBottom: '8px',
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(184,150,46,0.2)',
  color: '#ffffff',
  padding: '13px 16px',
  fontFamily: "'Syne', sans-serif",
  fontSize: '14px',
  letterSpacing: '0.5px',
  outline: 'none',
  transition: 'border-color 0.3s',
  boxSizing: 'border-box',
}

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#c8bfa8',
  fontSize: '12px',
  cursor: 'pointer',
  letterSpacing: '0.5px',
  padding: 0,
}
