import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Sessions', path: '/admin/sessions' },
    { label: 'Students', path: '/admin/students' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-lg font-bold text-white">
                Admin Panel
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-dark-text-secondary hover:text-white hover:bg-dark-border'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm text-dark-text-muted hover:text-white transition-colors"
              >
                Student View
              </Link>
              <span className="text-dark-text-muted text-sm hidden sm:inline">
                {user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-dark-text-muted hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
