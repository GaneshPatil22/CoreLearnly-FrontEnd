import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollTo } from '../../hooks/useScrollTo';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollToSection } = useScrollTo();

  // Detect scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadSyllabus = () => {
    const link = document.createElement('a');
    link.href = '/syllabus.pdf';
    link.download = 'CoreLearnly-Syllabus.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const navLinks: { label: string; sectionId?: string; path?: string }[] = [
    { label: 'Curriculum', sectionId: 'curriculum' },
    { label: 'Projects', sectionId: 'projects' },
    { label: 'Mentors', sectionId: 'mentors' },
    { label: 'Blog', path: '/blog' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border shadow-lg'
          : 'bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg md:text-xl">C</span>
            </motion.div>
            <span className="text-xl md:text-2xl font-bold text-white">
              Core<span className="text-gradient">Learnly</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.path ? (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.sectionId!)}
                  className="text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </button>
              )
            )}
            <button
              onClick={handleDownloadSyllabus}
              className="text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium relative group"
            >
              Download Syllabus
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </button>
            <Link
              to="/login"
              className="text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link to="/apply">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Apply Now
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-dark-text-secondary hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-dark-border overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link, index) =>
                  link.path ? (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-card rounded-lg transition-all"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNavClick(link.sectionId!)}
                      className="block w-full text-left px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-card rounded-lg transition-all"
                    >
                      {link.label}
                    </motion.button>
                  )
                )}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  onClick={handleDownloadSyllabus}
                  className="block w-full text-left px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-card rounded-lg transition-all"
                >
                  Download Syllabus
                </motion.button>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-card rounded-lg transition-all"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 2) * 0.1 }}
                  className="px-4 pt-2"
                >
                  <Link to="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="btn-primary w-full">Apply Now</button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
