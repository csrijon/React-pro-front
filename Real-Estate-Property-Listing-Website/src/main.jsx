import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { CompareProvider } from './context/CompareContext'
import { SiteProvider } from './context/SiteContext'
import SelectEnhancer from './components/common/SelectEnhancer'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
          <App />
          <SelectEnhancer />
          <Toaster position="top-center" richColors closeButton />
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>,
)
