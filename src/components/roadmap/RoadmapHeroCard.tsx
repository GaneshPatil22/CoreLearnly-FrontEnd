import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRoadmapDifficultyColor } from '../../utils/pattern';
import type { Roadmap } from '../../types';
import { useLinkPrefix } from '../../hooks/useDashboardContext';

interface RoadmapHeroCardProps {
  roadmap: Roadmap;
}

const RoadmapHeroCard = ({ roadmap }: RoadmapHeroCardProps) => {
  const linkPrefix = useLinkPrefix();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <Link
        to={`${linkPrefix}/roadmaps/${roadmap.slug}`}
        className="block group"
      >
        <div className="card hover:border-primary/50 transition-all duration-300 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover image / gradient */}
            <div className="relative overflow-hidden rounded-lg md:w-80 h-48 md:h-auto shrink-0">
              {roadmap.cover_image_url ? (
                <img
                  src={roadmap.cover_image_url}
                  alt={roadmap.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div
                  className="w-full h-full min-h-[12rem] flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${roadmap.gradient_from}, ${roadmap.gradient_to})`,
                  }}
                >
                  <span className="text-6xl opacity-60">{roadmap.icon_name === 'rocket' ? '\u{1F680}' : roadmap.icon_name === 'star' ? '\u{2B50}' : roadmap.icon_name === 'fire' ? '\u{1F525}' : roadmap.icon_name === 'brain' ? '\u{1F9E0}' : roadmap.icon_name === 'target' ? '\u{1F3AF}' : '\u{1F5FA}'}</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center py-2">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getRoadmapDifficultyColor(roadmap.difficulty_level)}`}>
                  {roadmap.difficulty_level}
                </span>
                {roadmap.estimated_duration && (
                  <span className="text-xs text-dark-text-muted">
                    {roadmap.estimated_duration}
                  </span>
                )}
                {roadmap.total_patterns > 0 && (
                  <span className="text-xs text-dark-text-muted">
                    {roadmap.total_patterns} patterns
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors mb-3">
                {roadmap.title}
              </h2>
              <p className="text-dark-text-secondary text-sm md:text-base mb-4">
                {roadmap.description}
              </p>
              <div>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:underline">
                  Start this roadmap
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RoadmapHeroCard;
