import { ReactNode } from 'react';

interface ContactLinkProps {
  href: string | null;
  label: string;
  className: string;
  children: ReactNode;
}

export function ContactLink({ href, label, className, children }: ContactLinkProps) {
  const isLive = Boolean(href && !href.toUpperCase().includes('REPLACE_WITH_'));
  const content = (
    <>
      {children}
      {!isLive && (
        <span
          id={`${label.toLowerCase()}-contact-tooltip`}
          role="tooltip"
          className="contact-tooltip"
        >
          Coming soon
        </span>
      )}
    </>
  );

  if (isLive && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      role="button"
      aria-disabled="true"
      aria-label={`${label}, coming soon`}
      aria-describedby={`${label.toLowerCase()}-contact-tooltip`}
      tabIndex={-1}
      title="Coming soon"
      className={`${className} contact-placeholder`}
    >
      {content}
    </span>
  );
}
