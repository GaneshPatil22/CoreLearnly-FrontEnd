import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const WorkshopPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-purple-600/20 border border-primary/30 rounded-full px-6 py-2 mb-6">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold">100% FREE Workshop</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Master DSA, System Design &{' '}
            <span className="text-gradient">AI Fundamentals</span>
          </h1>

          <p className="text-lg md:text-xl text-dark-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Join our FREE 2-day intensive workshop and learn Data Structures & Algorithms,
            System Design basics, and AI tools that will accelerate your tech career.
          </p>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card border-primary/30">
              <div className="flex flex-col items-center text-center p-6">
                <svg className="w-10 h-10 text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-white font-bold text-lg mb-1">Jan 10-11, 2026</div>
                <div className="text-dark-text-secondary text-sm">Saturday & Sunday</div>
              </div>
            </div>

            <div className="card border-primary/30">
              <div className="flex flex-col items-center text-center p-6">
                <svg className="w-10 h-10 text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-white font-bold text-lg mb-1">8 Hours Total</div>
                <div className="text-dark-text-secondary text-sm">4 hours each day (10 AM - 2 PM IST)</div>
              </div>
            </div>

            <div className="card border-primary/30">
              <div className="flex flex-col items-center text-center p-6">
                <svg className="w-10 h-10 text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div className="text-white font-bold text-lg mb-1">Live Online</div>
                <div className="text-dark-text-secondary text-sm">Attend from anywhere</div>
              </div>
            </div>
          </div>

          {/* CTA Button - Scroll to form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a href="#register">
              <button className="btn-primary text-lg px-10 py-4 glow">
                Register for FREE
              </button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* What You'll Learn Section */}
      <section className="section-container py-16 md:py-20 bg-dark-bg/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              What You'll <span className="text-gradient">Learn</span>
            </h2>
            <p className="text-lg text-dark-text-secondary max-w-3xl mx-auto">
              Get hands-on experience with the most in-demand tech skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* DSA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card border-dark-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">DSA Fundamentals</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Time & Space Complexity</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Arrays & Problem Solving</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Live Problem Solving</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interview Techniques</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* System Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card border-dark-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">System Design Basics</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>System Design Fundamentals</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Scalability Concepts</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>URL Shortener Design</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interview Approach</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* AI Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card border-dark-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Fundamentals</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>ChatGPT for Coding</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>GitHub Copilot & AI Tools</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>LinkedIn Optimization</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark-text-secondary text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI for Career Growth</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Workshop Schedule */}
      <section className="section-container py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Workshop <span className="text-gradient">Schedule</span>
            </h2>
            <p className="text-lg text-dark-text-secondary">
              Comprehensive 8-hour training over 2 days
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Day 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card border-primary/30"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">Day 1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Data Structures & Algorithms</h3>
                    <p className="text-dark-text-secondary">Saturday, Jan 10 • 10:00 AM - 2:00 PM IST</p>
                  </div>
                </div>
                <div className="space-y-4 ml-0 md:ml-20">
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">10:00 - 10:15</div>
                    <div className="text-dark-text-secondary">Welcome & Introduction</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">10:15 - 11:45</div>
                    <div className="text-dark-text-secondary">DSA Fundamentals • Time/Space Complexity • Arrays</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">11:45 - 12:00</div>
                    <div className="text-dark-text-secondary">Break</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">12:00 - 1:30</div>
                    <div className="text-dark-text-secondary">Live Problem Solving Session</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">1:30 - 2:00</div>
                    <div className="text-dark-text-secondary">Q&A Session</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Day 2 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card border-primary/30"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">Day 2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Tools & System Design</h3>
                    <p className="text-dark-text-secondary">Sunday, Jan 11 • 10:00 AM - 2:00 PM IST</p>
                  </div>
                </div>
                <div className="space-y-4 ml-0 md:ml-20">
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">10:00 - 11:30</div>
                    <div className="text-dark-text-secondary">AI Tools for Developers</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">11:30 - 11:45</div>
                    <div className="text-dark-text-secondary">Break</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">11:45 - 1:00</div>
                    <div className="text-dark-text-secondary">System Design Fundamentals • URL Shortener Design</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">1:00 - 1:30</div>
                    <div className="text-dark-text-secondary">CoreLearnly Full Course Overview</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary font-semibold min-w-[100px]">1:30 - 2:00</div>
                    <div className="text-dark-text-secondary">Final Q&A</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Full Course Section */}
      <section className="section-container py-16 md:py-20 bg-dark-bg/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card border-primary/30 bg-gradient-to-br from-dark-card to-dark-bg">
            <div className="text-center p-8 md:p-12">
              <div className="inline-block bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                Full Course
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Continue Your Journey with the{' '}
                <span className="text-gradient">6-Month Course</span>
              </h2>
              <p className="text-lg text-dark-text-secondary mb-6 max-w-2xl mx-auto">
                Take your skills to the next level with 6 months of live mentorship covering
                DSA, System Design, and AI fundamentals.
              </p>
              <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                <div className="flex items-center gap-3 text-dark-text-secondary">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Complete DSA & System Design mastery</span>
                </div>
                <div className="flex items-center gap-3 text-dark-text-secondary">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Weekly AI sessions</span>
                </div>
                <div className="flex items-center gap-3 text-dark-text-secondary">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Live personal mentorship</span>
                </div>
                <div className="flex items-center gap-3 text-dark-text-secondary">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Just ₹2,000/month</span>
                </div>
              </div>
              <Link to="/apply">
                <button className="btn-secondary text-lg px-8 py-3">
                  Learn More About Full Course
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="section-container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Register for <span className="text-gradient">FREE</span>
            </h2>
            <p className="text-lg text-dark-text-secondary">
              Secure your spot in the workshop. Limited seats available!
            </p>
          </div>

          {/* Tally Registration Form */}
          <div className="card border-primary/30 overflow-hidden">
            <iframe
              src="https://tally.so/embed/zxE0Zq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              width="100%"
              height="1500"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Workshop Registration Form"
              className="w-full"
              style={{ minHeight: '800px' }}
            />
          </div>

          {/* Trust Indicators */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-dark-text-secondary text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>100% FREE</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your data is secure</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Instant confirmation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="section-container py-16 md:py-20 bg-dark-bg/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Is the workshop really free?',
                a: 'Yes! This workshop is 100% free with no hidden costs. We want to help aspiring developers learn and grow.',
              },
              {
                q: 'Will I get a recording?',
                a: 'Yes, all registered participants will receive recordings of both days, along with all workshop materials and resources.',
              },
              {
                q: 'What if I can only attend one day?',
                a: 'While we recommend attending both days for the complete experience, you can still register and attend whichever day(s) work for you. Recordings will be available for any sessions you miss.',
              },
              {
                q: 'Do I need prior coding experience?',
                a: 'Basic programming knowledge is helpful but not mandatory. We\'ll cover fundamentals and build from there. The workshop is designed for beginners to intermediate developers.',
              },
              {
                q: 'What software/tools do I need?',
                a: 'Just a computer with internet connection and a web browser. We\'ll provide all learning materials. For the coding session, a text editor or IDE of your choice would be helpful.',
              },
              {
                q: 'Is this workshop connected to the full course?',
                a: 'The workshop is standalone and completely FREE. It\'s a great way to experience my teaching style! If you enjoy the workshop, you can explore the full 6-month course at ₹2,000/month.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card border-dark-border"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-dark-text-secondary">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="section-container py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Level Up Your Skills?
          </h2>
          <p className="text-lg text-dark-text-secondary mb-8 max-w-2xl mx-auto">
            Join us for this FREE 2-day intensive workshop and start your journey
            towards mastering DSA, System Design, and AI.
          </p>
          <a href="#register">
            <button className="btn-primary text-lg px-10 py-4 glow">
              Register Now - It's FREE!
            </button>
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default WorkshopPage;
