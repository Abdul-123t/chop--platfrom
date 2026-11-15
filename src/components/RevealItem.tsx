import { CSSProperties, ReactNode, TransitionEvent, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

type RevealItemStyle = CSSProperties & {
  '--deck-offset'?: string;
  '--deck-z'?: string;
};

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stackIndex?: number;
}

export function RevealItem({
  children,
  className = '',
  delay = 0,
  stackIndex,
}: RevealItemProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const [transitionFinished, setTransitionFinished] = useState(false);
  const style: RevealItemStyle = { transitionDelay: `${delay}ms` };

  if (stackIndex !== undefined) {
    style['--deck-offset'] = `${stackIndex * 12}px`;
    style['--deck-z'] = `${10 + stackIndex}`;
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === 'opacity') {
      setTransitionFinished(true);
    }
  };

  return (
    <div
      ref={ref}
      className={`reveal-item scroll-reveal-card ${
        isVisible ? 'is-visible' : ''
      } ${isVisible && !transitionFinished ? 'is-animating' : ''} ${className}`}
      style={style}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
}
