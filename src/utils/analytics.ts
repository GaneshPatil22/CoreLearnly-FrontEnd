// Google Analytics 4 Utilities

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

/**
 * Initialize Google Analytics 4
 */
export const initGA = (): void => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA4 Measurement ID not found. Analytics will not be tracked.');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll manually track page views
  });

  console.log('Google Analytics 4 initialized');
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
};

/**
 * Track custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

/**
 * Track form submission
 */
export const trackFormSubmit = (formName: string): void => {
  trackEvent('form_submit', {
    form_name: formName,
  });
};

/**
 * Track button click
 */
export const trackButtonClick = (buttonName: string, buttonLocation?: string): void => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
  });
};

/**
 * Track external link click
 */
export const trackExternalLink = (url: string, linkText?: string): void => {
  trackEvent('click', {
    event_category: 'external_link',
    event_label: linkText || url,
    value: url,
  });
};

// Type augmentation for window.gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
