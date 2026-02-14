import SEO from '../components/common/SEO';
import JsonLd from '../components/common/JsonLd';
import { faqs } from '../data/faqs';
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildCourseSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
} from '../utils/jsonld';
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
      <SEO
        title="CoreLearnly - Master DSA, System Design & AI Fundamentals"
        description="Learn DSA, System Design (LLD & HLD), and AI fundamentals through live online classes. 6-month intensive program with personal mentorship. Just Rs.2000/month."
        path="/"
        keywords="DSA course, Data Structures and Algorithms, System Design classes, FAANG interview prep, HLD course, LLD course, AI mentorship, coding interview preparation, live DSA classes, system design interview, software engineering course"
      />
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />
      <JsonLd data={buildCourseSchema()} />
      <JsonLd data={buildFAQSchema(faqs)} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: 'https://corelearnly.com/' },
      ])} />

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
