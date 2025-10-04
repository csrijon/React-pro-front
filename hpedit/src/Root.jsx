// Root.jsx
import { StrictMode, useEffect } from 'react';
import { WOW } from 'wowjs';
import 'animate.css';
import App from './App.jsx';

const Root = () => {
  useEffect(() => {
    // Delay init to ensure App DOM exists
    setTimeout(() => {
      new WOW({ live: false }).init();
    }, 100); // 100ms delay usually enough
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

export default Root;
