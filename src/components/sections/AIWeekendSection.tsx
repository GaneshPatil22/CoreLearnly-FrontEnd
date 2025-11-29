import { motion } from 'framer-motion';

const AIWeekendSection = () => {
  return (
    <section className="section-container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl blur-3xl"></div>

        <div className="relative card border-primary/30 bg-gradient-to-br from-dark-card to-dark-bg">
          <div className="max-w-4xl mx-auto text-center p-8 md:p-12">
            {/* Icon/Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-2xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Master AI <span className="text-gradient">Fundamentals</span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-dark-text-secondary mb-8">
              Every weekend, you'll learn AI fundamentals, master powerful AI tools,
              and discover how to leverage artificial intelligence to accelerate your career.
              One focused session each weekend to keep you ahead in the AI revolution.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="text-white font-semibold mb-2">AI Tools Mastery</h3>
                <p className="text-sm text-dark-text-muted">
                  Learn ChatGPT, GitHub Copilot, and cutting-edge AI tools
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-white font-semibold mb-2">Career Optimization</h3>
                <p className="text-sm text-dark-text-muted">
                  Optimize your LinkedIn, resume, and profile using AI
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="text-white font-semibold mb-2">AI Fundamentals</h3>
                <p className="text-sm text-dark-text-muted">
                  Understand core AI concepts and practical applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AIWeekendSection;
