import { type ReactNode } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import ScrollProgress from '../components/common/ScrollProgress';
import RouteTracker from '../components/common/RouteTracker';
import ErrorBoundary from '../components/common/ErrorBoundary';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <RouteTracker />
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
