import { useLocation } from 'react-router-dom';

/**
 * Returns a path prefix for links based on whether the user is
 * viewing content inside the dashboard layout (/dashboard/*).
 *
 * Usage:
 *   const prefix = useLinkPrefix();
 *   <Link to={`${prefix}/patterns/${slug}`} />
 *
 * Returns "/dashboard" when inside dashboard, "" otherwise.
 */
export function useLinkPrefix(): string {
  const { pathname } = useLocation();
  return pathname.startsWith('/dashboard') ? '/dashboard' : '';
}
