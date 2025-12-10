import type { Session } from '../../types';

interface UpcomingSessionProps {
  session: Session | null;
  isFreeUser: boolean;
}

const UpcomingSession = ({ session, isFreeUser }: UpcomingSessionProps) => {
  if (!session) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Next Class</h2>
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-dark-border rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-dark-text-muted">No upcoming classes scheduled</p>
        </div>
      </div>
    );
  }

  const isLocked = isFreeUser && session.session_type !== 'beginner';
  const sessionDate = new Date(session.scheduled_at);
  const now = new Date();
  const diffMs = sessionDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeUntil = () => {
    if (diffDays === 0) return 'Tomorrow';
    if (diffDays === 1) return 'In 2 days';
    return `In ${diffDays} days`;
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

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Next Class</h2>

      <div className="p-4 rounded-lg border border-dark-border bg-dark-bg">
        {/* Session Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
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
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-2 text-dark-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(sessionDate)}
          </div>
          <div className="flex items-center gap-2 text-dark-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(sessionDate)} ({session.duration_minutes} min)
          </div>
        </div>

        {/* Time Until & Lock Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-dark-text-muted">
            {getTimeUntil()}
          </span>

          {isLocked && (
            <div className="flex items-center gap-2 text-dark-text-muted text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Premium only
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingSession;
