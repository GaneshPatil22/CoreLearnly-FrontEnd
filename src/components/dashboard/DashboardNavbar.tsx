import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth/AuthContext';

const DashboardNavbar = () => {
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border shadow-lg">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Links to Dashboard (or Admin for admin users) */}
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center space-x-2 group">
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

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium">
              Dashboard
            </Link>
            <Link to="/dashboard/patterns" className="text-sm text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium">
              Patterns
            </Link>
            <Link to="/dashboard/roadmap" className="text-sm text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium">
              Roadmap
            </Link>
            <Link to="/dashboard/blog" className="text-sm text-dark-text-secondary hover:text-white transition-colors duration-200 font-medium">
              Blog
            </Link>
            <Link to="/" className="text-sm text-dark-text-muted hover:text-dark-text-secondary transition-colors duration-200">
              Home
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <span className="text-dark-text-secondary text-sm hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-dark-text-muted hover:text-white transition-colors duration-200 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
