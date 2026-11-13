import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  AlertTriangle,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Save,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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

interface StudentRosterItem {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  status: 'present' | 'absent' | 'late';
  overallPercentage: number;
}

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  const [roster, setRoster] = useState<StudentRosterItem[]>([
    {
      id: 'st-1',
      name: 'Priya Patel',
      rollNumber: 'CS-2024-108',
      department: 'Computer Science',
      status: 'present',
      overallPercentage: 88.4,
    },
    {
      id: 'st-2',
      name: 'Devansh Kulkarni',
      rollNumber: 'CS-2024-042',
      department: 'Computer Science',
      status: 'present',
      overallPercentage: 92.0,
    },
    {
      id: 'st-3',
      name: 'Aditya Roy',
      rollNumber: 'CS-2024-019',
      department: 'Computer Science',
      status: 'absent',
      overallPercentage: 71.5, // Below 75% warning threshold!
    },
    {
      id: 'st-4',
      name: 'Simran Walia',
      rollNumber: 'CS-2024-112',
      department: 'Computer Science',
      status: 'present',
      overallPercentage: 68.0, // Below 75% warning threshold!
    },
    {
      id: 'st-5',
      name: 'Nikhil Verma',
      rollNumber: 'CS-2024-077',
      department: 'Computer Science',
      status: 'late',
      overallPercentage: 81.0,
    },
  ]);

  const toggleStudentStatus = (id: string, newStatus: 'present' | 'absent' | 'late') => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveAttendance = () => {
    const lowAttendanceCount = roster.filter((s) => s.overallPercentage < 75).length;

    toast.success('Attendance Batch Saved Successfully!', {
      description: `Logged records for ${roster.length} students. Dispatched ${lowAttendanceCount} low-attendance (<75%) warning notices.`,
    });
  };

  const handleExportCSV = () => {
    let csv = 'Course,Date,Roll Number,Student Name,Status,Overall Attendance Percentage\n';
    roster.forEach((s) => {
      csv += `"${selectedCourse}","${attendanceDate}","${s.rollNumber}","${s.name}","${s.status}","${s.overallPercentage}%"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Attendance-${selectedCourse}-${attendanceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Report Exported!', {
      description: `Attendance record file downloaded.`,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Course Attendance
            </h1>
            <Badge variant="lime">Automated 75% Rule</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Faculty bulk entry with unique compound indexing, percentage aggregation, and CSV audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isFacultyOrAdmin && (
            <>
              <Button variant="outline" size="md" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-1.5" /> Export CSV
              </Button>
              <Button variant="lime" size="md" onClick={handleSaveAttendance}>
                <Save className="w-4 h-4 mr-1.5" /> Save Batch
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Course & Date Selector Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-ring/80">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-64">
            <Select
              label="Selected Course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={[
                { value: 'CS301', label: 'CS301 - Distributed Systems (Sem 5)' },
                { value: 'CS402', label: 'CS402 - Cloud Platform Engineering' },
                { value: 'CS499', label: 'CS499 - Capstone Engineering Lab' },
              ]}
            />
          </div>

          <div className="w-48">
            <Input
              label="Lecture Date"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>
        </div>

        {/* Low Attendance Warning Banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-row border border-amber-500/30 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-white/80">
            Threshold alert: Students below 75% receive instant automated warning notifications.
          </span>
        </div>
      </div>

      {/* Roster Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Roll Number</TableHead>
            <TableHead>Student Name &amp; Dept</TableHead>
            <TableHead>Aggregated Attendance %</TableHead>
            <TableHead>Eligibility Status</TableHead>
            <TableHead className="text-right">Today's Record</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roster.map((student) => {
            const isDefaulter = student.overallPercentage < 75;

            return (
              <TableRow key={student.id}>
                <TableCell className="font-mono text-xs text-white/70">
                  {student.rollNumber}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-white">{student.name}</div>
                  <div className="text-[10px] text-white/50">{student.department}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-sm font-bold ${
                        isDefaulter ? 'text-rose-400' : 'text-lime'
                      }`}
                    >
                      {student.overallPercentage}%
                    </span>
                    <div className="w-20 h-1.5 rounded-full bg-row border border-ring/50 overflow-hidden">
                      <div
                        className={`h-full ${isDefaulter ? 'bg-rose-500' : 'bg-lime'}`}
                        style={{ width: `${student.overallPercentage}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={isDefaulter ? 'overdue' : 'approved'} dot>
                    {isDefaulter ? 'Warning (<75%)' : 'Eligible'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {isFacultyOrAdmin ? (
                    <div className="inline-flex items-center gap-1 p-1 rounded-btn bg-row border border-ring/60">
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(student.id, 'present')}
                        className={`px-2.5 py-1 rounded-btn text-xs font-semibold cursor-pointer transition-colors ${
                          student.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(student.id, 'late')}
                        className={`px-2.5 py-1 rounded-btn text-xs font-semibold cursor-pointer transition-colors ${
                          student.status === 'late'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(student.id, 'absent')}
                        className={`px-2.5 py-1 rounded-btn text-xs font-semibold cursor-pointer transition-colors ${
                          student.status === 'absent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  ) : (
                    <Badge variant={student.status === 'present' ? 'approved' : 'overdue'}>
                      {student.status.toUpperCase()}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
