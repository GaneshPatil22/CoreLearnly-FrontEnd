import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/dashboard/useDashboard';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProgressStats from '../components/dashboard/ProgressStats';
import TodaySession from '../components/dashboard/TodaySession';
import UpcomingSession from '../components/dashboard/UpcomingSession';
import ModuleList from '../components/dashboard/ModuleList';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';

const DashboardPage = () => {
  const { data, loading, error, toggleLessonProgress, getSessionJoinUrl } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-dark-text-primary mb-2">Something went wrong</h2>
          <p className="text-dark-text-muted">{error}</p>
        </div>
      </div>
    );
  }

  // No enrollment state
  if (!data?.enrollment) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <DashboardNavbar />

        {/* No Enrollment Message */}
        <main className="section-container py-16">
          <div className="card text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-dark-text-primary mb-2">
              No Active Enrollment
            </h2>
            <p className="text-dark-text-secondary mb-6">
              You don't have an active enrollment yet. Contact the instructor to get enrolled in a batch.
            </p>
            <Link to="/" className="btn-primary inline-block">
              Back to Homepage
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isFreeUser = data.enrollment.is_free;
  const batchName = (data.enrollment.batch as { name?: string })?.name;

  return (
    <div className="min-h-screen bg-dark-bg">
      <SEO
        title="Dashboard"
        description="Your CoreLearnly student dashboard. Track progress, join live sessions, and complete lessons."
        path="/dashboard"
        noIndex
      />
      <DashboardNavbar />

      {/* Main Content */}
      <main className="section-container py-8">
        <div className="reading-area grid lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Upcoming */}
          <div className="lg:col-span-1 space-y-6">
            <ProgressStats
              totalLessons={data.stats.totalLessons}
              completedLessons={data.stats.completedLessons}
              progressPercent={data.stats.progressPercent}
              batchName={batchName}
              isFreeUser={isFreeUser}
            />

            {/* Today's Session - with join functionality */}
            <TodaySession
              session={data.todaySession}
              isFreeUser={isFreeUser}
              onJoin={getSessionJoinUrl}
            />

            {/* Next Upcoming Session - info only */}
            <UpcomingSession
              session={data.upcomingSession}
              isFreeUser={isFreeUser}
            />

            {/* Quick Links - Patterns & Roadmap */}
            <div className="card">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/dashboard/roadmap"
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-text-primary group-hover:text-white transition-colors">Interview Prep Roadmap</p>
                    <p className="text-xs text-dark-text-muted">Follow the learning path</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/patterns"
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-text-primary group-hover:text-white transition-colors">DSA Pattern Library</p>
                    <p className="text-xs text-dark-text-muted">Browse all patterns</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/blog"
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-text-primary group-hover:text-white transition-colors">Blog</p>
                    <p className="text-xs text-dark-text-muted">Read articles & guides</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Curriculum</h2>
            <ModuleList
              modules={data.modules}
              isFreeUser={isFreeUser}
              onToggleLesson={toggleLessonProgress}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
