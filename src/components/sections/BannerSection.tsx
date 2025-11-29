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
          <span className="text-2xl">🎉</span>
          <span>
            <span className="font-bold text-gradient">FREE</span> 8-hour workshop + First 20 students get Basic Module (2 months) <span className="font-bold text-gradient">FREE</span> — Save ₹4,000!
          </span>
        </p>
      </div>
    </motion.section>
  );
};

export default BannerSection;
