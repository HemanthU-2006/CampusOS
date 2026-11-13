import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  Compass,
  Package,
  Wrench,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  UserCheck,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Venues', href: '/venues', icon: Building2 },
  { label: 'Events', href: '/events', icon: CalendarDays },
  { label: 'Clubs', href: '/clubs', icon: Users },
  { label: 'Resources', href: '/resources', icon: Package },
  { label: 'Lost & Found', href: '/lost-found', icon: Search },
  { label: 'Attendance', href: '/attendance', icon: UserCheck, roles: ['faculty', 'student', 'admin'] },
  { label: 'Maintenance', href: '/maintenance', icon: Wrench },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'faculty'] },
  { label: 'Styleguide', href: '/styleguide', icon: Compass },
];

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CU';

  const userRole = user?.role || 'student';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sampleNotifications = [
    {
      id: 1,
      title: 'Venue Approved',
      text: 'Main Auditorium A confirmed for HackCampus.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Ticket Assigned',
      text: 'HVAC repair order assigned to Suresh Kumar.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Attendance Notice',
      text: 'CS301 attendance record logged: 88.4%',
      time: '3h ago',
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-app-ambient flex flex-col md:flex-row text-white selection:bg-lime selection:text-lime-ink">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-ring/80 flex flex-col transition-transform duration-300 md:static md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-ring/60">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime shadow-[0_0_12px_rgba(131,243,77,0.3)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Campus<span className="text-lime">OS</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-white/50 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Profile Card */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-row/80 border border-ring/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-lime/20 border border-lime/40 text-lime font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(131,243,77,0.2)]">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || 'Guest User'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="lime" className="text-[10px] px-1.5 py-0 leading-tight">
                {userRole.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems
            .filter((item) => !item.roles || item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-medium transition-all group select-none cursor-pointer',
                    isActive
                      ? 'bg-lime text-lime-ink font-semibold shadow-[0_0_15px_rgba(131,243,77,0.3)]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-transform group-hover:scale-110',
                        isActive ? 'text-lime-ink' : 'text-white/50 group-hover:text-lime'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                        isActive ? 'bg-lime-ink text-lime' : 'bg-row text-white/60'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>

        {/* Logout Bottom Trigger */}
        <div className="p-3 border-t border-ring/60">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Frosted Top Bar */}
        <header className="sticky top-0 z-30 h-16 glass-nav border-b border-ring/60 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-white/70 hover:text-white p-1 rounded-btn hover:bg-white/10 cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block w-72 lg:w-96">
              <SearchBar placeholder="Search events, venues, clubs, tickets..." />
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Quick Styleguide Pill */}
            <Link
              to="/styleguide"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white/80 border border-white/10 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-lime" />
              <span>Styleguide</span>
            </Link>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative w-9 h-9 rounded-full bg-card border border-ring flex items-center justify-center text-white/70 hover:text-white hover:border-lime/40 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-lime shadow-[0_0_8px_#83F34D]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-card border border-rule shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 space-y-3 z-50 animate-in fade-in-0 zoom-in-95">
                  <div className="flex items-center justify-between border-b border-ring pb-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <Badge variant="lime" className="text-[10px] py-0">2 New</Badge>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {sampleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          'p-2.5 rounded-xl border text-xs space-y-1 transition-colors',
                          notif.unread
                            ? 'bg-row border-lime/30'
                            : 'bg-card/50 border-ring/50 opacity-70'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{notif.title}</span>
                          <span className="text-[10px] text-white/40">{notif.time}</span>
                        </div>
                        <p className="text-white/60 text-[11px] leading-relaxed">
                          {notif.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Mini Avatar */}
            <Link
              to="/dashboard"
              className="w-9 h-9 rounded-full bg-lime/15 border border-lime/30 text-lime font-bold text-xs flex items-center justify-center hover:shadow-[0_0_12px_rgba(131,243,77,0.3)] transition-all"
            >
              {userInitials}
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
