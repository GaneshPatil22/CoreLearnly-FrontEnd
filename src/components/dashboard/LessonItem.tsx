import { useState } from 'react';
import type { Lesson } from '../../types';

interface LessonItemProps {
  lesson: Lesson;
  onToggle: (lessonId: string, completed: boolean) => Promise<void>;
}

const LessonItem = ({ lesson, onToggle }: LessonItemProps) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(lesson.id, !lesson.is_completed);
    } catch (err) {
      console.error('Failed to toggle lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors
        ${lesson.is_completed ? 'bg-green-500/5' : 'bg-dark-bg hover:bg-dark-border/50'}`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
          ${lesson.is_completed
            ? 'bg-green-500 border-green-500'
            : 'border-dark-border hover:border-primary'
          }
          ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
      >
        {lesson.is_completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {loading && !lesson.is_completed && (
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {/* Lesson Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium ${lesson.is_completed ? 'text-dark-text-secondary line-through' : 'text-dark-text-primary'}`}>
          {lesson.title}
        </h4>
        {lesson.description && (
          <p className="text-sm text-dark-text-muted truncate">{lesson.description}</p>
        )}
      </div>

      {/* Completed indicator */}
      {lesson.is_completed && lesson.completed_at && (
        <span className="text-xs text-green-400">
          Completed
        </span>
      )}
    </div>
  );
};

export default LessonItem;
