import { StrictMode, useEffect } from 'react';
import App from './App';
import { StoreProvider } from './lib/store';
import './index.css';

const TITLE = 'CHOP — Good food, closer to you | Ijebu Ode & Ijagun';
const BODY_CLASSES = ['bg-[#F7F6F2]', 'text-[#191919]', 'font-sans', 'selection:bg-[#C45B3A]', 'selection:text-white'];

export default function MarketplaceRoot() {
  useEffect(() => {
    document.title = TITLE;
    document.documentElement.classList.remove('dark');
    document.body.classList.add(...BODY_CLASSES);
    return () => document.body.classList.remove(...BODY_CLASSES);
  }, []);

  return (
    <StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </StrictMode>
  );
}
