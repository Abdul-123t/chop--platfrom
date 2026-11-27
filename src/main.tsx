import {createRoot} from 'react-dom/client';
import { Root } from './Root.tsx';

const updateAnimationVisibility = () => {
  document.documentElement.classList.toggle('tab-hidden', document.hidden);
};

updateAnimationVisibility();
document.addEventListener('visibilitychange', updateAnimationVisibility);
createRoot(document.getElementById('root')!).render(<Root />);
