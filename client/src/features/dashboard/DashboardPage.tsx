import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Package,
  Wrench,
  Search,
  ArrowUpRight,
  TrendingUp,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Plus,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { PillCard } from '@/components/ui/PillCard';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const { user, setDemoUser } = useAuth();
  const role = user?.role || 'student';

  // State for interactive actions on dashboard
  const [approvals, setApprovals] = useState([
    {
      id: 'appr-1',
      venue: 'Main Auditorium (Hall A)',
      user: 'Robotics Guild (Rohan Sharma)',
      time: 'Tomorrow, 2:00 PM - 6:00 PM',
      purpose: 'HackCampus Setup & Audio Checks',
      status: 'pending' as const,
    },
    {
      id: 'appr-2',
      venue: 'Alan Turing Seminar Hall',
      user: 'Priya Patel (Student CS)',
      time: 'Nov 18, 10:00 AM - 1:00 PM',
      purpose: 'Algorithmic Research Presentation',
      status: 'pending' as const,
    },
  ]);

  const [tickets, setTickets] = useState([
    {
      id: 'tick-1',
      title: 'HVAC Chiller Leak near Rear Projector',
      location: 'CS Complex 2nd Floor, Room 204',
      priority: 'high' as const,
      status: 'assigned' as const,
    },
    {
      id: 'tick-2',
      title: 'Lab 3 Ethernet Switch Port 12 Down',
      location: 'Innovation Lab 3, Rack B',
      priority: 'medium' as const,
      status: 'in_progress' as const,
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast.success(`Reservation approved for ${name}!`, {
      description: 'Notification and calendar clearance dispatched.',
    });
  };

  const handleReject = (id: string, name: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast.error(`Reservation rejected for ${name}`);
  };

  const handleResolveTicket = (id: string, title: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    toast.success(`Ticket marked Resolved!`, {
      description: `${title} status updated. Student notified to rate work.`,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Top Welcome Banner & Quick Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-ring/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.name || 'Campus Member'}
            </h1>
            <Badge variant="lime" className="text-xs font-semibold px-2.5 py-0.5">
              {role.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            {user?.department || 'Campus Department'} · {user?.activityPoints || 0} Activity Points
          </p>
        </div>

        {/* Live Role Switcher for Reviewing all Dashboards */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-ring/50">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider mr-1">
            Switch View:
          </span>
          <button
            type="button"
            onClick={() => setDemoUser('student')}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              role === 'student' ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.35)]' : 'bg-row text-white/70 hover:text-white border border-ring/60'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('faculty')}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              role === 'faculty' ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.35)]' : 'bg-row text-white/70 hover:text-white border border-ring/60'
            }`}
          >
            Faculty
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('club_head')}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              role === 'club_head' ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.35)]' : 'bg-row text-white/70 hover:text-white border border-ring/60'
            }`}
          >
            Club Head
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('maintenance')}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              role === 'maintenance' ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.35)]' : 'bg-row text-white/70 hover:text-white border border-ring/60'
            }`}
          >
            Maintenance
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('admin')}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              role === 'admin' ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.35)]' : 'bg-row text-white/70 hover:text-white border border-ring/60'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* 2. Role-Specific Metric Cards */}
      {role === 'student' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Attendance Rate</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">88.4%</span>
              <Badge variant="approved">Safe (&gt;75%)</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Across 5 enrolled courses</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Registered Events</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">2</span>
              <Badge variant="lime">QR Ready</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Next: HackCampus (Fri)</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Venue Bookings</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">1</span>
              <Badge variant="pending">Pending</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Turing Seminar Hall</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Activity Points</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">160</span>
              <span className="text-xs text-emerald-400 flex items-center font-bold">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +25
              </span>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Top 15% of Batch</p>
          </div>
        </div>
      )}

      {role === 'faculty' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Pending Approvals</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {approvals.length}
              </span>
              <Badge variant="pending">Action Required</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Venue requests requiring clearance</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Active Courses</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">3</span>
              <Badge variant="lime">Fall 2026</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">CS301, CS402, CS499</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Low Attendance Alert</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">4</span>
              <Badge variant="overdue">&lt; 75% Alert</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Automated notices sent</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Average Attendance</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">86.2%</span>
              <span className="text-xs text-emerald-400 font-bold">+1.8%</span>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Healthy department index</p>
          </div>
        </div>
      )}

      {role === 'club_head' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Guild Members</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">48</span>
              <Badge variant="approved">+6 this week</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Robotics &amp; AI Guild</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Event Registrations</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">184</span>
              <Badge variant="lime">Capacity 250</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">12 waitlisted users</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Club Announcements</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">8</span>
              <Badge variant="neutral">Published</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Latest read by 142 members</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Points Distributed</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">620</span>
              <span className="text-xs text-lime font-bold">Activity Pool</span>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Recognizing active builders</p>
          </div>
        </div>
      )}

      {role === 'maintenance' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Assigned Tickets</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {tickets.length}
              </span>
              <Badge variant="overdue">1 Urgent</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">2 in progress currently</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Resolved This Week</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">14</span>
              <Badge variant="approved">On Track</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Across 4 academic wings</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Average SLA</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">3.4h</span>
              <span className="text-xs text-emerald-400 font-bold">-45m</span>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Target: &lt; 6 hours</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Student Rating</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">4.9 / 5</span>
              <span className="text-xs text-amber-300 font-bold">★ ★ ★ ★ ★</span>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Based on 38 verified closes</p>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Campus Users</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">2,840</span>
              <Badge variant="lime">Verified</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Students, Faculty &amp; Staff</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Venue Utilization</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime">78.5%</span>
              <Badge variant="approved">Peak Time</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Conflict rate: 0.0%</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Facility Issues</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">6 Open</span>
              <Badge variant="info">Dispatched</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">Zero critical outages</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
            <span className="text-xs text-white/50 font-medium">Hardware Inventory</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">94%</span>
              <Badge variant="lime">Accounted</Badge>
            </div>
            <p className="text-[11px] text-white/40 pt-1">0 overdue items currently</p>
          </div>
        </div>
      )}

      {/* 3. Actionable Tables & Modules */}
      {(role === 'faculty' || role === 'admin') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Venue Booking Approvals
              </h2>
              <p className="text-xs text-white/60">
                Review and approve or reject campus room reservations.
              </p>
            </div>
            <Badge variant="pending">{approvals.length} Pending</Badge>
          </div>

          {approvals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue Requested</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Reserved Window</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((appr) => (
                  <TableRow key={appr.id}>
                    <TableCell className="font-semibold text-white">
                      {appr.venue}
                    </TableCell>
                    <TableCell className="text-white/80">{appr.user}</TableCell>
                    <TableCell className="text-lime font-mono text-xs">
                      {appr.time}
                    </TableCell>
                    <TableCell className="text-white/70 max-w-xs truncate">
                      {appr.purpose}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleReject(appr.id, appr.user)}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="lime"
                          size="sm"
                          onClick={() => handleApprove(appr.id, appr.user)}
                        >
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 rounded-xl bg-card border border-ring/60 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-lime mx-auto" />
              <p className="text-sm font-bold text-white">All Clear!</p>
              <p className="text-xs text-white/50">There are no pending venue approvals.</p>
            </div>
          )}
        </section>
      )}

      {role === 'maintenance' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Assigned Work Orders
              </h2>
              <p className="text-xs text-white/60">
                Update repair statuses and log completion comments.
              </p>
            </div>
            <Badge variant="overdue">{tickets.length} Active</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue / Subject</TableHead>
                <TableHead>Campus Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-semibold text-white">
                    {t.title}
                  </TableCell>
                  <TableCell className="text-white/70">{t.location}</TableCell>
                  <TableCell>
                    <Badge variant={t.priority === 'high' ? 'overdue' : 'pending'}>
                      {t.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{t.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="lime"
                      size="sm"
                      onClick={() => handleResolveTicket(t.id, t.title)}
                    >
                      Mark Resolved
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {/* 4. Quick Module Launchers */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Campus Infrastructure Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PillCard
            icon={<Building2 className="w-5 h-5" />}
            title="Venues & Rooms"
            subtitle="Conflict-free reservations"
            badge={<Badge variant="lime">Active</Badge>}
            onClick={() => (window.location.href = '/venues')}
          />
          <PillCard
            icon={<Calendar className="w-5 h-5" />}
            title="Campus Events"
            subtitle="Waitlists & QR tickets"
            badge={<Badge variant="approved">3 Live</Badge>}
            onClick={() => (window.location.href = '/events')}
          />
          <PillCard
            icon={<Package className="w-5 h-5" />}
            title="Resources & Labs"
            subtitle="Hardware checkout cycle"
            badge={<Badge variant="pending">Checkout</Badge>}
            onClick={() => (window.location.href = '/resources')}
          />
          <PillCard
            icon={<Users className="w-5 h-5" />}
            title="Clubs & Societies"
            subtitle="Communities & point rewards"
            badge={<Badge variant="neutral">3 Clubs</Badge>}
            onClick={() => (window.location.href = '/clubs')}
          />
          <PillCard
            icon={<Search className="w-5 h-5" />}
            title="Lost & Found"
            subtitle="Smart item match & claims"
            badge={<Badge variant="info">Claim</Badge>}
            onClick={() => (window.location.href = '/lost-found')}
          />
          <PillCard
            icon={<Wrench className="w-5 h-5" />}
            title="Maintenance Tickets"
            subtitle="Photo dispatch & tracking"
            badge={<Badge variant="overdue">Dispatched</Badge>}
            onClick={() => (window.location.href = '/maintenance')}
          />
        </div>
      </section>
    </div>
  );
};
