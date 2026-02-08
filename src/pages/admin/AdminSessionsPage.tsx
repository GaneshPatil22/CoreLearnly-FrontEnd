import { useState } from 'react';
import { useAdminSessions } from '../../hooks/admin/useAdmin';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSessionsPage = () => {
  const { sessions, loading, error, updateZoomLink, deleteSession, refetch } = useAdminSessions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [zoomInput, setZoomInput] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSessionStatus = (session: typeof sessions[0]) => {
    const now = new Date();
    const sessionTime = new Date(session.scheduled_at);
    const diffMins = (sessionTime.getTime() - now.getTime()) / (1000 * 60);

    if (diffMins > 15) return { label: 'Upcoming', color: 'bg-dark-border text-dark-text-secondary' };
    if (diffMins > -240 && session.has_zoom_link) return { label: 'Live', color: 'bg-green-400/20 text-green-400' };
    if (diffMins <= 0 && !session.has_zoom_link) return { label: 'Completed', color: 'bg-dark-border text-dark-text-muted' };
    return { label: 'Ready', color: 'bg-yellow-400/20 text-yellow-400' };
  };

  const handleAddZoomLink = async (sessionId: string) => {
    if (!zoomInput.trim()) return;
    setActionLoading(sessionId);
    await updateZoomLink(sessionId, zoomInput.trim());
    setEditingId(null);
    setZoomInput('');
    setActionLoading(null);
  };

  const handleRemoveZoomLink = async (sessionId: string) => {
    if (!confirm('Remove zoom link? This will mark the session as completed for students.')) return;
    setActionLoading(sessionId);
    await updateZoomLink(sessionId, null);
    setActionLoading(null);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    setActionLoading(sessionId);
    await deleteSession(sessionId);
    setActionLoading(null);
  };

  // Separate past and future sessions
  const now = new Date();
  const upcomingSessions = sessions.filter(s => {
    const sessionTime = new Date(s.scheduled_at);
    const diffHours = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60);
    return diffHours < 4 || s.has_zoom_link; // Show if less than 4 hours ago OR has zoom link
  });

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
        <button onClick={refetch} className="text-primary hover:underline mt-2">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEO
        title="Admin - Sessions"
        description="Manage CoreLearnly class sessions and zoom links."
        path="/admin/sessions"
        noIndex
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-dark-text-muted mt-1">Manage class sessions and zoom links</p>
        </div>
        <p className="text-sm text-dark-text-muted">
          Use SQL to create new sessions
        </p>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {upcomingSessions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-dark-text-muted">No sessions scheduled</p>
            <p className="text-sm text-dark-text-muted mt-2">
              Create sessions using SQL in Supabase dashboard
            </p>
          </div>
        ) : (
          upcomingSessions.map((session) => {
            const status = getSessionStatus(session);
            const isEditing = editingId === session.id;

            return (
              <div key={session.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{session.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-dark-border text-dark-text-secondary capitalize">
                        {session.session_type}
                      </span>
                    </div>
                    {session.description && (
                      <p className="text-sm text-dark-text-muted mt-1 truncate">{session.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-dark-text-secondary">
                      <span>{formatDate(session.scheduled_at)}</span>
                      <span>{formatTime(session.scheduled_at)}</span>
                      <span>{session.duration_minutes} min</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {actionLoading === session.id ? (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {session.has_zoom_link ? (
                          <button
                            onClick={() => handleRemoveZoomLink(session.id)}
                            className="text-sm px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            Remove Link
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(session.id);
                              setZoomInput('');
                            }}
                            className="text-sm px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                          >
                            Add Zoom Link
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-sm px-3 py-1.5 text-dark-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Zoom Link Input */}
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={zoomInput}
                        onChange={(e) => setZoomInput(e.target.value)}
                        placeholder="Paste Zoom link here..."
                        className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddZoomLink(session.id)}
                        disabled={!zoomInput.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-dark-border text-white rounded-lg text-sm font-medium hover:bg-dark-border/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminSessionsPage;
