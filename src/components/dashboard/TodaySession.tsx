import { useState, useEffect } from 'react';
import type { Session } from '../../types';
import { getSessionStatus, type SessionStatus } from '../../hooks/dashboard/useDashboard';

interface TodaySessionProps {
  session: Session | null;
  isFreeUser: boolean;
  onJoin: (sessionId: string) => Promise<{ url: string | null; error: string | null }>;
}

const TodaySession = ({ session, isFreeUser, onJoin }: TodaySessionProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SessionStatus>('upcoming');
  const [canJoin, setCanJoin] = useState(false);

  // Update status every minute
  useEffect(() => {
    if (!session) return;

    const updateStatus = () => {
      const sessionWithStatus = getSessionStatus(session);
      setStatus(sessionWithStatus.status);
      setCanJoin(sessionWithStatus.canJoin);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Today's Class</h2>
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-dark-border rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-dark-text-muted">No class scheduled for today</p>
        </div>
      </div>
    );
  }

  const isLocked = isFreeUser && session.session_type !== 'beginner';
  const sessionDate = new Date(session.scheduled_at);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleJoin = async () => {
    setLoading(true);
    setError(null);

    const result = await onJoin(session.id);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.url) {
      window.open(result.url, '_blank');
      setLoading(false);
    } else {
      setError('Class link not available yet');
      setLoading(false);
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'beginner':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'advanced':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'ai':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
            Starting Soon
          </span>
        );
      case 'joinable':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 animate-pulse">
            Ready to Join
          </span>
        );
      case 'in_progress':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 animate-pulse">
            Live Now
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-dark-border text-dark-text-muted">
            Completed
          </span>
        );
    }
  };

  const getTimeInfo = () => {
    const now = new Date();
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (status === 'upcoming') {
      if (diffMins < 60) {
        return `Starts in ${diffMins} min`;
      }
      const diffHours = Math.floor(diffMins / 60);
      return `Starts in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    }
    if (status === 'joinable') {
      return `Starting at ${formatTime(sessionDate)}`;
    }
    if (status === 'in_progress') {
      const elapsedMins = Math.abs(diffMins);
      return `Started ${elapsedMins} min ago`;
    }
    return 'Session ended';
  };

  return (
    <div className="card border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dark-text-primary">Today's Class</h2>
        {getStatusBadge()}
      </div>

      <div className="p-4 rounded-lg border border-dark-border bg-dark-bg">
        {/* Session Header */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-dark-text-primary">{session.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getSessionTypeColor(session.session_type)}`}>
              {session.session_type}
            </span>
          </div>
          {session.description && (
            <p className="text-sm text-dark-text-muted">{session.description}</p>
          )}
        </div>

        {/* Time Info */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-dark-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(sessionDate)} ({session.duration_minutes} min)
          </div>
          <span className={`text-sm font-medium ${canJoin ? 'text-primary' : 'text-dark-text-muted'}`}>
            {getTimeInfo()}
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end">
          {isLocked ? (
            <div className="flex items-center gap-2 text-dark-text-muted text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Premium only
            </div>
          ) : status === 'completed' ? (
            <span className="text-sm text-dark-text-muted flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Session Completed
            </span>
          ) : canJoin ? (
            <button
              onClick={handleJoin}
              disabled={loading}
              className="btn-primary text-sm px-6 py-2 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Join Class
                </>
              )}
            </button>
          ) : status === 'joinable' || status === 'in_progress' ? (
            // Within join window but no zoom link yet
            <span className="text-sm text-yellow-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Waiting for class link...
            </span>
          ) : (
            <span className="text-sm text-dark-text-muted">
              Join button available 15 min before class
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaySession;
