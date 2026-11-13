import { BrowserRouter } from 'react-router-dom'
import { LazyMotion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { CatalogProvider } from './context/CatalogContext'
import AppRoutes from './routes/AppRoutes'

// The animation engine is only needed for menus, dialogs and carousels, so it is fetched after the page has loaded
// instead of competing with the JavaScript and CSS the first render depends on.
const afterLoad = () => new Promise((resolve) => {
  const idle = () => ('requestIdleCallback' in window ? window.requestIdleCallback(resolve, { timeout: 2000 }) : setTimeout(resolve, 500))
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
})
const loadMotionFeatures = () => afterLoad().then(() => import('./motionFeatures').then((m) => m.default))

export default function App() {
  return (
    <LazyMotion features={loadMotionFeatures}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CatalogProvider>
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
            </CatalogProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </LazyMotion>
  )
}
