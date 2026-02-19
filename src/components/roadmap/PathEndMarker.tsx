import { motion } from 'framer-motion';

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const PathEndMarker = () => {
  return (
    <motion.div
      className="flex flex-col items-center py-8"
      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <p className="text-dark-text-muted text-sm mt-3 font-medium">Path Complete!</p>
    </motion.div>
  );
};

export default PathEndMarker;
