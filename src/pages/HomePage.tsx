// Workshop banner - temporarily disabled (will re-enable in future)
// import BannerSection from '../components/sections/BannerSection';
import HeroSection from '../components/sections/HeroSection';
import AIWeekendSection from '../components/sections/AIWeekendSection';
import PricingSection from '../components/sections/PricingSection';
import CurriculumSection from '../components/sections/CurriculumSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import MentorSection from '../components/sections/MentorSection';
import FAQSection from '../components/sections/FAQSection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Workshop Banner - temporarily disabled (will re-enable in future) */}
      {/* <BannerSection /> */}

      {/* Hero Section - Main CTA */}
      <HeroSection />

      {/* AI Weekend Section */}
      <AIWeekendSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Curriculum Section with Expandable Modules */}
      <CurriculumSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Mentor Section */}
      <MentorSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default HomePage;
