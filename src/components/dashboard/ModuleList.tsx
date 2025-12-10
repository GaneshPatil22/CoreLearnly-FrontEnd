import { useState } from 'react';
import type { CourseModule, Topic } from '../../types';
import LessonItem from './LessonItem';

interface ModuleListProps {
  modules: CourseModule[];
  isFreeUser: boolean;
  onToggleLesson: (lessonId: string, completed: boolean) => Promise<void>;
}

const ModuleList = ({ modules, isFreeUser, onToggleLesson }: ModuleListProps) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.length > 0 ? [modules[0].id] : [])
  );
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  const getModuleTypeColor = (type: string) => {
    switch (type) {
      case 'beginner':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'advanced':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ai':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getModuleProgress = (module: CourseModule) => {
    const lessons = (module.topics || []).flatMap(t => t.lessons || []);
    const completed = lessons.filter(l => l.is_completed).length;
    return { completed, total: lessons.length };
  };

  const getTopicProgress = (topic: Topic) => {
    const lessons = topic.lessons || [];
    const completed = lessons.filter(l => l.is_completed).length;
    return { completed, total: lessons.length };
  };

  const isModuleLocked = (type: string) => {
    return isFreeUser && type !== 'beginner';
  };

  return (
    <div className="space-y-4">
      {modules.map(module => {
        const isExpanded = expandedModules.has(module.id);
        const locked = isModuleLocked(module.type);
        const { completed, total } = getModuleProgress(module);
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <div
            key={module.id}
            className={`card ${locked ? 'opacity-60' : ''}`}
          >
            {/* Module Header */}
            <button
              onClick={() => !locked && toggleModule(module.id)}
              disabled={locked}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                {/* Expand/Collapse Icon */}
                <svg
                  className={`w-5 h-5 text-dark-text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-dark-text-primary">{module.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getModuleTypeColor(module.type)}`}>
                      {module.type}
                    </span>
                    {locked && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-dark-border text-dark-text-muted flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-text-muted mt-0.5">{module.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm text-dark-text-secondary">{completed}/{total}</span>
                  <div className="w-24 h-1.5 bg-dark-border rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>

            {/* Topics List */}
            {isExpanded && !locked && (
              <div className="mt-4 pt-4 border-t border-dark-border space-y-3">
                {(module.topics || []).map(topic => {
                  const isTopicExpanded = expandedTopics.has(topic.id);
                  const topicProgress = getTopicProgress(topic);

                  return (
                    <div key={topic.id} className="bg-dark-bg rounded-lg overflow-hidden">
                      {/* Topic Header */}
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-dark-border/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className={`w-4 h-4 text-dark-text-muted transition-transform ${isTopicExpanded ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="font-medium text-dark-text-primary">{topic.name}</span>
                        </div>
                        <span className="text-xs text-dark-text-muted">
                          {topicProgress.completed}/{topicProgress.total} lessons
                        </span>
                      </button>

                      {/* Lessons */}
                      {isTopicExpanded && (
                        <div className="px-3 pb-3 space-y-2">
                          {(topic.lessons || []).map(lesson => (
                            <LessonItem
                              key={lesson.id}
                              lesson={lesson}
                              onToggle={onToggleLesson}
                            />
                          ))}
                          {(topic.lessons || []).length === 0 && (
                            <p className="text-dark-text-muted text-sm py-2 pl-6">No lessons available yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {(module.topics || []).length === 0 && (
                  <p className="text-dark-text-muted text-sm py-2">No topics available yet</p>
                )}
              </div>
            )}

            {/* Locked Message */}
            {locked && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <p className="text-dark-text-muted text-sm">
                  Upgrade to premium to access {module.type} content.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {modules.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-dark-text-muted">No modules available</p>
        </div>
      )}
    </div>
  );
};

export default ModuleList;
