import { Link } from 'react-router-dom';
import { useAdminStats } from '../../hooks/admin/useAdmin';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-dark-text-muted mt-1">Overview of your course</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-muted text-sm">Total Students</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-green-400">{stats?.paidStudents || 0} paid</span>
            <span className="text-dark-text-muted">{stats?.freeStudents || 0} free</span>
          </div>
        </div>

        {/* Total Sessions */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-muted text-sm">Total Sessions</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalSessions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 text-sm text-dark-text-muted">
            {stats?.upcomingSessions || 0} upcoming
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card lg:col-span-2">
          <p className="text-dark-text-muted text-sm mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/sessions"
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Manage Sessions
            </Link>
            <Link
              to="/admin/students"
              className="px-4 py-2 bg-dark-border hover:bg-dark-border/80 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Manage Students
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Session */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Today's Session</h2>
        {stats?.todaySession ? (
          <div className="p-4 rounded-lg border border-dark-border bg-dark-bg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">{stats.todaySession.title}</h3>
                <p className="text-sm text-dark-text-muted mt-1">{stats.todaySession.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-dark-text-secondary">
                  <span>{formatTime(stats.todaySession.scheduled_at)}</span>
                  <span>{stats.todaySession.duration_minutes} min</span>
                  <span className="capitalize">{stats.todaySession.session_type}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stats.todaySession.has_zoom_link
                    ? 'bg-green-400/10 text-green-400'
                    : 'bg-yellow-400/10 text-yellow-400'
                }`}>
                  {stats.todaySession.has_zoom_link ? 'Zoom Link Added' : 'No Zoom Link'}
                </span>
                <Link
                  to="/admin/sessions"
                  className="text-sm text-primary hover:underline"
                >
                  {stats.todaySession.has_zoom_link ? 'Edit' : 'Add Zoom Link'}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-dark-text-muted">
            <p>No session scheduled for today</p>
            <Link
              to="/admin/sessions"
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              Schedule a session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
