import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
            <Toaster
              position="bottom-right"
              gutter={10}
              toastOptions={{
                duration: 2600,
                style: { background: '#1C2026', color: '#fff', border: '1px solid #30343B', borderRadius: '12px', fontSize: '14px', maxWidth: '360px' },
                success: { iconTheme: { primary: '#EF252B', secondary: '#fff' } },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
