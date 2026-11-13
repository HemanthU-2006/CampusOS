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
  Package,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { PillCard } from '@/components/ui/PillCard';

export const AnalyticsPage: React.FC = () => {
  // Global search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Aggregated Analytics Data
  const monthlyEventsData = [
    { month: 'Jul', events: 4, attendees: 420 },
    { month: 'Aug', events: 8, attendees: 890 },
    { month: 'Sep', events: 14, attendees: 1450 },
    { month: 'Oct', events: 19, attendees: 2100 },
    { month: 'Nov', events: 24, attendees: 2840 },
  ];

  const venueOccupancyData = [
    { name: 'Main Audit A', occupancy: 88, capacity: 450 },
    { name: 'Turing Hall', occupancy: 94, capacity: 120 },
    { name: 'Innovation Lab', occupancy: 76, capacity: 60 },
    { name: 'Amphitheatre', occupancy: 62, capacity: 600 },
  ];

  const ticketCategoryData = [
    { name: 'Electrical', value: 34, color: '#83F34D' },
    { name: 'HVAC', value: 28, color: '#38bdf8' },
    { name: 'IT Hardware', value: 22, color: '#f59e0b' },
    { name: 'Plumbing', value: 16, color: '#f43f5e' },
  ];

  const mockSearchResults = {
    events: [
      { id: '1', title: 'HackCampus 2026', subtitle: 'Main Auditorium · 248 Registered' },
      { id: '2', title: 'Robotics Autonomous Keynote', subtitle: 'Turing Hall · Nov 22' },
    ],
    venues: [
      { id: '1', title: 'Alan Turing Seminar Hall', subtitle: 'Capacity 120 · AC, Podium' },
      { id: '2', title: 'Main Auditorium (Hall A)', subtitle: 'Capacity 450 · Stage Lights' },
    ],
    clubs: [
      { id: '1', title: 'Robotics & AI Guild', subtitle: '48 Members · Technical' },
      { id: '2', title: 'Design & Web Society', subtitle: '36 Members · Creative' },
    ],
    lostFound: [
      { id: '1', title: 'Matte Blue Hydro Flask', subtitle: 'Found in Turing Hall row 3' },
      { id: '2', title: 'Casio fx-991EX Calculator', subtitle: 'Lost in Block 1 Room 102' },
    ],
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus Intelligence &amp; Analytics
            </h1>
            <Badge variant="lime">Live Aggregation</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Real-time telemetry, venue utilization indexes, ticket turnaround times, and global grouped search.
          </p>
        </div>
      </div>

      {/* Global Search Feature Demonstration */}
      <section className="p-6 rounded-2xl bg-card border border-ring/80 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-lime" />
            <h2 className="text-base font-bold text-white">Global Unified Search</h2>
          </div>
          <span className="text-xs font-mono text-white/40">GET /api/search?q=</span>
        </div>

        <SearchBar
          placeholder="Type to test instant grouped search across events, venues, clubs, lost & found..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
        />

        {isSearching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 animate-in fade-in-0 duration-200">
            <div className="space-y-2 p-3.5 rounded-xl bg-row border border-ring/60">
              <span className="text-xs font-bold text-lime uppercase tracking-wider">
                Events ({mockSearchResults.events.length})
              </span>
              {mockSearchResults.events.map((e) => (
                <div key={e.id} className="p-2 rounded-lg bg-card/60 border border-ring/50 text-xs">
                  <p className="font-semibold text-white truncate">{e.title}</p>
                  <p className="text-[10px] text-white/50 truncate">{e.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-row border border-ring/60">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Venues ({mockSearchResults.venues.length})
              </span>
              {mockSearchResults.venues.map((v) => (
                <div key={v.id} className="p-2 rounded-lg bg-card/60 border border-ring/50 text-xs">
                  <p className="font-semibold text-white truncate">{v.title}</p>
                  <p className="text-[10px] text-white/50 truncate">{v.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-row border border-ring/60">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Clubs ({mockSearchResults.clubs.length})
              </span>
              {mockSearchResults.clubs.map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-card/60 border border-ring/50 text-xs">
                  <p className="font-semibold text-white truncate">{c.title}</p>
                  <p className="text-[10px] text-white/50 truncate">{c.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-row border border-ring/60">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Lost &amp; Found ({mockSearchResults.lostFound.length})
              </span>
              {mockSearchResults.lostFound.map((l) => (
                <div key={l.id} className="p-2 rounded-lg bg-card/60 border border-ring/50 text-xs">
                  <p className="font-semibold text-white truncate">{l.title}</p>
                  <p className="text-[10px] text-white/50 truncate">{l.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Event Growth & Total Registrations */}
        <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Event Registrations Growth</h3>
              <p className="text-xs text-white/50">Monthly attendee engagement index</p>
            </div>
            <Badge variant="lime">+36% MoM</Badge>
          </div>

          <div className="h-64 w-full">
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
        </div>

        {/* Chart 2: Venue Utilization Rate */}
        <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Venue Utilization Index</h3>
              <p className="text-xs text-white/50">Conflict-free booking occupancy rate (%)</p>
            </div>
            <Badge variant="approved">Avg 80.2%</Badge>
          </div>

          <div className="h-64 w-full">
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
        </div>
      </div>
    </div>
  );
};
