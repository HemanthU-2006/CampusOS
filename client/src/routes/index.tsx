import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { StyleguidePage } from '@/features/styleguide/StyleguidePage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { VenuesPage } from '@/features/bookings/pages/VenuesPage';
import { EventsPage } from '@/features/events/pages/EventsPage';
import { MaintenancePage } from '@/features/maintenance/pages/MaintenancePage';
import { ClubsPage } from '@/features/clubs/pages/ClubsPage';
import { ResourcesPage } from '@/features/resources/pages/ResourcesPage';
import { LostFoundPage } from '@/features/lostfound/pages/LostFoundPage';
import { AttendancePage } from '@/features/attendance/pages/AttendancePage';
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage';
import { AdminBoardPage } from '@/features/admin/pages/AdminBoardPage';
import { ContactPage } from '@/features/contact/pages/ContactPage';
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { ISEFacultyPage } from '@/features/departments/pages/ISEFacultyPage';
import { Button } from '@/components/ui/Button';
import { PillCard } from '@/components/ui/PillCard';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Landing Hero for public view
const LandingHeroPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 space-y-8">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime/10 border border-lime/30 text-lime text-xs font-semibold tracking-wide">
        <Sparkles className="w-3.5 h-3.5" />
        <span>CampusOS Infrastructure Platform</span>
      </div>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08]">
        The Operating System for <span className="text-lime">Modern Campuses</span>
      </h1>

      <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
        Venues, events, resources, clubs, attendance and maintenance unified in one place. No
        paperwork, no delays.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to="/login">
          <Button variant="lime" size="lg" className="shadow-[0_0_24px_rgba(131,243,77,0.4)]">
            Sign In to Portal <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="white" size="lg">
            Open Dashboard
          </Button>
        </Link>
        <Link to="/styleguide">
          <Button variant="outline" size="lg">
            <Compass className="w-4 h-4 mr-1.5" />
            Component Styleguide
          </Button>
        </Link>
      </div>

      {/* Module Quick Previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-12 max-w-5xl w-full text-left">
        <PillCard
          title="Instant Venue Booking"
          subtitle="Real-time conflict detection & approval"
          onClick={() => (window.location.href = '/dashboard')}
        />
        <PillCard
          title="Events & Auto-Waitlist"
          subtitle="QR check-in & auto-waitlist promotion"
          onClick={() => (window.location.href = '/dashboard')}
        />
        <PillCard
          title="Hardware Checkout"
          subtitle="Full resource lifecycle state machine"
          onClick={() => (window.location.href = '/dashboard')}
        />
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  // Public Routes (Landing glow background + light bars)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faculty/ise', element: <ISEFacultyPage /> },
    ],
  },
  // Dedicated Auth Pages
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // Authenticated App Shell Routes (Plain #090909 with subtle top glow)
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'admin', element: <AdminBoardPage /> },
      { path: 'venues', element: <VenuesPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'clubs', element: <ClubsPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'lost-found', element: <LostFoundPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
