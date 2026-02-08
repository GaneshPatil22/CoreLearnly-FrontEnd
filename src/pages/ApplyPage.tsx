import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';

const ApplyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Tally embed script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Listen for Tally form submission
    const handleTallyMessage = (event: MessageEvent) => {
      if (event.data?.type === 'tally.form.submitted') {
        navigate('/apply-confirmation');
      }
    };

    window.addEventListener('message', handleTallyMessage);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleTallyMessage);
    };
  }, [navigate]);

  return (
    <div className="section-container py-16 md:py-24">
      <SEO
        title="Apply Now"
        description="Apply to CoreLearnly's 6-month intensive program. Master DSA, System Design, and AI fundamentals with live classes and personal mentorship."
        path="/apply"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Apply to <span className="text-gradient">CoreLearnly</span>
        </h1>
        <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
          Take the first step towards mastering DSA, System Design, and AI-powered career growth.
          Fill out the form below and I'll get back to you within 24 hours.
        </p>
      </motion.div>

      {/* Tally Form Embed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <iframe
          data-tally-src="https://tally.so/embed/81NAkr?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="915"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Course Application Form"
          className="rounded-lg"
        ></iframe>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex items-center gap-2 text-dark-text-secondary">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Response within 24 hours</span>
          </div>
          <div className="flex items-center gap-2 text-dark-text-secondary">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 21C5.373 21 0 15.627 0 9a11.955 11.955 0 015.708-10.167A9.969 9.969 0 0112 0a9.969 9.969 0 016.292 2.833A11.955 11.955 0 0124 9c0 6.627-5.373 12-12 12z" />
            </svg>
            <span>No commitment required</span>
          </div>
          <div className="flex items-center gap-2 text-dark-text-secondary">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your data is secure</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplyPage;
