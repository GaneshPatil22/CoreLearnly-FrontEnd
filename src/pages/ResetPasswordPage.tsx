import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import SEO from '../components/common/SEO';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no session (no valid reset token), redirect to login
    if (!session) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      setError('Failed to update password. Please try again.');
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-dark-text-secondary">Invalid or expired reset link.</p>
          <p className="text-dark-text-muted text-sm mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SEO
        title="Reset Password"
        description="Set a new password for your CoreLearnly account."
        path="/reset-password"
        noIndex
      />
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gradient">CoreLearnly</h1>
          </Link>
        </div>

        {/* Card */}
        <div className="card">
          {!success ? (
            <>
              <h2 className="text-xl font-semibold text-dark-text-primary mb-2">
                Set new password
              </h2>
              <p className="text-dark-text-secondary text-sm mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-dark-text-secondary mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg
                             text-dark-text-primary placeholder-dark-text-muted
                             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                             transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-dark-text-secondary mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
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
                  {loading ? 'Updating...' : 'Update Password'}
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
                Password updated!
              </h2>
              <p className="text-dark-text-secondary text-sm">
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
