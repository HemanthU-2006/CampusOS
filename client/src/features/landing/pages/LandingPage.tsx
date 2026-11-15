import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Calendar,
  Package,
  Users,
  Search,
  UserCheck,
  Wrench,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Award,
  GraduationCap,
  BookOpen,
  MapPin,
  ExternalLink,
  Briefcase,
  Library,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PillCard } from '@/components/ui/PillCard';
import { Badge } from '@/components/ui/Badge';
import { ISEFacultySection } from '@/features/departments/components/ISEFacultySection';

export const LandingPage: React.FC = () => {
  return (
    <div className="text-white selection:bg-lime selection:text-lime-ink">
      {/* =========================================================================
          1. CINEMATIC HERO SECTION FOR SJBIT
          ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 pt-24 pb-20"
      >
        {/* Fullscreen Background Video (Continuous Smooth Drone View) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
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
        </div>

        {/* Cinematic Vignette Fading into #090909 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 via-40% to-[#090909] to-95% pointer-events-none" />

        {/* Central Ambient Glow - Calibrated Balanced Middle Ground */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(131,243,77,0.05),transparent_70%)] pointer-events-none" />

        {/* Hero Content Stage */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
          {/* Official SJBIT Seal & Institutional Header */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/75 border border-amber-400/40 text-left shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl hover:border-amber-400/60 transition-colors">
            <img
              src="/sjbit-emblem.png"
              alt="SJBIT Official Emblem"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover bg-white p-0.5 border-2 border-amber-400/70 shadow-md shrink-0"
            />
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-widest block leading-tight">
                || JAI SRI GURUDEV || Sri Adichunchanagiri Shikshana Trust ®
              </span>
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight block leading-tight mt-0.5">
                SJB INSTITUTE OF TECHNOLOGY
              </span>
              <span className="text-[11px] sm:text-xs text-white/80 block leading-tight mt-0.5">
                Autonomous Institute under VTU · NAAC 'A+' Grade · NBA Accredited
              </span>
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-2xl">
            Run SJBIT Campus <br />
            <span className="text-lime">Smarter, Faster.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Campus tech fests, student clubs, VTU attendance tracking, and fast repair resolution across all 9 SJBIT engineering &amp; management branches.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/login">
              <Button
                variant="lime"
                size="lg"
                className="shadow-md shadow-lime/20 hover:shadow-lime/35 hover:-translate-y-0.5 transition-all font-bold text-sm sm:text-base px-7 min-h-[48px]"
              >
                Sign In to Portal <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/login?role=admin">
              <Button
                variant="white"
                size="lg"
                className="font-bold text-sm sm:text-base px-6 backdrop-blur-md min-h-[48px] bg-card/80 border border-ring hover:border-lime/40 hover:-translate-y-0.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5 text-lime" />
                Administrator Portal
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-sm sm:text-base px-6 border-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all min-h-[48px]"
              >
                Student Registration
              </Button>
            </Link>
          </div>

          {/* Hero Recognition Logos Strip (From Official Banner) */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-card/80 border border-white/15 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7">
                <img
                  src="/recognitions/naac.png"
                  alt="NAAC A+"
                  className="h-8 sm:h-9 w-auto object-contain bg-white/95 rounded p-1 shadow-sm"
                  title="Accredited by NAAC with 'A+' Grade (CGPA 3.46)"
                />
                <img
                  src="/recognitions/nba.png"
                  alt="NBA Accredited"
                  className="h-8 sm:h-9 w-auto object-contain bg-white/95 rounded p-1 shadow-sm"
                  title="NBA Accredited Programmes"
                />
                <div className="h-8 sm:h-9 px-2 rounded bg-white/95 flex flex-col justify-center items-center shadow-sm">
                  <span className="font-extrabold text-blue-900 text-[11px] leading-none">ISO</span>
                  <span className="text-[8px] text-slate-700 font-bold leading-none mt-0.5">9001:2015</span>
                </div>
                <img
                  src="/recognitions/vtu.png"
                  alt="VTU Autonomous"
                  className="h-8 sm:h-9 w-auto object-contain bg-white/95 rounded p-1 shadow-sm"
                  title="Autonomous under VTU, Belagavi"
                />
                <img
                  src="/recognitions/aicte.png"
                  alt="AICTE"
                  className="h-8 sm:h-9 w-auto object-contain bg-white/95 rounded p-1 shadow-sm"
                  title="Approved by AICTE New Delhi"
                />
                <img
                  src="/recognitions/nirf.png"
                  alt="NIRF Ranked"
                  className="h-8 sm:h-9 w-auto object-contain bg-white/95 rounded p-1 shadow-sm"
                  title="Ranked in Innovation by NIRF"
                />
                <img
                  src="/recognitions/iic.png"
                  alt="Institution's Innovation Council"
                  className="h-8 sm:h-9 w-auto object-contain bg-white/95 rounded p-1 shadow-sm"
                  title="Institution's Innovation Council - MoE"
                />
              </div>

              {/* Official Admission Counseling Codes */}
              <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] sm:text-xs text-white/80 font-semibold">
                <span>CET: <strong className="text-lime">E115</strong></span>
                <span className="text-white/30 hidden sm:inline">|</span>
                <span>COMED-K: <strong className="text-lime">E107</strong></span>
                <span className="text-white/30 hidden sm:inline">|</span>
                <span>MBA: <strong className="text-lime">B288</strong></span>
                <span className="text-white/30 hidden sm:inline">|</span>
                <span>M.Tech: <strong className="text-lime">T871</strong></span>
                <span className="text-white/30 hidden sm:inline">|</span>
                <span>MCA: <strong className="text-lime">C547MC</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Prompt */}
        <div className="relative z-10 pt-16 flex flex-col items-center gap-2 text-white/60 text-xs font-medium tracking-wider">
          <a
            href="#overview"
            className="group flex flex-col items-center gap-2 hover:text-lime transition-colors"
          >
            <span className="group-hover:tracking-widest transition-all">EXPLORE SJBIT OVERVIEW</span>
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 group-hover:border-lime transition-colors">
              <div className="w-1.5 h-2.5 rounded-full bg-lime animate-bounce" />
            </div>
          </a>
        </div>
      </section>

      {/* =========================================================================
          OFFICIAL RECOGNITIONS, ACCREDITATIONS & COUNSELING CODES
          ========================================================================= */}
      <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-8 -mt-6 mb-8">
        <div className="rounded-2xl bg-[#131418] p-5 sm:p-6 shadow-xl border border-white/10 backdrop-blur-xl">
          {/* Recognition Logos Row */}
          <div className="flex flex-wrap items-center justify-around sm:justify-between gap-4 sm:gap-6 px-2 sm:px-4">
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="NAAC 'A+' Grade Accredited">
              <img
                src="/recognitions/naac.png"
                alt="NAAC A+ Accredited"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="NBA Accredited Programmes">
              <img
                src="/recognitions/nba.png"
                alt="NBA Accredited"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="ISO 9001:2015 Certified">
              <div className="h-9 sm:h-11 px-3 rounded-lg border-2 border-blue-900/30 flex flex-col justify-center items-center text-center bg-blue-50/50">
                <span className="font-extrabold text-blue-900 text-xs sm:text-sm tracking-tight leading-none">ISO</span>
                <span className="text-[9px] text-slate-700 font-bold leading-none mt-0.5">9001:2015</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="Affiliated to Visvesvaraya Technological University">
              <img
                src="/recognitions/vtu.png"
                alt="VTU Autonomous"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="Approved by AICTE New Delhi">
              <img
                src="/recognitions/aicte.png"
                alt="AICTE Approved"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="NIRF Ranked Institution">
              <img
                src="/recognitions/nirf.png"
                alt="NIRF Ranked"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="Institution's Innovation Council - MoE">
              <img
                src="/recognitions/iic.png"
                alt="Institution's Innovation Council"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/95 shadow-sm hover:scale-105 transition-transform" title="QS I-GAUGE Gold Rated">
              <img
                src="/recognitions/qs-iguage.png"
                alt="QS I-GAUGE Gold"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
          </div>

          {/* Official Counseling Codes Row (From Official Banner) */}
          <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-bold text-white/80 tracking-wide text-center">
            <span>CET Code: <strong className="text-lime">E115</strong></span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span>COMED-K: <strong className="text-lime">E107</strong></span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span>MBA: <strong className="text-lime">B288</strong></span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span>M.Tech: <strong className="text-lime">T871</strong></span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span>MCA: <strong className="text-lime">C547MC</strong></span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL OVERVIEW & EXCEPTIONAL LEADERSHIP (From https://www.sjbit.edu.in/)
          ========================================================================= */}
      <section
        id="overview"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-ring/40"
      >
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
            Institutional Heritage
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exceptional Leadership &amp; Vision
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Established under the divine aegis of <strong className="text-white">Sri Adichunchanagiri Shikshana Trust ®</strong>, 
            SJBIT has evolved into one of Karnataka's premier autonomous institutions, combining academic rigor, holistic human values, and world-class infrastructure.
          </p>
        </div>

        {/* 4 Leadership Cards with Authentic Swamiji Portraits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Founder President */}
          <div className="p-5 rounded-2xl bg-[#141519] border border-white/10 hover:border-amber-400/50 transition-all duration-300 space-y-4 shadow-md hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="relative overflow-hidden rounded-xl border-2 border-amber-400/50 shadow-md aspect-square bg-[#0c0d10] flex items-center justify-center">
                <img
                  src="/leadership/balagangadharanatha-swamiji.jpg"
                  alt="Jagadguru Sri Sri Sri Dr. Balagangadharanatha Maha Swamiji"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-amber-400 uppercase tracking-wider border border-amber-400/30">
                  Founder President
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                  Jagadguru Sri Sri Sri Dr. Balagangadharanatha Maha Swamiji
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Padma Bhushan Awardee &amp; Visionary Founder, Sri Adichunchanagiri Shikshana Trust®
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-amber-300/90 font-medium">
              Divine Inspiration &amp; Foundation
            </div>
          </div>

          {/* Card 2: President */}
          <div className="p-5 rounded-2xl bg-[#141519] border border-white/10 hover:border-lime/50 transition-all duration-300 space-y-4 shadow-md hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="relative overflow-hidden rounded-xl border-2 border-lime/50 shadow-md aspect-square bg-[#0c0d10] flex items-center justify-center">
                <img
                  src="/leadership/nirmalanandanatha-swamiji.jpg"
                  alt="Sri Sri Sri Dr. Nirmalanandanatha Maha Swamiji"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-lime uppercase tracking-wider border border-lime/30">
                  President
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                  Sri Sri Sri Dr. Nirmalanandanatha Maha Swamiji
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Pontiff &amp; President, Sri Adichunchanagiri Mahasamsthana Math &amp; Shikshana Trust®
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-lime font-medium">
              Spiritual &amp; Educational Guiding Light
            </div>
          </div>

          {/* Card 3: Managing Director */}
          <div className="p-5 rounded-2xl bg-[#141519] border border-white/10 hover:border-blue-400/50 transition-all duration-300 space-y-4 shadow-md hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="relative overflow-hidden rounded-xl border-2 border-blue-400/50 shadow-md aspect-square bg-[#0c0d10] flex items-center justify-center">
                <img
                  src="/leadership/prakashanatha-swamiji.jpg"
                  alt="Sri Sri Dr. Prakashanatha Swamiji"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-sky-400 uppercase tracking-wider border border-blue-400/30">
                  Managing Director
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                  Sri Sri Dr. Prakashanatha Swamiji
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Managing Director, BGS &amp; SJB Group of Institutions and Hospitals
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-sky-300 font-medium">
              Institutional Growth &amp; Development
            </div>
          </div>

          {/* Card 4: Principal & Chief Administrator */}
          <div className="p-5 rounded-2xl bg-[#141519] border border-white/10 hover:border-rose-400/50 transition-all duration-300 space-y-4 shadow-md hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="relative overflow-hidden rounded-xl border-2 border-rose-400/50 shadow-md aspect-square bg-[#0c0d10] flex items-center justify-center p-4">
                <img
                  src="/sjbit-emblem.png"
                  alt="Principal Office - SJBIT"
                  className="w-24 h-24 rounded-full object-cover bg-white p-1 border-2 border-rose-400/70 shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-rose-400 uppercase tracking-wider border border-rose-400/30">
                  Principal Office
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                  Dr. K. V. Mahendra Prashanth
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Principal &amp; Chief Academic Officer, SJB Institute of Technology
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10">
              <Link to="/login?role=admin" className="text-xs font-semibold text-rose-400 hover:text-white flex items-center gap-1">
                Admin Office Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* 4 College Highlight Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-[#141519] border border-white/10 text-center space-y-1 hover:border-white/20 transition-all">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">50 Acres</h4>
            <p className="text-xs text-white/60">Lush Green Campus in Kengeri</p>
          </div>
          <div className="p-4 rounded-xl bg-[#141519] border border-white/10 text-center space-y-1 hover:border-lime/30 transition-all">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-lime">NAAC 'A+'</h4>
            <p className="text-xs text-white/60">VTU Autonomous Institution</p>
          </div>
          <div className="p-4 rounded-xl bg-[#141519] border border-white/10 text-center space-y-1 hover:border-white/20 transition-all">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">3,800+</h4>
            <p className="text-xs text-white/60">Students Across 9 Branches</p>
          </div>
          <div className="p-4 rounded-xl bg-[#141519] border border-white/10 text-center space-y-1 hover:border-amber-400/30 transition-all">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-amber-400">20+</h4>
            <p className="text-xs text-white/60">Industry Centers of Excellence</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ALL 9 SJBIT BRANCHES (Full Academic Scope with Authenticated HODs)
          ========================================================================= */}
      <section
        id="branches"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-ring/40"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="lime" className="mx-auto">
            Academic Scope
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            All 9 SJBIT Departments
          </h2>
          <p className="text-sm text-white/60">
            VTU Autonomous engineering &amp; management branches with specialized labs and dedicated faculty leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. Krishna A N', block: 'Aryabhata Block, 2nd & 3rd Floors', scheme: '2022 Scheme (VTU)' },
            { code: 'ISE', name: 'Information Science & Engineering', hod: 'Dr. Gopalakrishna M T', block: 'Aryabhata Block, 1st Floor', scheme: '2022 Scheme (VTU)' },
            { code: 'AI&ML', name: 'Artificial Intelligence & Machine Learning', hod: 'Dr. Abhilash C N', block: 'Sir M.V. Block, 3rd Floor', scheme: '2022 Scheme (VTU)' },
            { code: 'CS-DS', name: 'CSE (Data Science)', hod: 'Dr. Chandrashekar D K (I/C)', block: 'Sir M.V. Block, 2nd Floor', scheme: '2022 Scheme (VTU)' },
            { code: 'ECE', name: 'Electronics & Communication Engineering', hod: 'Dr. Chandrappa D N', block: 'C.V. Raman Block, 2nd & 3rd Floors', scheme: '2022 Scheme (VTU)' },
            { code: 'EEE', name: 'Electrical & Electronics Engineering', hod: 'Dr. Chandrashekar M J', block: 'C.V. Raman Block, 1st Floor', scheme: '2022 Scheme (VTU)' },
            { code: 'MECH', name: 'Mechanical Engineering', hod: 'Dr. Vitala H.R', block: 'Mechanical Block & Central Workshops', scheme: '2022 Scheme (VTU)' },
            { code: 'CIVIL', name: 'Civil Engineering', hod: 'Dr. Prasad C S M V', block: 'Civil Engineering Block & CAD Labs', scheme: '2022 Scheme (VTU)' },
            { code: 'MBA', name: 'Department of Management Studies', hod: 'Dr. Mamatha J', block: 'MBA & PG Studies Block, 4th Floor', scheme: 'Autonomous PG Scheme' },
          ].map((b) => (
            <div
              key={b.code}
              className="p-5 rounded-2xl bg-[#141519] border border-white/10 hover:border-lime/40 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm hover:-translate-y-1"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-lime/10 border border-lime/30 text-lime font-mono font-bold text-xs">
                    {b.code}
                  </span>
                  <span className="text-[10px] text-white/50">{b.scheme}</span>
                </div>
                <h3 className="font-extrabold text-base text-white tracking-tight">{b.name}</h3>
                <p className="text-xs text-white/60">HOD: <strong className="text-white">{b.hod}</strong></p>
                <p className="text-[11px] text-white/50">{b.block}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  to="/attendance"
                  className="text-xs text-lime font-semibold hover:underline flex items-center gap-1"
                >
                  View Attendance Registers →
                </Link>
                {b.code === 'ISE' && (
                  <a
                    href="#ise-faculty"
                    className="text-[11px] text-amber-400 font-bold hover:underline"
                  >
                    View Faculty (41) ↓
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FEATURED ISE FACULTY SPOTLIGHT (Authentic Faculty Roster & Photos)
          ========================================================================= */}
      <ISEFacultySection />

      {/* =========================================================================
          4. LIFE @ SJBIT & CAMPUS INFRASTRUCTURE (From Main Website Dropdown)
          ========================================================================= */}
      <section
        id="life-at-sjbit"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-ring/40"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
            Life @ SJBIT
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            World-Class Campus Infrastructure
          </h2>
          <p className="text-sm text-white/60">
            High-tech centers of excellence, expansive library resources, modern hostels, and industry collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
              <Library className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Central Library &amp; Info Centre</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              45,000+ volumes, IEEE Xplore, ScienceDirect digital journals, automated barcode book checkout, and NDLI club facilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Industry Collaboration CoEs</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Active technology labs co-sponsored by IBM, Cisco Networking Academy, Texas Instruments, Bentley Systems, Ethnotech, and Google Cloud.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">BGS Cultural Auditorium</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              2,500-seat acoustic auditorium hosting flagship tech symposiums, HackSJBIT, annual fests, and international conferences.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-400/10 border border-rose-400/30 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Sports Arena &amp; Gymnasiums</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Cricket pavilion, football grounds, indoor badminton complex, basketball courts, and regular VTU inter-collegiate tournaments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Hostels &amp; Green Campus</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Safe on-campus residential hostels for 1,200+ students, 100% solar lighting, sewage treatment plants, and rainwater harvesting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Student Guilds &amp; NSS</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Coding guilds, robotics clubs, Indian Concrete Institute chapters, Red Cross units, and community extension programs.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INDUSTRY COLLABORATION & TOP RECRUITERS (From Official Website)
          ========================================================================= */}
      <section
        id="partners"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-ring/40"
      >
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
            Industry Collaborations &amp; Placements
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bridging Academia &amp; Industry Excellence
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Leading multinational technology corporations and global research institutions partnering with SJBIT for campus recruitments, student internships, and state-of-the-art Centers of Excellence.
          </p>
        </div>

        {/* 12 Industry Partner Logo Tiles (As in the official SJBIT portal) */}
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
            { name: 'University of Agricultural Sciences', file: 'university-agricultural-sciences.jpg' },
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
        <div className="p-6 rounded-2xl bg-card border border-ring/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-extrabold text-white">Department Placement Drives &amp; Internships</h4>
            <p className="text-xs text-white/60">
              Active recruitment across all 9 departments: CSE, ISE, AI&amp;ML, CS-DS, ECE, EEE, Mechanical, Civil, and MBA.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-row border border-ring/60 text-xs font-semibold text-white/80">
              TCS
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-row border border-ring/60 text-xs font-semibold text-white/80">
              Tech Mahindra
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-row border border-ring/60 text-xs font-semibold text-white/80">
              Cognizant
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-row border border-ring/60 text-xs font-semibold text-white/80">
              Mindtree
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-row border border-ring/60 text-xs font-semibold text-white/80">
              JSW
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MODULES GRID FOR SJBIT
          ========================================================================= */}
      <section
        id="modules"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-ring/40"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[radial-gradient(ellipse_at_top,rgba(131,243,77,0.06),transparent_70%)] pointer-events-none" />

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="lime" className="mx-auto">
            SJBIT Campus Tools
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Students, Faculty &amp; Staff
          </h2>
          <p className="text-sm text-white/60">
            Campus fests, clubs, attendance registers, and maintenance fixes unified in one platform.
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
              title="Attendance"
              subtitle="Check course percentages across all 9 branches and stay safe above 75%."
            />
          </Link>
          <Link to="/maintenance" className="md:col-span-2 lg:col-span-1">
            <PillCard
              icon={<Wrench className="w-5 h-5 text-lime" />}
              title="Campus Repairs"
              subtitle="Report broken lights, AC issues, or hardware problems for quick fixing."
            />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          6. FINAL CTA BANNER
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative rounded-pill border border-lime/30 bg-card/60 backdrop-blur-xl p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_50px_rgba(131,243,77,0.12)]">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2">
              <img
                src="/sjbit-emblem.png"
                alt="SJBIT Emblem"
                className="w-12 h-12 rounded-full object-cover bg-white p-0.5 border border-amber-400/50 shadow-lg"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to access <br />
              <span className="text-lime">SJBIT CampusOS?</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70">
              Sign in to your student or faculty portal, or access the campus-wide administrator control board.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/login">
                <Button variant="lime" size="lg" className="shadow-[0_0_24px_rgba(131,243,77,0.4)] min-h-[48px] font-bold">
                  Sign In to Portal <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/login?role=admin">
                <Button variant="white" size="lg" className="min-h-[48px] font-bold bg-card/80 border border-ring hover:border-lime/40">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-lime" />
                  Administrator Section
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="min-h-[48px] border-white/20 hover:border-white/40">
                  Student Registration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
