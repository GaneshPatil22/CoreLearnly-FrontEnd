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
              Weekend <span className="text-gradient">Power Sessions</span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-dark-text-secondary mb-8">
              Weekends are packed with value. Master AI fundamentals to stay ahead in the tech revolution,
              plus get language-specific DSA bridge sessions to ace coding interviews in your preferred language.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {/* AI Section */}
              <div className="bg-dark-bg/50 rounded-xl p-6 border border-dark-border">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="text-white font-semibold text-lg mb-2">AI Fundamentals</h3>
                <p className="text-sm text-dark-text-muted mb-4">
                  Learn ChatGPT, GitHub Copilot, career optimization with AI, and core AI concepts
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">ChatGPT</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Copilot</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">LinkedIn AI</span>
                </div>
              </div>

              {/* Language-Specific DSA Section */}
              <div className="bg-dark-bg/50 rounded-xl p-6 border border-dark-border">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-white font-semibold text-lg mb-2">Language-Specific DSA</h3>
                <p className="text-sm text-dark-text-muted mb-4">
                  Bridge sessions to connect DSA concepts with your preferred programming language
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">Java</span>
                  <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">JavaScript</span>
                  <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">Python</span>
                  <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">Swift</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AIWeekendSection;
