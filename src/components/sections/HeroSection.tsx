import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const handleDownloadSyllabus = () => {
    const link = document.createElement('a');
    link.href = '/syllabus.pdf';
    link.download = 'CoreLearnly-Syllabus.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="section-container py-16 md:py-24 lg:py-32">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Ace{' '}
          <span className="text-gradient">DSA</span>,{' '}
          <span className="text-gradient">System Design</span>
          <br />
          & <span className="text-gradient">AI-Powered</span> Career Growth
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-dark-text-secondary mb-12 max-w-3xl mx-auto"
        >
          Master Data Structures, Algorithms, and System Design through live instruction,
          solve architectural challenges of top tech products, and harness AI for your career growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/apply">
            <button className="btn-primary text-lg px-8 py-4 glow">
              Apply Now
            </button>
          </Link>
          <button
            onClick={handleDownloadSyllabus}
            className="btn-secondary text-lg px-8 py-4"
          >
            Download Syllabus
          </button>
        </motion.div>

        {/* Stats/Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">6 Months</div>
            <div className="text-dark-text-secondary">Intensive Training</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">6+ Projects</div>
            <div className="text-dark-text-secondary">Real-World Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">AI Powered</div>
            <div className="text-dark-text-secondary">Every Weekend</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
