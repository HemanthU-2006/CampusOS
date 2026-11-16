import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  ExternalLink,
  Award,
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Building2,
  Users,
  Briefcase,
  BookOpen,
  Phone,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { CampusAIAssistant } from '@/components/CampusAIAssistant';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [admissionsDropdownOpen, setAdmissionsDropdownOpen] = useState(false);
  const [placementsDropdownOpen, setPlacementsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-glow-landing relative flex flex-col text-white selection:bg-lime selection:text-lime-ink">
      {/* Subtle top ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(131,243,77,0.06),transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Official Top Institutional Bar (Modeled after https://www.sjbit.edu.in/) */}
      <div className="relative z-50 w-full bg-[#080808]/95 border-b border-white/10 py-1.5 px-4 text-[11px] text-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
            <span className="text-amber-400 font-bold tracking-wider">|| JAI SRI GURUDEV ||</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="font-medium text-white/80">
              Sri Adichunchanagiri Shikshana Trust ®
            </span>
            <span className="hidden lg:inline text-white/20">|</span>
            <span className="hidden lg:inline text-white/60">
              Autonomous Institute under VTU, Belagavi
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/60">
            <a
              href="https://turiya.co/360/SJBIT/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-lime transition-colors inline-flex items-center gap-1 font-medium"
            >
              360° Tour <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-white/20">|</span>
            <a
              href="https://www.sjbit.edu.in/nirf.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-lime transition-colors font-medium"
            >
              NIRF
            </a>
            <span className="text-white/20">|</span>
            <a
              href="https://www.sjbit.edu.in/alumni.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-lime transition-colors font-medium"
            >
              Alumni
            </a>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
              <Award className="w-3 h-3" /> NAAC 'A+'
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="hidden sm:inline font-mono font-semibold text-lime">
              CET: E115 | COMED-K: E107
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (With Authentic SJBIT Structure) */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 max-w-7xl mx-auto w-full pt-3">
        <nav className="glass-nav rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-ring/80">
          {/* Official SJBIT Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/sjbit-emblem.png"
              alt="SJBIT Emblem"
              className="w-10 h-10 rounded-full object-cover border border-amber-400/40 p-0.5 bg-white shadow-[0_0_12px_rgba(251,191,36,0.25)] group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-lime transition-colors">
                  SJBIT <span className="text-lime">CampusOS</span>
                </span>
                <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 font-semibold uppercase">
                  Autonomous
                </span>
              </div>
              <span className="text-[10px] text-white/50 block font-normal leading-tight truncate max-w-[180px] sm:max-w-none">
                SJB Institute of Technology · Bengaluru
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Dropdowns (Modeled after https://www.sjbit.edu.in/) */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-medium text-white/80">
            {/* 1. About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className="hover:text-lime transition-colors flex items-center gap-1 py-2 cursor-pointer"
              >
                About Us <ChevronDown className="w-3 h-3 text-white/40" />
              </button>
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-xl bg-[#111216]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-xl animate-fade-in space-y-1">
                  <a
                    href="/#overview"
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-white block">Exceptional Leadership</span>
                    <span className="text-[10px] text-white/50">Founders, Swamijis &amp; Principal</span>
                  </a>
                  <a
                    href="https://www.sjbit.edu.in/sri-adhichunchanagiri-shikshana-trust.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-white block flex items-center justify-between">
                      Adichunchanagiri Trust <ExternalLink className="w-3 h-3 text-white/40" />
                    </span>
                    <span className="text-[10px] text-white/50">Sri Adichunchanagiri Shikshana Trust®</span>
                  </a>
                  <a
                    href="https://www.sjbit.edu.in/accreditation-and-ranking.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-white block flex items-center justify-between">
                      Accreditation &amp; Ranking <ExternalLink className="w-3 h-3 text-white/40" />
                    </span>
                    <span className="text-[10px] text-white/50">NAAC A+, NBA, ISO 9001:2015</span>
                  </a>
                </div>
              )}
            </div>

            {/* 2. Departments Dropdown (9 Branches) */}
            <div
              className="relative"
              onMouseEnter={() => setDeptDropdownOpen(true)}
              onMouseLeave={() => setDeptDropdownOpen(false)}
            >
              <button
                type="button"
                className="hover:text-lime transition-colors flex items-center gap-1 py-2 cursor-pointer"
              >
                9 Branches <ChevronDown className="w-3 h-3 text-white/40" />
              </button>
              {deptDropdownOpen && (
                <div className="absolute top-full left-0 w-80 rounded-xl bg-[#111216]/95 border border-white/15 p-3 shadow-2xl backdrop-blur-xl animate-fade-in">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2 px-1">
                    Autonomous Engineering &amp; Management Branches
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <a
                      href="/#branches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">CSE</span> · Computer Science
                    </a>
                    <Link
                      to="/faculty/ise"
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 font-bold hover:bg-amber-400/20 transition-colors"
                    >
                      <span>ISE Faculty</span> (41) ★
                    </Link>
                    <a
                      href="/#branches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">AI&amp;ML</span> · Artificial Intel
                    </a>
                    <a
                      href="/#branches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">CS-DS</span> · Data Science
                    </a>
                    <a
                      href="/#branches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">ECE</span> · Electronics &amp; Comm
                    </a>
                    <a
                      href="/#branches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">EEE</span> · Electrical &amp; Elec
                    </a>
                    <a
                      href="/#branches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">MECH</span> · Mechanical
                    </a>
                    <a
                      href="/#branches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">CIVIL</span> · Civil Engineering
                    </a>
                    <a
                      href="/#branches"
                      className="col-span-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-lime transition-colors"
                    >
                      <span className="font-bold text-white">MBA</span> · Department of Management Studies
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Highlighted ISE Faculty Link */}
            <Link
              to="/faculty/ise"
              className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:text-white hover:bg-amber-400/25 font-bold transition-all"
            >
              ISE Faculty (41)
            </Link>

            {/* 4. Admissions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAdmissionsDropdownOpen(true)}
              onMouseLeave={() => setAdmissionsDropdownOpen(false)}
            >
              <button
                type="button"
                className="hover:text-lime transition-colors flex items-center gap-1 py-2 cursor-pointer"
              >
                Admissions <ChevronDown className="w-3 h-3 text-white/40" />
              </button>
              {admissionsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-xl bg-[#111216]/95 border border-white/15 p-3 shadow-2xl backdrop-blur-xl animate-fade-in space-y-2">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider px-1">
                    Official Counseling Codes
                  </div>
                  <div className="space-y-1.5 text-xs text-white/80">
                    <div className="p-2 rounded bg-white/5 flex items-center justify-between font-mono">
                      <span>CET Code:</span> <strong className="text-lime">E115</strong>
                    </div>
                    <div className="p-2 rounded bg-white/5 flex items-center justify-between font-mono">
                      <span>COMED-K:</span> <strong className="text-lime">E107</strong>
                    </div>
                    <div className="p-2 rounded bg-white/5 flex items-center justify-between font-mono">
                      <span>MBA / MCA:</span> <strong className="text-lime">B288 / C547MC</strong>
                    </div>
                  </div>
                  <a
                    href="https://www.sjbit.edu.in/admissions.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs text-lime hover:underline font-semibold pt-1"
                  >
                    View Official Admission Portal →
                  </a>
                </div>
              )}
            </div>

            {/* 5. Placements Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPlacementsDropdownOpen(true)}
              onMouseLeave={() => setPlacementsDropdownOpen(false)}
            >
              <button
                type="button"
                className="hover:text-lime transition-colors flex items-center gap-1 py-2 cursor-pointer"
              >
                Placements <ChevronDown className="w-3 h-3 text-white/40" />
              </button>
              {placementsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-xl bg-[#111216]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-xl animate-fade-in space-y-1">
                  <a
                    href="/#partners"
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-white block">350+ Recruiting Partners</span>
                    <span className="text-[10px] text-white/50">Cisco, Oracle, TCS, Infosys, Bosch</span>
                  </a>
                  <a
                    href="https://www.sjbit.edu.in/center-of-excellence.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-white block flex items-center justify-between">
                      Centers of Excellence <ExternalLink className="w-3 h-3 text-white/40" />
                    </span>
                    <span className="text-[10px] text-white/50">20+ Advanced Industry Hubs</span>
                  </a>
                </div>
              )}
            </div>

            {/* 6. Life @ SJBIT */}
            <a href="/#life-at-sjbit" className="hover:text-white transition-colors">
              Life @ SJBIT
            </a>

            {/* 7. Campus Modules */}
            <a href="/#modules" className="hover:text-white transition-colors">
              Campus Modules
            </a>

            {/* 8. Contact Us */}
            <Link
              to="/contact"
              className="hover:text-white text-lime transition-colors font-semibold"
            >
              Contact Us
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <Link to="/login?role=admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-rose-300 hover:text-white hover:bg-rose-500/10 hidden sm:inline-flex items-center font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-rose-400" />
                Admin Portal
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-xs border-ring/80 font-semibold">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="lime"
                size="sm"
                className="text-xs font-bold shadow-[0_0_12px_rgba(131,243,77,0.35)]"
              >
                Register
              </Button>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-2 p-4 rounded-2xl bg-[#101115]/95 border border-white/15 backdrop-blur-xl shadow-2xl space-y-3 animate-fade-in text-xs">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
              <a
                href="/#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" /> Leadership
              </a>
              <Link
                to="/faculty/ise"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-amber-400" /> ISE Faculty (41)
              </Link>
              <a
                href="/#branches"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-lime" /> 9 Branches
              </a>
              <a
                href="/#partners"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-sky-400" /> Placements
              </a>
              <a
                href="/#life-at-sjbit"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-rose-400" /> Life @ SJBIT
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-lime font-bold flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-lime" /> Contact Us
              </Link>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link to="/login?role=admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full text-xs text-rose-300 font-bold">
                  <ShieldCheck className="w-4 h-4 mr-1 text-rose-400" /> Admin Office Portal
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="lime" size="sm" className="w-full text-xs font-bold">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      {/* Institutional Footer (Modeled after https://www.sjbit.edu.in/) */}
      <footer className="relative z-10 border-t border-ring/50 bg-[#060606] py-12 px-6 text-xs text-white/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/sjbit-emblem.png"
                alt="SJBIT Emblem"
                className="w-10 h-10 rounded-full object-cover bg-white p-0.5"
              />
              <div>
                <h4 className="font-extrabold text-white text-sm">SJB Institute of Technology</h4>
                <p className="text-[11px] text-amber-300">Sri Adichunchanagiri Shikshana Trust ®</p>
              </div>
            </div>
            <p className="text-xs text-white/60 max-w-md leading-relaxed">
              BGS Health &amp; Education City, Dr. Vishnuvardhan Road, Kengeri, Bengaluru – 560060,
              Karnataka, India. Autonomous Institution under VTU, Belagavi. Approved by AICTE, New
              Delhi. Accredited by NAAC with 'A+' Grade.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-2.5 uppercase tracking-wider text-[11px]">
              Institutional Links
            </h5>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li>
                <a
                  href="https://www.sjbit.edu.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lime"
                >
                  Official SJBIT Portal
                </a>
              </li>
              <li>
                <Link to="/faculty/ise" className="hover:text-amber-300 text-amber-400 font-semibold">
                  ISE Faculty Directory (41)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-lime">
                  Campus Directory &amp; HOD Contacts
                </Link>
              </li>
              <li>
                <Link to="/login?role=admin" className="hover:text-rose-300">
                  Principal Office &amp; Admin Board
                </Link>
              </li>
              <li>
                <a
                  href="https://turiya.co/360/SJBIT/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lime inline-flex items-center gap-1"
                >
                  360° Virtual Campus Tour <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-2.5 uppercase tracking-wider text-[11px]">
              Official Helpdesk
            </h5>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li>Office: +91-80-28612445 / 46</li>
              <li>Principal Office: +91-6366041109</li>
              <li>Admissions: +91-9591936004 / 9739078206</li>
              <li>Women Safety Cell: +91-7204081185</li>
              <li>Student Grievance Cell: +91-9902310181</li>
              <li>Anti-Ragging Helpline: 1800-180-5522</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © 2026 SJBIT CampusOS · SJB Institute of Technology, Bengaluru. All rights reserved.
          </p>
          <p className="text-[11px] text-white/40">
            Affiliated to VTU · Approved by AICTE · NAAC 'A+' Accredited
          </p>
        </div>
      </footer>

      {/* Floating AI Assistant on Public/Home Pages */}
      <CampusAIAssistant />
    </div>
  );
};
