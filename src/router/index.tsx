import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AdminLayout from '../layout/AdminLayout';
import HomePage from '../pages/HomePage';
import ApplyPage from '../pages/ApplyPage';
import ApplyConfirmationPage from '../pages/ApplyConfirmationPage';
// Workshop pages - temporarily disabled (will re-enable in future)
// import WorkshopPage from '../pages/WorkshopPage';
// import WorkshopConfirmationPage from '../pages/WorkshopConfirmationPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsPage from '../pages/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminSessionsPage from '../pages/admin/AdminSessionsPage';
import AdminStudentsPage from '../pages/admin/AdminStudentsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout><HomePage /></MainLayout>,
  },
  {
    path: '/curriculum',
    element: <MainLayout><HomePage /></MainLayout>, // Redirects to homepage with scroll
  },
  {
    path: '/projects',
    element: <MainLayout><HomePage /></MainLayout>, // Redirects to homepage with scroll
  },
  {
    path: '/mentors',
    element: <MainLayout><HomePage /></MainLayout>, // Redirects to homepage with scroll
  },
  {
    path: '/apply',
    element: <MainLayout><ApplyPage /></MainLayout>,
  },
  {
    path: '/apply-confirmation',
    element: <MainLayout><ApplyConfirmationPage /></MainLayout>,
  },
  // Workshop routes - temporarily disabled (will re-enable in future)
  // {
  //   path: '/workshop',
  //   element: <MainLayout><WorkshopPage /></MainLayout>,
  // },
  // {
  //   path: '/workshop-confirmation',
  //   element: <MainLayout><WorkshopConfirmationPage /></MainLayout>,
  // },
  {
    path: '/privacy-policy',
    element: <MainLayout><PrivacyPolicyPage /></MainLayout>,
  },
  {
    path: '/terms',
    element: <MainLayout><TermsPage /></MainLayout>,
  },
  // Auth routes (no MainLayout - standalone pages)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  // Protected routes
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  // Admin routes
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '/admin/sessions',
    element: <AdminRoute><AdminLayout><AdminSessionsPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '/admin/students',
    element: <AdminRoute><AdminLayout><AdminStudentsPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '*',
    element: <MainLayout><NotFoundPage /></MainLayout>,
  },
]);
