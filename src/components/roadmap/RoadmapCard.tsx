import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRoadmapDifficultyColor } from '../../utils/pattern';
import type { Roadmap } from '../../types';
import { useLinkPrefix } from '../../hooks/useDashboardContext';

interface RoadmapCardProps {
  roadmap: Roadmap;
  index: number;
}

const RoadmapCard = ({ roadmap, index }: RoadmapCardProps) => {
  const linkPrefix = useLinkPrefix();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Link
        to={`${linkPrefix}/roadmaps/${roadmap.slug}`}
        className="block group"
      >
        <article className="card hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
          {/* Cover image or gradient fallback */}
          <div className="relative overflow-hidden rounded-lg mb-4 -mt-1 -mx-1 h-36">
            {roadmap.cover_image_url ? (
              <img
                src={roadmap.cover_image_url}
                alt={roadmap.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${roadmap.gradient_from}, ${roadmap.gradient_to})`,
                }}
              >
                <span className="text-4xl opacity-60">{roadmap.icon_name === 'rocket' ? '\u{1F680}' : roadmap.icon_name === 'star' ? '\u{2B50}' : roadmap.icon_name === 'fire' ? '\u{1F525}' : roadmap.icon_name === 'brain' ? '\u{1F9E0}' : roadmap.icon_name === 'target' ? '\u{1F3AF}' : '\u{1F5FA}'}</span>
              </div>
            )}
          </div>

          {/* Badges */}
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
              <span className="text-xs text-dark-text-muted ml-auto">
                {roadmap.total_patterns} patterns
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors mb-2">
            {roadmap.title}
          </h2>

          {/* Description */}
          <p className="text-dark-text-muted text-sm line-clamp-2 flex-1">
            {roadmap.description}
          </p>
        </article>
      </Link>
    </motion.div>
  );
};

export default RoadmapCard;
