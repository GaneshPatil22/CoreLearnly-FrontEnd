interface ProgressStatsProps {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  batchName?: string;
  isFreeUser: boolean;
}

const ProgressStats = ({
  totalLessons,
  completedLessons,
  progressPercent,
  batchName,
  isFreeUser
}: ProgressStatsProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-dark-text-primary">Your Progress</h2>
          {batchName && (
            <p className="text-sm text-dark-text-muted">{batchName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isFreeUser ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
            {isFreeUser ? 'Free Tier' : 'Premium'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-dark-text-secondary">
            {completedLessons} of {totalLessons} lessons completed
          </span>
          <span className="font-semibold text-primary">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-dark-bg rounded-lg">
          <div className="text-2xl font-bold text-dark-text-primary">{totalLessons}</div>
          <div className="text-xs text-dark-text-muted">Total Lessons</div>
        </div>
        <div className="text-center p-3 bg-dark-bg rounded-lg">
          <div className="text-2xl font-bold text-green-400">{completedLessons}</div>
          <div className="text-xs text-dark-text-muted">Completed</div>
        </div>
        <div className="text-center p-3 bg-dark-bg rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">{totalLessons - completedLessons}</div>
          <div className="text-xs text-dark-text-muted">Remaining</div>
        </div>
      </div>

      {/* Free Tier Note */}
      {isFreeUser && (
        <div className="mt-4 p-3 bg-yellow-400/5 border border-yellow-400/20 rounded-lg">
          <p className="text-sm text-yellow-400">
            You're on the free tier. Only Beginner module is accessible.
            <button className="ml-2 underline hover:no-underline">
              Upgrade to Premium
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressStats;
