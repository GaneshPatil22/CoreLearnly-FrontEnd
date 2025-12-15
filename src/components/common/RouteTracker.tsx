import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../utils/analytics';

/**
 * Component to track page views in Google Analytics and handle scroll restoration
 * Place this component inside RouterProvider to track all route changes
 */
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Track page view whenever location changes
    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default RouteTracker;
