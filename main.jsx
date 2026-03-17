import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import LoginPage from '@/pages/LoginPage'
import BuilderPage from '@/pages/BuilderPage'

function App() {
  const { user, loading } = useAuth()
  const [lang, setLang] = useState('de')

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8962e', fontSize: 13, letterSpacing: 3, fontFamily: 'system-ui' }}>
        LOADING...
      </div>
    )
  }

  return user
    ? <BuilderPage lang={lang} setLang={setLang} />
    : <LoginPage lang={lang} setLang={setLang} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(184,150,46,0.3)', borderRadius: 3, fontSize: 13 },
          success: { iconTheme: { primary: '#b8962e', secondary: '#0a0a0a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>
)
