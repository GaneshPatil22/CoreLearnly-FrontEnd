import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { trackButtonClick } from '../../utils/analytics';

const PricingSection = () => {
  return (
    <section className="section-container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-dark-text-secondary">
            Invest in your future with affordable, high-quality training
          </p>
        </div>

        {/* Pricing Card */}
        <div className="card border-primary/30 hover:border-primary/50 transition-all duration-300">
          <div className="text-center p-8 md:p-12">
            {/* Badge */}
            <div className="inline-block bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
              Limited Time Offer
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl md:text-4xl text-dark-text-muted line-through font-bold">
                  ₹5,000
                </span>
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient">
                  ₹2,000
                </span>
              </div>
              <p className="text-xl text-dark-text-secondary">per month</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-text-secondary">Complete DSA & System Design curriculum</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-text-secondary">6+ real-world system design case studies</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-text-secondary">Live personal mentorship and guidance</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-text-secondary">Weekend sessions: AI fundamentals + language-specific DSA</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-text-secondary">Lifetime access to course materials</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-text-secondary">Certificate of completion</span>
              </div>
            </div>

            {/* CTA */}
            <Link to="/apply" onClick={() => trackButtonClick('enroll_now', 'pricing')}>
              <button className="btn-primary text-lg px-10 py-4 glow">
                Enroll Now - Save 60%
              </button>
            </Link>

            <p className="text-sm text-dark-text-muted mt-6">
              💰 6 months of live mentorship | DSA + System Design + AI | Limited seats available
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PricingSection;
