import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Building2,
  Wrench,
  UserCheck,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  AlertTriangle,
  QrCode,
  Check,
  X,
  TrendingUp,
  Compass,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { PillCard } from '@/components/ui/PillCard';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const { user, setDemoUser } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'student';
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  // Interactive items for the "What needs your attention" section (start empty; real records will arrive dynamically)
  const [facultyApprovals, setFacultyApprovals] = useState<any[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);

  const handleApprove = (id: string, name: string) => {
    setFacultyApprovals((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Booking approved!`, {
      description: `${name} has been confirmed on the campus calendar.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    setFacultyApprovals((prev) => prev.filter((item) => item.id !== id));
    toast.error(`Booking declined for ${name}`);
  };

  const handleCompleteTask = (id: string, title: string) => {
    setMaintenanceTasks((prev) => prev.filter((item) => item.id !== id));
    toast.success('Task marked as Done!', {
      description: `${title} is resolved. Student will be notified.`,
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Friendly Greeting */}
      <div className="p-6 rounded-2xl bg-card border border-ring/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hi, {firstName}
            </h1>
            <Badge variant="lime" className="text-xs px-2.5 py-0.5">
              {role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-white/60 mt-1">
            {role === 'admin'
              ? 'SJBIT Campus Governance · Office of the Principal & Chief Administrator'
              : 'Welcome to your SJBIT campus portal. Here is what is happening today.'}
          </p>
        </div>

        {/* Action Header: If Administrator, direct link to Admin Board */}
        {role === 'admin' ? (
          <div className="flex items-center gap-3">
            <Button
              variant="lime"
              size="sm"
              onClick={() => navigate('/admin')}
              className="font-bold shadow-[0_0_16px_rgba(131,243,77,0.35)]"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Open Administrator Board
            </Button>
          </div>
        ) : (
          <div className="text-xs text-white/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <span>SJBIT Connected Portal</span>
          </div>
        )}
      </div>

      {/* 2. 3 to 4 Big PillCard Shortcuts Per Role */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white tracking-tight">Quick Actions</h2>

        {/* Student Shortcuts */}
        {role === 'student' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PillCard
              icon={<Calendar className="w-5 h-5 text-lime" />}
              title="Campus events"
              subtitle="Browse workshops & fests"
              onClick={() => navigate('/events')}
            />
            <PillCard
              icon={<UserCheck className="w-5 h-5 text-lime" />}
              title="My attendance"
              subtitle="Track courses & 75% cutoff"
              onClick={() => navigate('/attendance')}
            />
            <PillCard
              icon={<Users className="w-5 h-5 text-lime" />}
              title="Clubs & societies"
              subtitle="Join technical & cultural groups"
              onClick={() => navigate('/clubs')}
            />
            <PillCard
              icon={<Wrench className="w-5 h-5 text-lime" />}
              title="Report a problem"
              subtitle="Broken AC, lighting, facilities"
              onClick={() => navigate('/maintenance')}
            />
          </div>
        )}

        {/* Faculty Shortcuts */}
        {role === 'faculty' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PillCard
              icon={<UserCheck className="w-5 h-5 text-lime" />}
              title="Mark attendance"
              subtitle="Log class attendance sessions"
              onClick={() => navigate('/attendance')}
            />
            <PillCard
              icon={<GraduationCap className="w-5 h-5 text-lime" />}
              title="Attendance report"
              subtitle="Export CSV rosters & warnings"
              onClick={() => navigate('/attendance')}
            />
            <PillCard
              icon={<Calendar className="w-5 h-5 text-lime" />}
              title="Campus events"
              subtitle="Browse or host faculty events"
              onClick={() => navigate('/events')}
            />
          </div>
        )}

        {/* Club Head Shortcuts */}
        {role === 'club_head' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PillCard
              icon={<Plus className="w-5 h-5 text-lime" />}
              title="Create event"
              subtitle="Publish a new campus activity"
              onClick={() => navigate('/events')}
            />
            <PillCard
              icon={<QrCode className="w-5 h-5 text-lime" />}
              title="Scan QR"
              subtitle="Fast check-in at the door"
              onClick={() => navigate('/events')}
            />
            <PillCard
              icon={<Users className="w-5 h-5 text-lime" />}
              title="Post announcement"
              subtitle="Broadcast updates to members"
              onClick={() => navigate('/clubs')}
            />
            <PillCard
              icon={<Search className="w-5 h-5 text-lime" />}
              title="Lost & Found"
              subtitle="Check reported belongings"
              onClick={() => navigate('/lost-found')}
            />
          </div>
        )}

        {/* Maintenance Shortcuts */}
        {role === 'maintenance' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PillCard
              icon={<Wrench className="w-5 h-5 text-lime" />}
              title="My tasks"
              subtitle={`${maintenanceTasks.length} repairs currently open`}
              badge={<Badge variant="overdue">{maintenanceTasks.length} Open</Badge>}
              onClick={() => navigate('/maintenance')}
            />
            <PillCard
              icon={<CheckCircle2 className="w-5 h-5 text-lime" />}
              title="Update a task"
              subtitle="Log fix progress and photos"
              onClick={() => navigate('/maintenance')}
            />
          </div>
        )}

        {/* Admin Shortcuts */}
        {role === 'admin' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PillCard
              icon={<ShieldCheck className="w-5 h-5 text-rose-400" />}
              title="Administrator Board"
              subtitle="Full oversight across all 9 SJBIT branches"
              onClick={() => navigate('/admin')}
            />
            <PillCard
              icon={<UserCheck className="w-5 h-5 text-lime" />}
              title="VTU Attendance Monitor"
              subtitle="All 9 departments compliance & 75% cutoff"
              onClick={() => navigate('/attendance')}
            />
            <PillCard
              icon={<Calendar className="w-5 h-5 text-lime" />}
              title="Campus Events & Fests"
              subtitle="Review campus technical activities"
              onClick={() => navigate('/events')}
            />
            <PillCard
              icon={<Wrench className="w-5 h-5 text-lime" />}
              title="Campus Repairs & SLA"
              subtitle="Estate facility maintenance oversight"
              onClick={() => navigate('/maintenance')}
            />
          </div>
        )}
      </section>

      {/* 3. Short "What needs your attention" list (Max 5 items, zero charts) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              What needs your attention
            </h2>
            <p className="text-xs text-white/50">Items requiring action or upcoming reminders</p>
          </div>
        </div>

        {/* Student Attention List */}
        {role === 'student' && (
          <div className="p-8 rounded-2xl bg-card border border-ring/60 text-center space-y-2">
            <CheckCircle2 className="w-7 h-7 text-lime mx-auto" />
            <p className="text-sm font-semibold text-white">All caught up!</p>
            <p className="text-xs text-white/50">
              No pending registrations, approvals, or warnings requiring your attention right now.
            </p>
          </div>
        )}

        {/* Faculty Attention List */}
        {role === 'faculty' && (
          <div className="space-y-2.5">
            {facultyApprovals.length > 0 ? (
              facultyApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <Badge variant="pending">Waiting</Badge>
                    </div>
                    <p className="text-xs text-white/60">
                      Requested by {item.submittedBy} · {item.time}
                    </p>
                    <p className="text-xs text-amber-300/90 font-medium">
                      Next step: Approve or decline room allocation
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReject(item.id, item.submittedBy)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Decline
                    </Button>
                    <Button
                      variant="lime"
                      size="sm"
                      onClick={() => handleApprove(item.id, item.submittedBy)}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-card border border-ring/60 text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-lime mx-auto" />
                <p className="text-sm font-bold text-white">All clear!</p>
                <p className="text-xs text-white/50">
                  There are no pending venue requests waiting for your approval.
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    CS402 Operating Systems — Session Pending
                  </h3>
                  <Badge variant="info">Today</Badge>
                </div>
                <p className="text-xs text-white/60">Scheduled lecture completed at 11:30 AM</p>
                <p className="text-xs text-lime font-medium">
                  Next step: Mark attendance for 42 students
                </p>
              </div>
              <Button
                variant="lime"
                size="sm"
                onClick={() => navigate('/attendance')}
                className="shrink-0 self-start sm:self-center"
              >
                Mark now <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Club Head Attention List */}
        {role === 'club_head' && (
          <div className="space-y-2.5">
            <div className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">Robotics Build Sprint 2026</h3>
                  <Badge variant="lime">184 / 250 Registered</Badge>
                </div>
                <p className="text-xs text-white/60">
                  Saturday at 10:00 AM · Innovation Workshop Lab
                </p>
                <p className="text-xs text-lime font-medium">
                  Next step: Ready for QR scan check-in on event day
                </p>
              </div>
              <Button
                variant="lime"
                size="sm"
                onClick={() => navigate('/events')}
                className="shrink-0 self-start sm:self-center"
              >
                Open scanner <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    Main Auditorium Booking for Annual Fest
                  </h3>
                  <Badge variant="pending">Waiting</Badge>
                </div>
                <p className="text-xs text-white/60">
                  Requested for Dec 5 · Awaiting Dean clearance
                </p>
                <p className="text-xs text-amber-300 font-medium">
                  Next step: Waiting for faculty approval
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/venues')}
                className="shrink-0 self-start sm:self-center"
              >
                Check status <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Maintenance Staff Attention List */}
        {role === 'maintenance' && (
          <div className="space-y-2.5">
            {maintenanceTasks.length > 0 ? (
              maintenanceTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                      <Badge variant={t.priority === 'Urgent' ? 'overdue' : 'pending'}>
                        {t.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/60">{t.location}</p>
                    <p className="text-xs text-lime font-medium">
                      Next step: Complete physical inspection and mark done
                    </p>
                  </div>

                  <Button
                    variant="lime"
                    size="sm"
                    onClick={() => handleCompleteTask(t.id, t.title)}
                    className="shrink-0 self-start sm:self-center"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Mark Done
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-card border border-ring/60 text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-lime mx-auto" />
                <p className="text-sm font-bold text-white">All clear!</p>
                <p className="text-xs text-white/50">
                  No active repair tasks are currently assigned to you.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Admin Attention List */}
        {role === 'admin' && (
          <div className="space-y-2.5">
            <div className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    VTU Scheme 2022 Compliance Review — All 9 Branches
                  </h3>
                  <Badge variant="lime">92.1% Compliant</Badge>
                </div>
                <p className="text-xs text-white/60">
                  Attendance registers across 9 departments checked. Minimum 75% attendance
                  threshold maintained.
                </p>
                <p className="text-xs text-lime font-medium">
                  Next step: Inspect consolidated attendance report and branch rosters
                </p>
              </div>
              <Button
                variant="lime"
                size="sm"
                onClick={() => navigate('/admin')}
                className="shrink-0 self-start sm:self-center"
              >
                Inspect board <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    Campus Facility Health &amp; Estate SLA
                  </h3>
                  <Badge variant="approved">94.8% SLA</Badge>
                </div>
                <p className="text-xs text-white/60">
                  Average repair resolution time is 3.4 hours across 4 academic blocks
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/maintenance')}
                className="shrink-0 self-start sm:self-center"
              >
                View repairs <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
