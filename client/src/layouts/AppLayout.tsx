import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  Package,
  Wrench,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  UserCheck,
  BarChart3,
  ChevronDown,
  CheckCheck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';
import { CampusAIAssistant } from '@/components/CampusAIAssistant';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface RoleNavConfig {
  primary: NavItem[];
  more: NavItem[];
}

const allNavDefinitions: Record<string, NavItem> = {
  adminBoard: { label: 'Admin Board', href: '/admin', icon: ShieldCheck },
  home: { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  venues: { label: 'Venues', href: '/venues', icon: Building2 },
  events: { label: 'Events', href: '/events', icon: CalendarDays },
  clubs: { label: 'Clubs', href: '/clubs', icon: Users },
  resources: { label: 'Hardware', href: '/resources', icon: Package },
  lostfound: { label: 'Lost & Found', href: '/lost-found', icon: Search },
  attendance: { label: 'Attendance', href: '/attendance', icon: UserCheck },
  maintenance: { label: 'Repairs', href: '/maintenance', icon: Wrench },
  analytics: { label: 'Analytics', href: '/analytics', icon: BarChart3 },
};

const roleNavMap: Record<string, RoleNavConfig> = {
  student: {
    primary: [
      allNavDefinitions.home,
      allNavDefinitions.events,
      allNavDefinitions.clubs,
      allNavDefinitions.attendance,
      allNavDefinitions.lostfound,
    ],
    more: [allNavDefinitions.venues, allNavDefinitions.resources, allNavDefinitions.maintenance],
  },
  faculty: {
    primary: [
      allNavDefinitions.home,
      allNavDefinitions.attendance,
      allNavDefinitions.events,
      allNavDefinitions.analytics,
      allNavDefinitions.maintenance,
    ],
    more: [allNavDefinitions.venues, allNavDefinitions.resources, allNavDefinitions.clubs],
  },
  club_head: {
    primary: [
      allNavDefinitions.home,
      allNavDefinitions.events,
      allNavDefinitions.clubs,
      allNavDefinitions.lostfound,
    ],
    more: [allNavDefinitions.maintenance],
  },
  maintenance: {
    primary: [allNavDefinitions.home, allNavDefinitions.maintenance, allNavDefinitions.lostfound],
    more: [],
  },
  admin: {
    primary: [
      allNavDefinitions.adminBoard,
      allNavDefinitions.home,
      allNavDefinitions.attendance,
      allNavDefinitions.events,
      allNavDefinitions.maintenance,
      allNavDefinitions.analytics,
    ],
    more: [allNavDefinitions.clubs, allNavDefinitions.lostfound],
  },
};

interface NotificationItem {
  id: number;
  title: string;
  text: string;
  time: string;
  unread: boolean;
}

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moreNavOpen, setMoreNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Notifications start empty; real alerts will arrive dynamically
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If unauthenticated, redirect directly to the hero landing page ('/')
  if (!isLoading && !user) {
    return <Navigate to="/" replace />;
  }

  const userRole = user?.role || 'student';
  const navConfig = roleNavMap[userRole] || roleNavMap.student;

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CU';

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  // Close search and notification dropdowns on outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search items across all pages
  const searchablePages = useMemo(
    () => [
      ...(userRole === 'admin'
        ? [
            {
              label: 'Administrator Board',
              desc: 'Institutional oversight across all 9 departments',
              href: '/attendance',
            },
          ]
        : []),
      {
        label: 'Campus Events',
        desc: 'Browse upcoming workshops, fests, and tickets',
        href: '/events',
      },
      {
        label: 'Attendance',
        desc: 'Check course percentages and mark daily sessions',
        href: '/attendance',
      },
      {
        label: 'Repairs & Maintenance',
        desc: 'Report campus issues and track fixes',
        href: '/maintenance',
      },
      {
        label: 'Clubs & Communities',
        desc: 'Explore student clubs and announcements',
        href: '/clubs',
      },
      {
        label: 'Lost & Found',
        desc: 'Report lost items or claim found belongings',
        href: '/lost-found',
      },
      {
        label: 'Analytics',
        desc: 'Campus utilization and maintenance statistics',
        href: '/analytics',
      },
    ],
    [userRole]
  );

  const filteredSearchPages = useMemo(() => {
    if (!searchQuery.trim()) return searchablePages.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return searchablePages.filter(
      (p) => p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );
  }, [searchQuery, searchablePages]);

  // Is a child route in the "More" menu currently active?
  const isMoreChildActive = navConfig.more.some((item) => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-app-ambient flex flex-col md:flex-row text-white selection:bg-lime selection:text-lime-ink">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Max 5-6 primary items per role + More) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-ring/80 flex flex-col transition-transform duration-200 md:static md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-ring/60">
          <Link to="/dashboard" className="flex items-center gap-2.5 min-h-[44px]">
            <img
              src="/sjbit-emblem.png"
              alt="SJBIT Emblem"
              className="w-9 h-9 rounded-full object-cover bg-white p-0.5 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.25)] shrink-0"
            />
            <div className="min-w-0">
              <span className="font-extrabold text-sm tracking-tight text-white block leading-tight truncate">
                SJBIT <span className="text-lime">CampusOS</span>
              </span>
              <span className="text-[10px] text-white/50 block leading-tight truncate">
                VTU Autonomous
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-white/50 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
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
                {userRole.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navConfig.primary.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-btn text-sm font-medium transition-all group select-none cursor-pointer',
                  isActive
                    ? 'bg-lime text-lime-ink font-semibold shadow-[0_0_15px_rgba(131,243,77,0.3)]'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:scale-105',
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

          {/* Collapsible "More" section for secondary items */}
          {navConfig.more.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMoreNavOpen((prev) => !prev)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2 min-h-[44px] rounded-btn text-xs font-semibold tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer',
                  isMoreChildActive && 'text-lime'
                )}
              >
                <span>MORE SECTIONS</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    moreNavOpen || isMoreChildActive ? 'rotate-180' : ''
                  )}
                />
              </button>

              {(moreNavOpen || isMoreChildActive) && (
                <div className="space-y-1 pl-2 pt-1 border-l border-ring/40 ml-4">
                  {navConfig.more.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-btn text-xs font-medium transition-all cursor-pointer',
                          isActive
                            ? 'bg-lime/20 text-lime font-semibold'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Sign Out Button */}
        <div className="p-3 border-t border-ring/60">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-btn text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 glass-nav border-b border-ring/60 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-white/70 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-btn hover:bg-white/10 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Global Search Bar */}
            <div ref={searchContainerRef} className="relative w-full max-w-sm hidden sm:block">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search campus (events, attendance, clubs, repairs...)"
                  className="w-full bg-white/[0.07] border border-white/15 text-white text-xs rounded-pill pl-9 pr-8 py-2 placeholder:text-white/40 outline-none focus:border-lime focus:bg-white/[0.1] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-white/40 hover:text-white p-1 text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Grouped search results popup */}
              {searchFocused && (
                <div className="absolute left-0 mt-2 w-full rounded-2xl bg-card border border-ring shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-2 z-50">
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider px-3 py-1">
                    Quick Navigation
                  </p>
                  <div className="space-y-1">
                    {filteredSearchPages.map((page) => (
                      <button
                        key={page.href}
                        type="button"
                        onClick={() => {
                          navigate(page.href);
                          setSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-lime">
                            {page.label}
                          </p>
                          <p className="text-[11px] text-white/50">{page.desc}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-lime transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 relative">
            {/* Notifications Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative w-10 h-10 rounded-full bg-card border border-ring flex items-center justify-center text-white/70 hover:text-white hover:border-lime/40 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-lime shadow-[0_0_8px_#83F34D]" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-card border border-ring shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 space-y-3 z-50 animate-in fade-in-0">
                  <div className="flex items-center justify-between border-b border-ring/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <Badge variant="lime" className="text-[10px] py-0 px-1.5">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[11px] text-lime hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-white/40 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            'p-3 rounded-xl border text-xs space-y-1 transition-colors',
                            notif.unread
                              ? 'bg-row border-lime/30'
                              : 'bg-card/50 border-ring/50 opacity-70'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{notif.title}</span>
                            <span className="text-[10px] text-white/40">{notif.time}</span>
                          </div>
                          <p className="text-white/60 text-[11px] leading-relaxed">{notif.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar linking to Home */}
            <Link
              to="/dashboard"
              className="w-10 h-10 rounded-full bg-lime/15 border border-lime/30 text-lime font-bold text-xs flex items-center justify-center hover:shadow-[0_0_12px_rgba(131,243,77,0.3)] transition-all"
              title="Go to Home"
            >
              {userInitials}
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Floating Campus AI Assistant */}
        <CampusAIAssistant />
      </div>
    </div>
  );
};
