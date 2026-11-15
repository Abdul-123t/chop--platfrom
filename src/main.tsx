import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const updateAnimationVisibility = () => {
  document.documentElement.classList.toggle('tab-hidden', document.hidden);
};

updateAnimationVisibility();
document.addEventListener('visibilitychange', updateAnimationVisibility);
createRoot(document.getElementById('root')!).render(<App />);
