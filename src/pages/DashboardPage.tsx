import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/dashboard/useDashboard';
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
      <DashboardNavbar />

      {/* Main Content */}
      <main className="section-container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
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
