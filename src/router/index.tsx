import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AdminLayout from '../layout/AdminLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
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
import AdminBlogPostsPage from '../pages/admin/AdminBlogPostsPage';
import AdminBlogEditorPage from '../pages/admin/AdminBlogEditorPage';
import BlogListPage from '../pages/BlogListPage';
import BlogPostPage from '../pages/BlogPostPage';

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
  // Blog routes
  {
    path: '/blog',
    element: <MainLayout><BlogListPage /></MainLayout>,
  },
  {
    path: '/blog/:slug',
    element: <MainLayout><BlogPostPage /></MainLayout>,
  },
  // Auth routes (no MainLayout - standalone pages)
  {
    path: '/login',
    element: <ErrorBoundary><LoginPage /></ErrorBoundary>,
  },
  {
    path: '/reset-password',
    element: <ErrorBoundary><ResetPasswordPage /></ErrorBoundary>,
  },
  // Protected routes
  {
    path: '/dashboard',
    element: <ProtectedRoute><ErrorBoundary><DashboardPage /></ErrorBoundary></ProtectedRoute>,
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
    path: '/admin/blog',
    element: <AdminRoute><AdminLayout><AdminBlogPostsPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '/admin/blog/new',
    element: <AdminRoute><AdminLayout><AdminBlogEditorPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '/admin/blog/edit/:postId',
    element: <AdminRoute><AdminLayout><AdminBlogEditorPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '*',
    element: <MainLayout><NotFoundPage /></MainLayout>,
  },
]);
