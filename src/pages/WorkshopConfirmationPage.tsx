import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const WorkshopConfirmationPage = () => {
  return (
    <div className="section-container py-16 md:py-24">
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
          You're <span className="text-gradient">Registered!</span>
        </h1>

        <p className="text-xl text-dark-text-secondary mb-12">
          Welcome to the CoreLearnly FREE Workshop! We're excited to have you join us.
        </p>

        {/* Workshop Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card border-primary/30 mb-12"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Workshop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-4">
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-white font-semibold mb-1">Date</div>
                  <div className="text-dark-text-secondary">Jan 10-11, 2026 (Sat-Sun)</div>
                </div>
              </div>

              <div className="flex gap-4">
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-white font-semibold mb-1">Time</div>
                  <div className="text-dark-text-secondary">10:00 AM - 2:00 PM IST (each day)</div>
                </div>
              </div>

              <div className="flex gap-4">
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <div className="text-white font-semibold mb-1">Platform</div>
                  <div className="text-dark-text-secondary">Live Online (Zoom link will be shared)</div>
                </div>
              </div>

              <div className="flex gap-4">
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-white font-semibold mb-1">Cost</div>
                  <div className="text-dark-text-secondary">100% FREE</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
                  <h3 className="text-white font-semibold mb-2">Check Your Email</h3>
                  <p className="text-dark-text-secondary text-sm">
                    You'll receive a confirmation email shortly with all the workshop details and resources.
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
                  <h3 className="text-white font-semibold mb-2">Get Workshop Reminders</h3>
                  <p className="text-dark-text-secondary text-sm">
                    We'll send you reminders via email and WhatsApp as the workshop date approaches.
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
                  <h3 className="text-white font-semibold mb-2">Receive Zoom Link</h3>
                  <p className="text-dark-text-secondary text-sm">
                    You'll get the Zoom meeting link 1 day before the workshop starts.
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
                  <h3 className="text-white font-semibold mb-2">Join the Workshop</h3>
                  <p className="text-dark-text-secondary text-sm">
                    Attend both days, participate actively, and get ready to level up your skills!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preparation Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card border-primary/30 bg-gradient-to-br from-dark-card to-dark-bg mb-12"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Prepare for the Workshop</h2>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ensure stable internet connection</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Have a text editor or IDE ready (VS Code, Sublime, etc.)</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Keep a notebook handy for taking notes</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Join from a quiet space for better focus</span>
              </div>
              <div className="flex items-start gap-3 text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Keep your camera on for better engagement (optional)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Special Offer Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card border-primary/30 p-8 mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Exclusive Offer for Early Enrollees
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Get 2 Months FREE in Full Course
          </h3>
          <p className="text-dark-text-secondary mb-6">
            The first 20 students who enroll in the 6-month CoreLearnly course
            get the Basic Module (2 months) absolutely FREE. Save ₹4,000!
          </p>
          <Link to="/apply">
            <button className="btn-secondary px-8 py-3">
              Learn More About Full Course
            </button>
          </Link>
        </motion.div>

        {/* Social Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <p className="text-dark-text-secondary mb-4">
            Know someone who'd benefit from this workshop?
          </p>
          <Link to="/workshop">
            <button className="btn-secondary px-6 py-3">
              Share Workshop Link
            </button>
          </Link>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-dark-border"
        >
          <p className="text-dark-text-secondary text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:hello@corelearn.ly" className="text-primary hover:underline">
              hello@corelearn.ly
            </a>
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
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

export default WorkshopConfirmationPage;
