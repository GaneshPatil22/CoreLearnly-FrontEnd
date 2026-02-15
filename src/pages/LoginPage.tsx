import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { user, isAdmin, loading: authLoading, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'ganesh@corelearnly.com';

  // Redirect authenticated users away from login page
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError('Failed to send reset email. Please check your email address.');
    } else {
      setResetEmailSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SEO
        title="Student Login"
        description="Sign in to your CoreLearnly student portal to access your dashboard, lessons, and live sessions."
        path="/login"
        noIndex
      />
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gradient">CoreLearnly</h1>
          </Link>
          <p className="text-dark-text-secondary mt-2">Student Portal</p>
        </div>

        {/* Card */}
        <div className="card">
          {!showForgotPassword ? (
            <>
              <h2 className="text-xl font-semibold text-dark-text-primary mb-6">
                Sign in to your account
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-dark-text-secondary mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg
                             text-dark-text-primary placeholder-dark-text-muted
                             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                             transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-dark-text-secondary mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg
                             text-dark-text-primary placeholder-dark-text-muted
                             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                             transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError('');
                  }}
                  className="text-sm text-primary hover:text-primary-400 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </>
          ) : (
            <>
              {!resetEmailSent ? (
                <>
                  <h2 className="text-xl font-semibold text-dark-text-primary mb-2">
                    Reset your password
                  </h2>
                  <p className="text-dark-text-secondary text-sm mb-6">
                    Enter your email and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="block text-sm font-medium text-dark-text-secondary mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg
                                 text-dark-text-primary placeholder-dark-text-muted
                                 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                                 transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>

                    {error && (
                      <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-dark-text-primary mb-2">
                    Check your email
                  </h2>
                  <p className="text-dark-text-secondary text-sm">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
              )}

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                    setError('');
                  }}
                  className="text-sm text-primary hover:text-primary-400 transition-colors"
                >
                  ← Back to login
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-dark-text-muted text-sm mt-6">
          Don't have login credentials?{' '}
          <Link to="/apply" className="text-primary hover:text-primary-400 transition-colors">
            Apply for the program
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
