import { type ReactNode } from 'react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import ScrollToTop from '../components/common/ScrollToTop';
import ErrorBoundary from '../components/common/ErrorBoundary';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      <DashboardNavbar />
      <main className="flex-grow">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <ScrollToTop />
    </div>
  );
};

export default DashboardLayout;
