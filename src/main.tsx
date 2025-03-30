import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './auth/context/auth-context'
import { App } from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
