import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href, to, children, className, style, onClick, target, rel, ...props }) {
  const destination = to || href || '#';

  const isExternal =
    destination.startsWith('http://') ||
    destination.startsWith('https://') ||
    destination.startsWith('mailto:') ||
    destination.startsWith('tel:') ||
    destination.startsWith('#') ||
    destination === '#';

  const handleClick = (e) => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch {
      window.scrollTo(0, 0);
    }

    if (onClick) {
      onClick(e);
    }
  };

  if (isExternal) {
    return (
      <a
        href={destination}
        className={className}
        style={style}
        onClick={onClick}
        target={target}
        rel={rel}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={destination}
      className={className}
      style={style}
      onClick={handleClick}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
