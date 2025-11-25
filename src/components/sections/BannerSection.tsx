import { motion } from 'framer-motion';

const BannerSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 border-b border-primary/30"
    >
      <div className="section-container py-4">
        <p className="text-center text-white font-medium text-sm md:text-base flex items-center justify-center gap-2">
          <span className="text-2xl">🚀</span>
          <span>
            Just starting — our first 2-month batch is <span className="font-bold text-gradient">FREE</span> until we reach 40 students.
          </span>
        </p>
      </div>
    </motion.section>
  );
};

export default BannerSection;
