import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import HomePage from '../pages/HomePage';
import ApplyPage from '../pages/ApplyPage';
import ApplyConfirmationPage from '../pages/ApplyConfirmationPage';
import WorkshopPage from '../pages/WorkshopPage';
import WorkshopConfirmationPage from '../pages/WorkshopConfirmationPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsPage from '../pages/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';

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
  {
    path: '/workshop',
    element: <MainLayout><WorkshopPage /></MainLayout>,
  },
  {
    path: '/workshop-confirmation',
    element: <MainLayout><WorkshopConfirmationPage /></MainLayout>,
  },
  {
    path: '/privacy-policy',
    element: <MainLayout><PrivacyPolicyPage /></MainLayout>,
  },
  {
    path: '/terms',
    element: <MainLayout><TermsPage /></MainLayout>,
  },
  {
    path: '*',
    element: <MainLayout><NotFoundPage /></MainLayout>,
  },
]);
