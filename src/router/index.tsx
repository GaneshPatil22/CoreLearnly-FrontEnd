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
import DashboardLayout from '../layout/DashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminSessionsPage from '../pages/admin/AdminSessionsPage';
import AdminStudentsPage from '../pages/admin/AdminStudentsPage';
import AdminBlogPostsPage from '../pages/admin/AdminBlogPostsPage';
import AdminBlogEditorPage from '../pages/admin/AdminBlogEditorPage';
import AdminPatternsPage from '../pages/admin/AdminPatternsPage';
import AdminPatternEditorPage from '../pages/admin/AdminPatternEditorPage';
import AdminRoadmapPage from '../pages/admin/AdminRoadmapPage';
import BlogListPage from '../pages/BlogListPage';
import BlogPostPage from '../pages/BlogPostPage';
import PatternsListPage from '../pages/PatternsListPage';
import PatternDetailPage from '../pages/PatternDetailPage';
import RoadmapPage from '../pages/RoadmapPage';

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
  // Pattern routes
  {
    path: '/patterns',
    element: <MainLayout><PatternsListPage /></MainLayout>,
  },
  {
    path: '/patterns/:slug',
    element: <MainLayout><PatternDetailPage /></MainLayout>,
  },
  // Roadmap route
  {
    path: '/roadmap',
    element: <MainLayout><RoadmapPage /></MainLayout>,
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
  {
    path: '/dashboard/patterns',
    element: <ProtectedRoute><DashboardLayout><PatternsListPage /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/dashboard/patterns/:slug',
    element: <ProtectedRoute><DashboardLayout><PatternDetailPage /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/dashboard/roadmap',
    element: <ProtectedRoute><DashboardLayout><RoadmapPage /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/dashboard/blog',
    element: <ProtectedRoute><DashboardLayout><BlogListPage /></DashboardLayout></ProtectedRoute>,
  },
  {
    path: '/dashboard/blog/:slug',
    element: <ProtectedRoute><DashboardLayout><BlogPostPage /></DashboardLayout></ProtectedRoute>,
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
    path: '/admin/patterns',
    element: <AdminRoute><AdminLayout><AdminPatternsPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '/admin/patterns/new',
    element: <AdminRoute><AdminLayout><AdminPatternEditorPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '/admin/patterns/edit/:patternId',
    element: <AdminRoute><AdminLayout><AdminPatternEditorPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '/admin/roadmap',
    element: <AdminRoute><AdminLayout><AdminRoadmapPage /></AdminLayout></AdminRoute>,
  },
  {
    path: '*',
    element: <MainLayout><NotFoundPage /></MainLayout>,
  },
]);
