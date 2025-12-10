import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth/AuthContext';

const DashboardNavbar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border shadow-lg">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Links to Dashboard */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
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
