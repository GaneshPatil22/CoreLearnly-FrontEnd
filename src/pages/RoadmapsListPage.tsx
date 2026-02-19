import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoadmaps } from '../hooks/useRoadmaps';
import { buildBreadcrumbSchema, buildRoadmapListSchema } from '../utils/jsonld';
import SEO from '../components/common/SEO';
import JsonLd from '../components/common/JsonLd';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import RoadmapHeroCard from '../components/roadmap/RoadmapHeroCard';

const RoadmapsListPage = () => {
  const { roadmaps, loading, error } = useRoadmaps();

  const { featured, rest } = useMemo(() => {
    const feat = roadmaps.find((r) => r.is_featured);
    const remaining = feat ? roadmaps.filter((r) => r.id !== feat.id) : roadmaps;
    return { featured: feat || null, rest: remaining };
  }, [roadmaps]);

  return (
    <div className="min-h-screen py-24">
      <SEO
        title="Interview Prep Roadmaps"
        description="Structured learning paths for coding interview preparation. Follow step-by-step roadmaps covering DSA, system design, and more."
        path="/roadmaps"
        keywords="coding interview roadmaps, DSA learning paths, system design roadmap, interview preparation guide, algorithm study plan"
      />
      <JsonLd data={buildRoadmapListSchema()} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: 'https://corelearnly.com/' },
        { name: 'Roadmaps', url: 'https://corelearnly.com/roadmaps' },
      ])} />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interview Prep <span className="text-gradient">Roadmaps</span>
          </h1>
          <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
            Choose a structured learning path and track your progress from fundamentals to advanced topics.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-text-muted text-lg">Roadmaps coming soon! Check back later.</p>
          </div>
        ) : (
          <>
            {/* Featured Hero */}
            {featured && <RoadmapHeroCard roadmap={featured} />}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((roadmap, index) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoadmapsListPage;
