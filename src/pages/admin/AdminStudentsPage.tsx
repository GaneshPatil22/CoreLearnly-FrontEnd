import { useState } from 'react';
import { useAdminStudents } from '../../hooks/admin/useAdmin';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminStudentsPage = () => {
  const { students, batches, loading, error, toggleFreeStatus, removeStudent, addStudent, refetch } = useAdminStudents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newBatchId, setNewBatchId] = useState('');
  const [newIsFree, setNewIsFree] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleToggleFree = async (enrollmentId: string, currentIsFree: boolean) => {
    const action = currentIsFree ? 'upgrade to paid' : 'downgrade to free';
    if (!confirm(`Are you sure you want to ${action} this student?`)) return;

    setActionLoading(enrollmentId);
    await toggleFreeStatus(enrollmentId, !currentIsFree);
    setActionLoading(null);
  };

  const handleRemove = async (enrollmentId: string) => {
    if (!confirm('Remove this student from the batch? This will cancel their enrollment.')) return;

    setActionLoading(enrollmentId);
    await removeStudent(enrollmentId);
    setActionLoading(null);
  };

  const handleAddStudent = async () => {
    if (!newUserId.trim() || !newBatchId) return;

    setAddLoading(true);
    const result = await addStudent(newUserId.trim(), newBatchId, newIsFree);
    setAddLoading(false);

    if (!result.error) {
      setShowAddModal(false);
      setNewUserId('');
      setNewBatchId('');
      setNewIsFree(true);
    } else {
      alert(result.error);
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Students</h1>
          <p className="text-dark-text-muted mt-1">
            {students.length} enrolled student{students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          Add Student
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-white">{students.length}</p>
          <p className="text-sm text-dark-text-muted">Total</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-400">
            {students.filter(s => !s.is_free).length}
          </p>
          <p className="text-sm text-dark-text-muted">Paid</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {students.filter(s => s.is_free).length}
          </p>
          <p className="text-sm text-dark-text-muted">Free</p>
        </div>
      </div>

      {/* Students List */}
      <div className="card overflow-hidden">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-text-muted">No students enrolled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-muted">User ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-muted">Batch</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-muted">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-muted">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-muted">Enrolled</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-dark-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-dark-border/50 hover:bg-dark-border/20">
                    <td className="py-3 px-4">
                      <code className="text-sm text-dark-text-secondary bg-dark-bg px-2 py-1 rounded">
                        {student.user_id.slice(0, 8)}...
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm text-dark-text-secondary">
                      {student.batch_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.is_free
                          ? 'bg-yellow-400/10 text-yellow-400'
                          : 'bg-green-400/10 text-green-400'
                      }`}>
                        {student.is_free ? 'Free' : 'Paid'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-dark-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${student.total_lessons > 0 ? (student.completed_lessons / student.total_lessons) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-text-muted">
                          {student.completed_lessons}/{student.total_lessons}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-dark-text-muted">
                      {formatDate(student.enrolled_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {actionLoading === student.id ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleFree(student.id, student.is_free)}
                            className="text-xs px-2 py-1 text-dark-text-muted hover:text-white hover:bg-dark-border rounded transition-colors"
                          >
                            {student.is_free ? 'Make Paid' : 'Make Free'}
                          </button>
                          <button
                            onClick={() => handleRemove(student.id)}
                            className="text-xs px-2 py-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-4">Add Student</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-text-muted mb-1">User ID</label>
                <input
                  type="text"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  placeholder="Paste user UUID from Supabase Auth"
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-dark-text-muted mt-1">
                  Find user ID in Supabase → Authentication → Users
                </p>
              </div>

              <div>
                <label className="block text-sm text-dark-text-muted mb-1">Batch</label>
                <select
                  value={newBatchId}
                  onChange={(e) => setNewBatchId(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-dark-text-muted mb-1">Tier</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={newIsFree}
                      onChange={() => setNewIsFree(true)}
                      className="text-primary"
                    />
                    <span className="text-sm text-white">Free (Beginner only)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!newIsFree}
                      onChange={() => setNewIsFree(false)}
                      className="text-primary"
                    />
                    <span className="text-sm text-white">Paid (Full access)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-dark-text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={!newUserId.trim() || !newBatchId || addLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
              >
                {addLoading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;
