import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from '@/components/ProtectedRoute'

// ─── Placeholder Dashboard (ersetze mit deinen echten Seiten) ───
function Dashboard() {
  const { user, signOut } = useAuth()
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#c8bfa8',
      fontFamily: 'Syne, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    }}>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '32px',
        color: '#b8962e',
        letterSpacing: '4px',
        textTransform: 'uppercase',
      }}>
        Parture Design
      </div>
      <p style={{ fontSize: '14px', letterSpacing: '1px' }}>
        Angemeldet als: <span style={{ color: '#f0e0b0' }}>{user?.email}</span>
      </p>
      <button
        onClick={signOut}
        style={{
          padding: '12px 32px',
          background: 'transparent',
          border: '1px solid rgba(184,150,46,0.3)',
          color: '#b8962e',
          cursor: 'pointer',
          fontFamily: 'Syne, sans-serif',
          fontSize: '11px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          transition: 'all 0.3s',
        }}
        onMouseEnter={e => { e.target.style.background = '#b8962e'; e.target.style.color = '#0a0a0a' }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#b8962e' }}
      >
        Abmelden
      </button>
    </div>
  )
}

// ─── Redirect logged-in users away from /login ───
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          {/* Standardmäßig zu /login weiterleiten */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
