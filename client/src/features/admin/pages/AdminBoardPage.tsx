import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  GraduationCap,
  Calendar,
  Wrench,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
  FileSpreadsheet,
  Bell,
  Award,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PillCard } from '@/components/ui/PillCard';
import { toast } from 'sonner';

interface DepartmentDetail {
  code: string;
  name: string;
  hod: string;
  hodEmail: string;
  location: string;
  students: number;
  faculty: number;
  labs: number;
  attendanceAvg: number;
  scheme: string;
  sections: string;
}

const SJBIT_DEPARTMENTS: DepartmentDetail[] = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hod: 'Dr. Krishna A N',
    hodEmail: 'csehod@sjbit.edu.in',
    location: 'Aryabhata Block, 2nd & 3rd Floors',
    students: 720,
    faculty: 38,
    labs: 12,
    attendanceAvg: 92.4,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B, C, D (Sem 1–8)',
  },
  {
    code: 'ISE',
    name: 'Information Science & Engineering',
    hod: 'Dr. Gopalakrishna M T',
    hodEmail: 'isehod@sjbit.edu.in',
    location: 'Aryabhata Block, 1st Floor',
    students: 540,
    faculty: 26,
    labs: 8,
    attendanceAvg: 89.6,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B, C (Sem 1–8)',
  },
  {
    code: 'AI&ML',
    name: 'Artificial Intelligence & Machine Learning',
    hod: 'Dr. Abhilash C N',
    hodEmail: 'aimlhod@sjbit.edu.in',
    location: 'Sir M.V. Block, 3rd Floor',
    students: 360,
    faculty: 18,
    labs: 6,
    attendanceAvg: 93.1,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B (Sem 1–8)',
  },
  {
    code: 'CS-DS',
    name: 'CSE (Data Science)',
    hod: 'Dr. Chandrashekar D K (I/C)',
    hodEmail: 'dshod@sjbit.edu.in',
    location: 'Sir M.V. Block, 2nd Floor',
    students: 240,
    faculty: 14,
    labs: 5,
    attendanceAvg: 90.8,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B (Sem 1–8)',
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    hod: 'Dr. Chandrappa D N',
    hodEmail: 'ecehod@sjbit.edu.in',
    location: 'C.V. Raman Block, 2nd & 3rd Floors',
    students: 600,
    faculty: 32,
    labs: 10,
    attendanceAvg: 88.5,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B, C (Sem 1–8)',
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    hod: 'Dr. Chandrashekar M J',
    hodEmail: 'eeehod@sjbit.edu.in',
    location: 'C.V. Raman Block, 1st Floor',
    students: 280,
    faculty: 16,
    labs: 7,
    attendanceAvg: 87.2,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B (Sem 1–8)',
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    hod: 'Dr. Vitala H.R',
    hodEmail: 'mechhod@sjbit.edu.in',
    location: 'Mechanical Block & Central Workshops',
    students: 320,
    faculty: 20,
    labs: 9,
    attendanceAvg: 86.4,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B (Sem 1–8)',
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering',
    hod: 'Dr. Prasad C S M V',
    hodEmail: 'civhod@sjbit.edu.in',
    location: 'Civil Engineering Block & CAD Labs',
    students: 260,
    faculty: 17,
    labs: 8,
    attendanceAvg: 85.9,
    scheme: '2022 Scheme (VTU)',
    sections: 'A, B (Sem 1–8)',
  },
  {
    code: 'MBA',
    name: 'Department of Management Studies',
    hod: 'Dr. Mamatha J',
    hodEmail: 'mbahod@sjbit.edu.in',
    location: 'MBA & PG Studies Block, 4th Floor',
    students: 240,
    faculty: 15,
    labs: 4,
    attendanceAvg: 94.2,
    scheme: 'VTU PG Autonomous Regulations',
    sections: 'A, B (Sem 1–4)',
  },
];

export const AdminBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const filteredDepartments = SJBIT_DEPARTMENTS.filter((dept) => {
    const matchesBranch = selectedBranch === 'ALL' || dept.code === selectedBranch;
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.hod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const totalStudents = SJBIT_DEPARTMENTS.reduce((sum, d) => sum + d.students, 0);
  const totalFaculty = SJBIT_DEPARTMENTS.reduce((sum, d) => sum + d.faculty, 0);
  const totalLabs = SJBIT_DEPARTMENTS.reduce((sum, d) => sum + d.labs, 0);
  const overallAttendance = (
    SJBIT_DEPARTMENTS.reduce((sum, d) => sum + d.attendanceAvg, 0) / SJBIT_DEPARTMENTS.length
  ).toFixed(1);

  const handleExportConsolidatedReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Branch Code,Department Name,HOD,Block Location,Enrolled Students,Faculty Count,Labs,Avg Attendance,VTU Scheme\n' +
      SJBIT_DEPARTMENTS.map(
        (d) =>
          `"${d.code}","${d.name}","${d.hod}","${d.location}",${d.students},${d.faculty},${d.labs},${d.attendanceAvg}%,"${d.scheme}"`
      ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SJBIT_CampusWide_Admin_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Consolidated Audit Report Downloaded', {
      description: 'VTU compliance & department roster data across all 9 branches exported.',
    });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      toast.error('Please enter both title and announcement text');
      return;
    }
    setBroadcastModalOpen(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
    toast.success('Campus Circular Dispatched', {
      description: 'Official notice broadcasted to all 9 department boards, faculty, and students.',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Executive Principal Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-rose-500/30 relative overflow-hidden shadow-[0_0_40px_rgba(244,63,94,0.08)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  Administrator &amp; Principal Board
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  SJBIT Campus Executive Oversight
                </h1>
              </div>
            </div>

            <p className="text-sm text-white/70 max-w-3xl leading-relaxed">
              Centralized governance across all 9 engineering and management departments at{' '}
              <strong className="text-white">SJB Institute of Technology, Bengaluru</strong>. 
              Monitor academic attendance compliance under VTU regulations, campus repair SLAs, and institutional operations.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-row border border-ring/60">
                <Building2 className="w-3.5 h-3.5 text-lime" />
                Principal: Dr. K. V. Mahendra Prashanth
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-row border border-ring/60">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                NAAC A+ Accredited · VTU Autonomous
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Campus Systems Operational
              </span>
            </div>

            {/* Official Admission & Regulatory Counseling Codes */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/70">
              <span className="px-2.5 py-0.5 rounded-md bg-row border border-ring/60 text-white/90 font-medium">
                CET: <strong className="text-lime">E115</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-row border border-ring/60 text-white/90 font-medium">
                COMED-K: <strong className="text-lime">E107</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-row border border-ring/60 text-white/90 font-medium">
                MBA: <strong className="text-lime">B288</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-row border border-ring/60 text-white/90 font-medium">
                M.Tech: <strong className="text-lime">T871</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-row border border-ring/60 text-white/90 font-medium">
                MCA: <strong className="text-lime">C547MC</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <Button
              variant="lime"
              size="sm"
              onClick={handleExportConsolidatedReport}
              className="font-bold shadow-[0_0_16px_rgba(131,243,77,0.35)]"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Export 9-Branch Audit
            </Button>
            <Button
              variant="white"
              size="sm"
              onClick={() => setBroadcastModalOpen(true)}
              className="border border-ring/80 hover:border-lime/40"
            >
              <Bell className="w-4 h-4 mr-1.5 text-lime" />
              Broadcast Circular
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Campus-Wide Executive KPI Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Total Branches
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">9</h3>
            <Badge variant="lime" className="text-[10px]">All Active</Badge>
          </div>
          <p className="text-[11px] text-white/60">8 B.E. Programs + MBA</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Campus Enrollment
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">{totalStudents.toLocaleString()}</h3>
            <Badge variant="info" className="text-[10px]">VTU Scheme</Badge>
          </div>
          <p className="text-[11px] text-white/60">{totalFaculty} Full-Time Faculty</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Overall Attendance
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-lime">{overallAttendance}%</h3>
            <Badge variant="approved" className="text-[10px]">&gt; 75% Compliant</Badge>
          </div>
          <p className="text-[11px] text-white/60">VTU Norms Met Institution-wide</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Specialized Labs
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">{totalLabs}</h3>
            <Badge variant="pending" className="text-[10px]">R&amp;D Equipped</Badge>
          </div>
          <p className="text-[11px] text-white/60">Across 4 Academic Blocks</p>
        </div>
      </section>

      {/* 3. Quick Administrative Pathways */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white tracking-tight">
          Administrative Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PillCard
            icon={<GraduationCap className="w-5 h-5 text-lime" />}
            title="VTU Attendance System"
            subtitle="View student registers & 75% shortfalls"
            onClick={() => navigate('/attendance')}
          />
          <PillCard
            icon={<Calendar className="w-5 h-5 text-lime" />}
            title="Campus Events & Fests"
            subtitle="Hackathons, seminars, and technical fests"
            onClick={() => navigate('/events')}
          />
          <PillCard
            icon={<Wrench className="w-5 h-5 text-lime" />}
            title="Campus Estate & Repairs"
            subtitle="Campus facility health & physical fixes"
            onClick={() => navigate('/maintenance')}
          />
          <PillCard
            icon={<Users className="w-5 h-5 text-lime" />}
            title="Clubs & Societies"
            subtitle="Student organizations across departments"
            onClick={() => navigate('/clubs')}
          />
        </div>
      </section>

      {/* 4. Branch Directory & Governance Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              All 9 SJBIT Academic Departments
            </h2>
            <p className="text-xs text-white/50">
              Department-level oversight, HOD leadership, and active academic infrastructure.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter department, HOD..."
              className="w-full bg-card/80 border border-ring rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime/60 transition-colors"
            />
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1 overflow-x-auto">
          {['ALL', 'CSE', 'ISE', 'AI&ML', 'CS-DS', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setSelectedBranch(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedBranch === code
                  ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.35)]'
                  : 'bg-card hover:bg-row text-white/70 hover:text-white border border-ring/60'
              }`}
            >
              {code === 'ALL' ? 'All 9 Branches' : code}
            </button>
          ))}
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.code}
              className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-lime/10 border border-lime/30 text-lime font-mono font-bold text-xs">
                      {dept.code}
                    </span>
                    <Badge variant="lime" className="text-[10px]">
                      {dept.attendanceAvg}% Attd
                    </Badge>
                  </div>
                  <span className="text-[10px] text-white/50">{dept.scheme}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">
                    HOD: <strong className="text-white">{dept.hod}</strong>
                  </p>
                  <p className="text-[11px] text-lime/80">{dept.hodEmail}</p>
                </div>

                <div className="pt-2 border-t border-ring/50 space-y-1.5 text-xs text-white/70">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Location:</span>
                    <span className="font-medium text-white/90 text-right">{dept.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Enrolled Students:</span>
                    <span className="font-bold text-white">{dept.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Faculty &amp; Labs:</span>
                    <span>{dept.faculty} Faculty · {dept.labs} Labs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Sections:</span>
                    <span className="text-white/80">{dept.sections}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-ring/50 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/attendance')}
                  className="w-full text-xs border-ring/80 hover:border-lime/40 text-white"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-lime" />
                  View Attendance
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast.success(`${dept.code} Status Normal`, {
                      description: `${dept.name} is compliant with VTU guidelines.`,
                    });
                  }}
                  className="text-xs text-white/60 hover:text-white hover:bg-row"
                >
                  Audit
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-2">
            <Search className="w-8 h-8 text-white/30 mx-auto" />
            <p className="text-sm font-semibold text-white">No branches matched</p>
            <p className="text-xs text-white/50">
              Clear your search or switch to "All 9 Branches".
            </p>
          </div>
        )}
      </section>

      {/* 5. Broadcast Circular Modal */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#111111] border border-ring shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-lime" />
                <h3 className="text-lg font-bold text-white">Broadcast Campus Circular</h3>
              </div>
              <button
                type="button"
                onClick={() => setBroadcastModalOpen(false)}
                className="text-white/50 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/60">
              This notice will be published to student and faculty dashboards across all 9 SJBIT branches under the Principal's seal.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Circular Subject
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. VTU Semester Exam Timetable Announcement"
                  className="w-full bg-card border border-ring rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime/60"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Official Notice Body
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter instructions, dates, or circular contents..."
                  rows={4}
                  className="w-full bg-card border border-ring rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime/60"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBroadcastModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="lime" size="sm" className="font-bold">
                  Send Circular
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
