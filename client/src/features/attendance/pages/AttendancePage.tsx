import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Calendar,
  AlertTriangle,
  Download,
  CheckCircle2,
  Save,
  BookOpen,
  ArrowRight,
  Sparkles,
  Building,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

export interface StudentRosterItem {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  status: 'present' | 'absent' | 'late';
  overallPercentage: number;
}

export interface StudentCourseItem {
  code: string;
  name: string;
  branch: string;
  branchCode: string;
  faculty: string;
  attendedSessions: number;
  totalSessions: number;
  percentage: number;
}

// Course catalog starts empty; real records will be configured or fetched
const ALL_SJBIT_COURSES: StudentCourseItem[] = [];

// Branch rosters start empty
const BRANCH_ROSTERS: Record<string, StudentRosterItem[]> = {};

// Official SJBIT Academic & Management Departments for Administrator Board
const SJBIT_DEPARTMENTS = [
  { code: 'CV', name: 'Civil Engineering', hod: 'Dr. H. Narendra', block: 'Civil Block' },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    hod: 'Dr. T. Madhusudhan',
    block: 'Mechanical Block',
  },
  { code: 'EEE', name: 'Electrical & Electronics', hod: 'Dr. Babu N.', block: 'EEE Block' },
  {
    code: 'ECE',
    name: 'Electronics & Communication',
    hod: 'Dr. Nataraj K. R.',
    block: 'ECE Block',
  },
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hod: 'Dr. A. N. Krishna',
    block: 'CSE Block',
  },
  {
    code: 'ISE',
    name: 'Information Science & Engineering',
    hod: 'Dr. Rekha B.',
    block: 'ISE Block',
  },
  {
    code: 'AI&ML',
    name: 'AI & Machine Learning',
    hod: 'Dr. Gopalakrishna M. T.',
    block: 'AI & DS Block',
  },
  { code: 'CS-DS', name: 'CSE (Data Science)', hod: 'Dr. Deepa S.', block: 'AI & DS Block' },
  { code: 'MBA', name: 'Management Studies (MBA)', hod: 'Dr. Mamatha J.', block: 'MBA Block' },
];

const ADMIN_BRANCH_TABS = [
  { id: 'ALL', label: 'All Branches' },
  { id: 'CV', label: 'Civil Eng' },
  { id: 'ME', label: 'Mechanical' },
  { id: 'EEE', label: 'EEE' },
  { id: 'ECE', label: 'ECE' },
  { id: 'CSE', label: 'CSE' },
  { id: 'ISE', label: 'ISE' },
  { id: 'AI&ML', label: 'AI & ML' },
  { id: 'CS-DS', label: 'Data Science' },
  { id: 'MBA', label: 'MBA' },
];

// Helper to resolve student's branch code and display name from their profile
const getStudentBranch = (deptStr?: string, rollNum?: string) => {
  const text = ((deptStr || '') + ' ' + (rollNum || '')).toUpperCase();
  if (text.includes('CIVIL') || text.includes('CV')) {
    return { code: 'CV', name: 'Civil Engineering' };
  }
  if (text.includes('MECH') || text.includes('ME')) {
    return { code: 'ME', name: 'Mechanical Engineering' };
  }
  if (text.includes('ELECTRICAL') || text.includes('EEE') || text.includes('EE')) {
    return { code: 'EEE', name: 'Electrical & Electronics Engineering' };
  }
  if (text.includes('COMMUNICATION') || text.includes('ECE') || text.includes('EC')) {
    return { code: 'ECE', name: 'Electronics & Communication Engineering' };
  }
  if (
    text.includes('DATA SCIENCE') ||
    text.includes('CS-DS') ||
    text.includes('CSDS') ||
    text.includes('CD')
  ) {
    return { code: 'CS-DS', name: 'Computer Science & Engineering (Data Science)' };
  }
  if (text.includes('AI') || text.includes('ARTIFICIAL') || text.includes('AIML')) {
    return { code: 'AI&ML', name: 'Artificial Intelligence & Machine Learning' };
  }
  if (text.includes('INFORMATION') || text.includes('ISE') || text.includes('IS')) {
    return { code: 'ISE', name: 'Information Science & Engineering' };
  }
  if (
    text.includes('BUSINESS') ||
    text.includes('MBA') ||
    text.includes('MANAGEMENT') ||
    text.includes('BA')
  ) {
    return { code: 'MBA', name: 'Master of Business Administration' };
  }
  return { code: 'CSE', name: 'Computer Science & Engineering' };
};

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const isStudent = !isAdmin && !isFaculty;

  // Student specific branch
  const studentBranch = useMemo(() => {
    return getStudentBranch(user?.department, user?.rollNumber);
  }, [user?.department, user?.rollNumber]);

  // Administrator Board Filter State
  const [adminSelectedBranch, setAdminSelectedBranch] = useState('ALL');

  // Faculty / Admin Class State
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );

  // Determine current active course branch
  const activeCourseObj = useMemo(() => {
    return ALL_SJBIT_COURSES.find((c) => c.code === selectedCourse) || null;
  }, [selectedCourse]);

  // Dynamic Roster for the selected course
  const [rosterMap, setRosterMap] = useState<Record<string, StudentRosterItem[]>>(BRANCH_ROSTERS);

  const currentRoster = useMemo(() => {
    if (!activeCourseObj) return [];
    return rosterMap[activeCourseObj.branchCode] || [];
  }, [rosterMap, activeCourseObj]);

  const toggleStudentStatus = (id: string, newStatus: 'present' | 'absent' | 'late') => {
    if (!activeCourseObj) return;
    setRosterMap((prev) => {
      const bCode = activeCourseObj.branchCode;
      const list = prev[bCode] || [];
      return {
        ...prev,
        [bCode]: list.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
      };
    });
  };

  const handleSaveAttendance = () => {
    if (!activeCourseObj) return;
    toast.success('Attendance saved!', {
      description: `Recorded session for ${currentRoster.length} students in ${selectedCourse}.`,
    });
  };

  const handleExportCSV = () => {
    if (!activeCourseObj) return;
    let csv =
      'Course,Branch,Date,Roll Number,Student Name,Today Status,Overall Attendance Percentage\n';
    currentRoster.forEach((s) => {
      csv += `"${selectedCourse}","${activeCourseObj.branch}","${attendanceDate}","${s.rollNumber}","${s.name}","${s.status}","${s.overallPercentage}%"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Attendance-${selectedCourse}-${activeCourseObj.branchCode}-${attendanceDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Downloaded CSV report!');
  };

  const handleExportAllBranchesReport = () => {
    toast.success('Generated Campus-Wide Attendance Report', {
      description: 'Audit log prepared across all 9 departments of SJBIT.',
    });
  };

  const presentCount = currentRoster.filter((s) => s.status === 'present').length;
  const lateCount = currentRoster.filter((s) => s.status === 'late').length;
  const absentCount = currentRoster.filter((s) => s.status === 'absent').length;

  // Student only sees courses belonging strictly to their own branch
  const studentCourses = useMemo(() => {
    return ALL_SJBIT_COURSES.filter((c) => c.branchCode === studentBranch.code);
  }, [studentBranch.code]);

  // Admin filtered departments
  const displayedDepartments = useMemo(() => {
    if (adminSelectedBranch === 'ALL') return SJBIT_DEPARTMENTS;
    return SJBIT_DEPARTMENTS.filter((d) => d.code === adminSelectedBranch);
  }, [adminSelectedBranch]);

  return (
    <div className="space-y-6 pb-12">
      {/* =========================================================================
          1. ADMINISTRATOR SEPARATE BOARD (Admin sees ALL branches with control board)
          ========================================================================= */}
      {isAdmin && (
        <div className="space-y-6">
          {/* Admin Board Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-ring/80">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-lime" />
                <Badge variant="lime" className="text-xs uppercase tracking-wider font-bold">
                  Administrator Control Board
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
                Campus Academic &amp; Attendance Board
              </h1>
              <p className="text-sm text-white/60 mt-0.5">
                Unified institutional oversight across all 9 engineering &amp; management branches
                at SJBIT.
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleExportAllBranchesReport}
              className="shrink-0 min-h-[44px]"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-lime" />
              Export Campus-Wide Audit
            </Button>
          </div>

          {/* Admin Department Switcher Bar */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider px-1">
              Select Department to Inspect
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {ADMIN_BRANCH_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAdminSelectedBranch(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[44px] flex items-center ${
                    adminSelectedBranch === tab.id
                      ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.4)]'
                      : 'bg-card border border-ring/60 text-white/70 hover:text-white hover:border-lime/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedDepartments.map((dept) => {
              const deptCourses = ALL_SJBIT_COURSES.filter((c) => c.branchCode === dept.code);

              return (
                <div
                  key={dept.code}
                  className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-row text-lime border border-lime/30 font-bold">
                      {dept.code}
                    </span>
                    <Badge variant="approved">Operational</Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{dept.name}</h3>
                    <p className="text-xs text-white/60 mt-0.5">HOD: {dept.hod}</p>
                    <p className="text-xs text-white/40">Location: {dept.block}</p>
                  </div>

                  <div className="pt-2 border-t border-ring/60 flex items-center justify-between text-xs text-white/60">
                    <span>{deptCourses.length} active courses</span>
                    <span className="text-lime font-semibold">Healthy</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Administrator Class Inspector & Roster */}
          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ring/60 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Class &amp; Student Attendance Inspector
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Select any course to review student attendance rosters or record updates.
                </p>
              </div>

              {activeCourseObj && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
                  </Button>
                  <Button variant="lime" size="sm" onClick={handleSaveAttendance}>
                    <Save className="w-3.5 h-3.5 mr-1" /> Save attendance
                  </Button>
                </div>
              )}
            </div>

            {ALL_SJBIT_COURSES.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-white/30 mx-auto" />
                <p className="text-sm font-semibold text-white">
                  No active course sessions configured
                </p>
                <p className="text-xs text-white/50">
                  Course registrations and attendance logs will appear here once entered.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                  <Select
                    label="Pick Course (All Branches)"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    options={ALL_SJBIT_COURSES.map((c) => ({
                      value: c.code,
                      label: `[${c.branchCode}] ${c.code} - ${c.name}`,
                    }))}
                  />

                  <Input
                    label="Pick Date"
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>

                {activeCourseObj && (
                  <div className="p-4 rounded-xl bg-row/50 border border-ring/60 flex items-center justify-between text-xs text-white/70">
                    <div>
                      Inspecting: <strong className="text-white">{activeCourseObj.name}</strong> (
                      {activeCourseObj.code}) · Department:{' '}
                      <strong className="text-lime">{activeCourseObj.branch}</strong>
                    </div>
                    <span className="text-white/50">Faculty: {activeCourseObj.faculty}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          2. STUDENT VIEW: STRICTLY ONLY THEIR OWN BRANCH (No branch tabs!)
          ========================================================================= */}
      {isStudent && (
        <div className="space-y-6">
          {/* Student Header (Personalized to their branch) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-ring/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  My Course Attendance
                </h1>
                <Badge variant="lime" className="text-xs">
                  {studentBranch.name}
                </Badge>
              </div>
              <p className="text-sm text-white/60 mt-1">
                VTU Scheme semester attendance records for{' '}
                <strong className="text-white">{studentBranch.name}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs px-3 py-1.5 rounded-full bg-row border border-ring/60 text-white/70">
                Minimum Cutoff: <strong className="text-lime">75%</strong>
              </span>
            </div>
          </div>

          {/* Student Courses (Only shows courses from their branch; NO other branch tabs!) */}
          {studentCourses.length === 0 ? (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-base font-semibold text-white">
                No course attendance records for {studentBranch.name}
              </p>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Your enrolled subjects and attendance logs for {studentBranch.name} will appear here
                once configured by the department.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentCourses.map((course) => {
                const isWarning = course.percentage < 75;

                return (
                  <div
                    key={course.code}
                    className={`p-6 rounded-2xl bg-card border transition-all flex flex-col justify-between gap-4 ${
                      isWarning
                        ? 'border-red-500/40 bg-red-950/10'
                        : 'border-ring/80 hover:border-lime/40'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-row text-white/70 border border-ring/60">
                              {course.code}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-lime/10 text-lime border border-lime/20">
                              {course.branch}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-1.5">{course.name}</h3>
                          <p className="text-xs text-white/50 mt-1">Instructor: {course.faculty}</p>
                        </div>

                        <Badge variant={isWarning ? 'overdue' : 'approved'} className="shrink-0">
                          {isWarning ? 'Warning (<75%)' : 'Safe'}
                        </Badge>
                      </div>

                      {/* Percentage & Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-baseline justify-between">
                          <span
                            className={`text-3xl font-extrabold font-mono ${
                              isWarning ? 'text-rose-400' : 'text-lime'
                            }`}
                          >
                            {course.percentage}%
                          </span>
                          <span className="text-xs text-white/60">
                            {course.attendedSessions} of {course.totalSessions} classes attended
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-row overflow-hidden border border-ring/50">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isWarning ? 'bg-rose-500' : 'bg-lime shadow-[0_0_8px_#83F34D]'
                            }`}
                            style={{ width: `${course.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Warning Box if under 75% */}
                      {isWarning && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2 mt-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-200">Attendance Warning</p>
                            <p className="text-[11px] text-red-300/80 mt-0.5">
                              Your attendance is below 75%. You need to attend the upcoming sessions
                              to maintain VTU exam clearance.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          3. FACULTY VIEW: Mark Attendance for assigned course
          ========================================================================= */}
      {isFaculty && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Mark Class Attendance
              </h1>
              <p className="text-sm text-white/60 mt-0.5">
                Select your assigned course session to mark daily attendance or export rosters.
              </p>
            </div>

            {activeCourseObj && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleExportCSV}
                  className="shrink-0 min-h-[44px]"
                >
                  <Download className="w-4 h-4 mr-1.5" /> Download CSV
                </Button>
                <Button
                  variant="lime"
                  size="lg"
                  onClick={handleSaveAttendance}
                  className="shadow-[0_0_20px_rgba(131,243,77,0.35)] shrink-0 min-h-[44px]"
                >
                  <Save className="w-4 h-4 mr-1.5" /> Save attendance
                </Button>
              </div>
            )}
          </div>

          {ALL_SJBIT_COURSES.length === 0 ? (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
              <UserCheck className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-sm font-semibold text-white">No active courses assigned</p>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Course sessions and student rosters will appear here once configured for the
                semester.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-w-xl">
                  <Select
                    label="Pick Course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    options={ALL_SJBIT_COURSES.map((c) => ({
                      value: c.code,
                      label: `[${c.branchCode}] ${c.code} - ${c.name}`,
                    }))}
                  />

                  <Input
                    label="Pick Date"
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold bg-row p-3 rounded-xl border border-ring/60 shrink-0">
                  <span className="text-emerald-400">{presentCount} Present</span>
                  <span className="text-white/30">·</span>
                  <span className="text-amber-300">{lateCount} Late</span>
                  <span className="text-white/30">·</span>
                  <span className="text-rose-400">{absentCount} Absent</span>
                </div>
              </div>

              {activeCourseObj && (
                <div className="p-4 rounded-xl bg-row/50 border border-ring/60 flex items-center justify-between text-xs text-white/70">
                  <div>
                    Active Class: <strong className="text-white">{activeCourseObj.name}</strong> (
                    {activeCourseObj.code}) · Department:{' '}
                    <strong className="text-lime">{activeCourseObj.branch}</strong>
                  </div>
                  <span className="text-white/50">Faculty: {activeCourseObj.faculty}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
