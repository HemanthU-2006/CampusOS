import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Building2,
  Calendar,
  Wrench,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // 1. Event Attendees Data
  const monthlyEventsData = [
    { month: 'Jul', attendees: 420 },
    { month: 'Aug', attendees: 890 },
    { month: 'Sep', attendees: 1450 },
    { month: 'Oct', attendees: 2100 },
    { month: 'Nov', attendees: 2840 },
  ];

  // 2. Real SJBIT Venue Utilization across campus facilities
  const venueOccupancyData = [
    { name: 'BGS Audit', occupancy: 92 },
    { name: 'CSE Hall', occupancy: 85 },
    { name: 'Civil CAD', occupancy: 81 },
    { name: 'Mech Lab', occupancy: 78 },
    { name: 'EEE Lab', occupancy: 76 },
    { name: 'AI Lab', occupancy: 89 },
    { name: 'MBA Hall', occupancy: 84 },
    { name: 'Amphi', occupancy: 68 },
  ];

  // 3. Maintenance Breakdown
  const ticketCategoryData = [
    { name: 'Electrical', value: 38, color: '#83F34D' },
    { name: 'HVAC & AC', value: 26, color: '#38bdf8' },
    { name: 'Lab Hardware', value: 22, color: '#f59e0b' },
    { name: 'Plumbing', value: 14, color: '#f43f5e' },
  ];

  // 4. Department Attendance Health Across ALL SJBIT Branches
  const departmentAttendanceData = [
    { dept: 'CV', rate: 88 },
    { dept: 'ME', rate: 86 },
    { dept: 'EEE', rate: 89 },
    { dept: 'ECE', rate: 91 },
    { dept: 'CSE', rate: 93 },
    { dept: 'ISE', rate: 92 },
    { dept: 'AI&ML', rate: 92 },
    { dept: 'CS-DS', rate: 90 },
    { dept: 'MBA', rate: 94 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with One Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Analytics
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Key insights on hall utilization, event turnout, and facility repairs at SJBIT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="lime" className="px-3 py-1 text-xs">
            SJBIT Campus Overview
          </Badge>
        </div>
      </div>

      {/* 2. Exactly 4 Clean Visual Charts with 1-Line Takeaways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Event Turnout */}
        <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Event Turnout Growth</h3>
            <Badge variant="lime">+36% Growth</Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEventsData}>
                <defs>
                  <linearGradient id="limeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#83F34D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#83F34D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#232323" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B1B1B',
                    border: '1px solid #2F2F2F',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendees"
                  stroke="#83F34D"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#limeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plain 1-Line Takeaway */}
          <p className="text-xs text-lime font-medium pt-1">
            Takeaway: Student participation has grown 36% this semester across tech fests and
            workshops.
          </p>
        </div>

        {/* Chart 2: Hall & Lab Utilization */}
        <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Venue &amp; Lab Booking Rates</h3>
            <Badge variant="approved">Avg 82%</Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={venueOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232323" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B1B1B',
                    border: '1px solid #2F2F2F',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="occupancy" fill="#83F34D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Plain 1-Line Takeaway */}
          <p className="text-xs text-lime font-medium pt-1">
            Takeaway: BGS Auditorium, CSE Hall, and AI Lab are at peak occupancy across campus
            events.
          </p>
        </div>

        {/* Chart 3: Repair Categories */}
        <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Campus Repairs by Type</h3>
            <Badge variant="info">3.2h Avg Fix</Badge>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ticketCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B1B1B',
                    border: '1px solid #2F2F2F',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Plain 1-Line Takeaway */}
          <p className="text-xs text-lime font-medium pt-1">
            Takeaway: Electrical and AC issues make up 64% of reports, with 88% resolved within 4
            hours.
          </p>
        </div>

        {/* Chart 4: Department Attendance Health */}
        <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Department Attendance Average</h3>
            <Badge variant="approved">Safe &gt;75%</Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232323" />
                <XAxis dataKey="dept" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} unit="%" domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B1B1B',
                    border: '1px solid #2F2F2F',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rate" fill="#83F34D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Plain 1-Line Takeaway */}
          <p className="text-xs text-lime font-medium pt-1">
            Takeaway: Over 91% of students maintain safe attendance across all 9 academic branches
            at SJBIT.
          </p>
        </div>
      </div>

      {/* 3. Collapsible "More Details" Section */}
      <div className="p-5 rounded-2xl bg-card border border-ring/80">
        <button
          type="button"
          onClick={() => setShowMoreDetails((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div>
            <h4 className="text-sm font-bold text-white">More Details &amp; Raw Summaries</h4>
            <p className="text-xs text-white/50">
              Audit logs, facility SLA compliance, and department breakdown
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-white/60 transition-transform ${
              showMoreDetails ? 'rotate-180 text-lime' : ''
            }`}
          />
        </button>

        {showMoreDetails && (
          <div className="pt-4 mt-4 border-t border-ring/60 space-y-3 text-xs text-white/70">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-row border border-ring/60">
                <span className="text-white/40 block text-[11px]">Total Active Users</span>
                <span className="text-lg font-bold text-white">2,840</span>
                <p className="text-[10px] text-white/40 mt-1">Students &amp; Faculty</p>
              </div>
              <div className="p-3 rounded-xl bg-row border border-ring/60">
                <span className="text-white/40 block text-[11px]">Average Fix Time</span>
                <span className="text-lg font-bold text-lime">3.2 Hours</span>
                <p className="text-[10px] text-white/40 mt-1">SLA Target: &lt;6 hours</p>
              </div>
              <div className="p-3 rounded-xl bg-row border border-ring/60">
                <span className="text-white/40 block text-[11px]">Lab Hardware Count</span>
                <span className="text-lg font-bold text-white">96% Available</span>
                <p className="text-[10px] text-white/40 mt-1">0 overdue items</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
