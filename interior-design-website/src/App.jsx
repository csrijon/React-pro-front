import { BrowserRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <AuthProvider><ToastProvider><AppRoutes /></ToastProvider></AuthProvider>
      </BrowserRouter>
    </LazyMotion>
  );
}
