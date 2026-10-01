import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { NotifyProvider } from './components/Notifications.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotifyProvider>
        <App />
      </NotifyProvider>
    </AuthProvider>
  </StrictMode>,
)
