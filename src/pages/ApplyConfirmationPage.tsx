import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const ApplyConfirmationPage = () => {
  return (
    <div className="section-container py-16 md:py-24">
      <SEO
        title="Application Received"
        description="Your application to CoreLearnly has been received. We'll get back to you within 24 hours."
        path="/apply-confirmation"
        noIndex
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mb-8"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Application <span className="text-gradient">Received!</span>
        </h1>

        <p className="text-xl text-dark-text-secondary mb-12">
          Thank you for your interest in CoreLearnly! I'm excited to connect with you.
        </p>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-left mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="card border-dark-border p-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Confirmation Email</h3>
                  <p className="text-dark-text-secondary text-sm">
                    You'll receive a confirmation email shortly acknowledging your application.
                  </p>
                </div>
              </div>
            </div>

            <div className="card border-dark-border p-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Personal Follow-up</h3>
                  <p className="text-dark-text-secondary text-sm">
                    I'll personally reach out to you within 24 hours via WhatsApp or email to discuss your goals and answer any questions.
                  </p>
                </div>
              </div>
            </div>

            <div className="card border-dark-border p-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Discuss Payment Options</h3>
                  <p className="text-dark-text-secondary text-sm">
                    We'll discuss flexible payment options that work best for you. No pressure, just an honest conversation about your learning journey.
                  </p>
                </div>
              </div>
            </div>

            <div className="card border-dark-border p-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Start Your Journey</h3>
                  <p className="text-dark-text-secondary text-sm">
                    Once enrolled, you'll get access to the WhatsApp community, class schedule, and all course materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card border-primary/30 bg-gradient-to-br from-dark-card to-dark-bg mb-12"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>90 live classes over 6 months</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>DSA, LLD, HLD & AI Fundamentals</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lifetime access to recordings</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Personal mentorship</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>WhatsApp community access</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Interview preparation support</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Workshop CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card border-primary/30 p-8 mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Haven't Attended the Workshop Yet?
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Join Our FREE Workshop First!
          </h3>
          <p className="text-dark-text-secondary mb-6">
            Get a taste of my teaching style and learn valuable skills. Plus, the first 20 students to enroll get 2 months FREE!
          </p>
          <Link to="/workshop">
            <button className="btn-primary px-8 py-3 glow">
              Register for FREE Workshop
            </button>
          </Link>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-dark-border"
        >
          <p className="text-dark-text-secondary text-sm">
            Can't wait? Reach out directly at{' '}
            <a href="mailto:ganesh@corelearnly.com" className="text-primary hover:underline">
              ganesh@corelearnly.com
            </a>
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <Link to="/" className="text-primary hover:underline font-medium">
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ApplyConfirmationPage;
