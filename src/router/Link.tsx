import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate } from './navigation';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, onClick, target, children, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || target || event.button !== 0 || to.includes('#')) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={to} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
