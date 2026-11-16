import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Search,
  UserCheck,
  Wrench,
  Flame,
  FileCheck,
  Activity,
  HeartHandshake,
  Clock,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { PillCard } from '@/components/ui/PillCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SJBIT_BRANCHES, DepartmentBranch } from '@/features/departments/data/branchesData';
import { BranchDetailsModal } from '@/features/departments/components/BranchDetailsModal';
import Hero from '@/components/Hero';
import { Leadership, Departments, Infrastructure, FinalCTA } from '@/components/Sections';

export const LandingPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<DepartmentBranch | null>(null);

  // Map the verified 9 SJBIT branches to the cinematic Departments component format
  const departmentsData = SJBIT_BRANCHES.map((b) => ({
    code: b.code,
    name: b.name,
    hod: b.hod,
    location: b.block,
    faculty: b.facultyCount,
    rawBranch: b,
  }));

  const handleSelectBranch = (dept: any) => {
    const found = dept.rawBranch || SJBIT_BRANCHES.find((b) => b.code === dept.code);
    if (found) {
      setSelectedBranch(found);
    }
  };

  return (
    <div className="text-white selection:bg-lime selection:text-lime-ink">
      {/* =========================================================================
          1. CINEMATIC HERO (With existing drone video preserved unchanged)
          ========================================================================= */}
      <Hero
        background={
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/frames/desk/f_0001.webp"
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-105"
          >
            <source src="/media/clip.mp4" type="video/mp4" />
          </video>
        }
      />

      {/* =========================================================================
          2. EXCEPTIONAL LEADERSHIP & VISION (Cinematic Spotlight Cards)
          ========================================================================= */}
      <Leadership />

      {/* =========================================================================
          3. ALL 9 SJBIT DEPARTMENTS (Cinematic Grid with Interactive Details Modal)
          ========================================================================= */}
      <Departments
        departments={departmentsData}
        onSelectBranch={handleSelectBranch}
      />

      {/* =========================================================================
          4. WORLD-CLASS CAMPUS INFRASTRUCTURE (Parallax Bento Grid)
          ========================================================================= */}
      <Infrastructure />

      {/* =========================================================================
          5. INDUSTRY COLLABORATIONS & TOP RECRUITERS
          ========================================================================= */}
      <section
        id="partners"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-white/[0.08]"
      >
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
            Industry Collaborations &amp; Placements
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Bridging Academia &amp; Industry Excellence
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Leading multinational technology corporations and global research institutions
            partnering with SJBIT for campus recruitments, student internships, and state-of-the-art
            Centers of Excellence.
          </p>
        </div>

        {/* 12 Industry Partner Logo Tiles (As in official SJBIT portal) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Bentley', file: 'bentley.jpg' },
            { name: 'Cisco', file: 'cisco.jpg' },
            { name: 'Creative Infotech', file: 'creative-infotech.jpg' },
            { name: 'Ethnotech Academy', file: 'ethnotech.jpg' },
            { name: 'Google Partner', file: 'google-partner.jpg' },
            { name: 'IBM', file: 'ibm.jpg' },
            { name: 'Intel', file: 'intel.jpg' },
            { name: 'National Instruments', file: 'national-instruments.jpg' },
            { name: 'Oracle', file: 'oracle.jpg' },
            { name: 'Rexroth (A Bosch Company)', file: 'rexroth.jpg' },
            { name: 'Texas Instruments', file: 'texas-instruments.jpg' },
            {
              name: 'University of Agricultural Sciences',
              file: 'university-agricultural-sciences.jpg',
            },
          ].map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-2xl p-4 flex items-center justify-center border border-white/20 shadow-md h-24 hover:scale-105 hover:shadow-xl transition-all group"
            >
              <img
                src={`/industry/${c.file}`}
                alt={c.name}
                className="max-h-14 max-w-full object-contain filter group-hover:brightness-105 transition-all"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Placement Key Highlights */}
        <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-extrabold text-white">
              Department Placement Drives &amp; Internships
            </h4>
            <p className="text-xs text-white/60">
              Active recruitment across all 9 departments: CSE, ISE, AI&amp;ML, CS-DS, ECE, EEE,
              Mechanical, Civil, and MBA.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
              TCS
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
              Tech Mahindra
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
              Cognizant
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
              Mindtree
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
              JSW
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. WHAT'S HAPPENING IN SJBIT (Live News & Milestones)
          ========================================================================= */}
      <section
        id="news"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-white/[0.08]"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
            Campus Pulse
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            What's Happening in SJBIT
          </h2>
          <p className="text-sm text-white/70">
            Live technical symposiums, capstone exhibitions, MoUs, and inter-collegiate festivals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3 hover:border-lime/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-amber-400" /> Major Event
              </span>
              <h3 className="font-extrabold text-white text-base">
                Major Project Exhibition 2026
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Intra-department capstone project showcase judged by senior IEEE fellows and industry
                leaders with cash awards.
              </p>
            </div>
            <span className="text-[11px] text-white/50 flex items-center gap-1 pt-3 border-t border-white/[0.08]">
              <Clock className="w-3 h-3 text-lime" /> Scheduled for May 2026
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3 hover:border-lime/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-rose-400" /> Flagship Fest
              </span>
              <h3 className="font-extrabold text-white text-base">
                VARCHASVA &amp; ARNAAV 2026
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Inter-collegiate national technical and cultural fiesta bringing 60+ engineering
                colleges together.
              </p>
            </div>
            <span className="text-[11px] text-white/50 flex items-center gap-1 pt-3 border-t border-white/[0.08]">
              <Clock className="w-3 h-3 text-lime" /> Registrations Open via Portal
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3 hover:border-lime/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                <FileCheck className="w-3 h-3 text-sky-400" /> Faculty Development
              </span>
              <h3 className="font-extrabold text-white text-base">
                6-Day FDP on Agentic AI &amp; Cloud
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Hands-on training session for professors across CSE, ISE, and AI&amp;ML sponsored by
                VTU Human Resource Center.
              </p>
            </div>
            <span className="text-[11px] text-white/50 flex items-center gap-1 pt-3 border-t border-white/[0.08]">
              <Clock className="w-3 h-3 text-lime" /> BGS Seminar Complex
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3 hover:border-lime/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <Activity className="w-3 h-3 text-emerald-400" /> Research MoU
              </span>
              <h3 className="font-extrabold text-white text-base">
                MoU with PRDC Pvt Ltd
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Joint technological initiative for Smart Grid, Renewable Energy, and EV Powertrain
                simulation in EEE &amp; MECH.
              </p>
            </div>
            <span className="text-[11px] text-white/50 flex items-center gap-1 pt-3 border-t border-white/[0.08]">
              <Clock className="w-3 h-3 text-lime" /> Signed at Principal Secretariat
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. STUDENT SUPPORT & STATUTORY GOVERNANCE CELLS
          ========================================================================= */}
      <section
        id="governance"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-white/[0.08]"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
            Institutional Governance
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Student Support &amp; Welfare Cells
          </h2>
          <p className="text-sm text-white/70">
            Fully statutory UGC and VTU compliant student grievance, anti-ragging, and counseling
            support helplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Proctoring System</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Every student is assigned a dedicated faculty mentor (1:20 ratio) for continuous
              academic counsel and parent communication.
            </p>
            <span className="text-[11px] text-lime font-bold block">Bi-weekly Counsel Sessions</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Anti-Ragging Committee</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Strict UGC-compliant zero-tolerance policy. Monitored by campus security and dedicated
              staff squads.
            </p>
            <span className="text-[11px] text-rose-300 font-bold block">
              Toll-Free: 1800-180-5522
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Women Safety Cell (ICC)</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Internal Complaints Committee ensuring equitable, secure, and respectful working and
              learning campus spaces.
            </p>
            <span className="text-[11px] text-purple-300 font-bold block">
              Helpline: +91-7204081185
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#121412] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">Student Grievance Cell</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Equal Opportunity Cell, SC/ST Development Committee, and online grievance redressal
              mechanism.
            </p>
            <span className="text-[11px] text-amber-300 font-bold block">
              Desk: +91-9902310181
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CAMPUS MODULES QUICK ACCESS
          ========================================================================= */}
      <section
        id="modules"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-white/[0.08]"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
            Campus Modules
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Students, Faculty &amp; Staff
          </h2>
          <p className="text-sm text-white/60">
            Campus fests, clubs, branch details, and maintenance fixes unified in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link to="/events">
            <PillCard
              icon={<Calendar className="w-5 h-5 text-lime" />}
              title="Campus Events"
              subtitle="Register for fests, technical keynotes, and get scannable QR entry passes."
            />
          </Link>
          <Link to="/clubs">
            <PillCard
              icon={<Users className="w-5 h-5 text-lime" />}
              title="Clubs &amp; Societies"
              subtitle="Join technical guilds, cultural teams, and earn student activity points."
            />
          </Link>
          <Link to="/lost-found">
            <PillCard
              icon={<Search className="w-5 h-5 text-lime" />}
              title="Lost &amp; Found"
              subtitle="Found or misplaced an ID card, calculator, or headphones? Report it here."
            />
          </Link>
          <Link to="/attendance">
            <PillCard
              icon={<UserCheck className="w-5 h-5 text-lime" />}
              title="Academic &amp; Attendance Records"
              subtitle="Check course percentage details across all 9 branches and maintain VTU 75% compliance."
            />
          </Link>
          <Link to="/maintenance" className="md:col-span-2 lg:col-span-1">
            <PillCard
              icon={<Wrench className="w-5 h-5 text-lime" />}
              title="Maintenance Ticketing"
              subtitle="Report campus facility issues with photo attachments and track resolution SLA."
            />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          9. CINEMATIC FINAL CTA SECTION
          ========================================================================= */}
      <FinalCTA />

      {/* =========================================================================
          BRANCH DETAILS MODAL (Interactive Inspector)
          ========================================================================= */}
      {selectedBranch && (
        <BranchDetailsModal
          branch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      )}
    </div>
  );
};
