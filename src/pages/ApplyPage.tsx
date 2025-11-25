import { motion } from 'framer-motion';
import ApplicationForm from '../components/sections/ApplicationForm';

const ApplyPage = () => {
  return (
    <div className="section-container py-16 md:py-24">
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
          Take the first step towards mastering DSA, System Design, and building real-world projects.
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ApplicationForm />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12c0 6.627-5.373 12-12 12S-3 18.627-3 12 1.373 0 9 0c4.325 0 8.066 2.285 10.167 5.708z" />
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
