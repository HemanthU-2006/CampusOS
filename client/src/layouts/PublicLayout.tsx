import React, { useState, useEffect } from 'react';
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
  Layers,
} from 'lucide-react';
import { CampusAIAssistant } from '@/components/CampusAIAssistant';
import { SmoothScroll, ScrollProgress, FilmGrain } from '@/components/cinematic';
import '../cinematic.css';
import '../leadership.css';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [admissionsDropdownOpen, setAdmissionsDropdownOpen] = useState(false);
  const [placementsDropdownOpen, setPlacementsDropdownOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-glow-landing relative flex flex-col text-white selection:bg-lime selection:text-lime-ink animate-fade-in">
      <SmoothScroll />
      <ScrollProgress />
      <FilmGrain />

      {/* Subtle top ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(131,243,77,0.06),transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* TOP ANNOUNCEMENT STRIP (~36px height, 1px bottom border, single font, muted gold & badges) */}
      <div className="relative z-50 w-full bg-[#080808]/90 border-b border-white/[0.08] h-9 px-4 sm:px-6 flex items-center backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] leading-none">
          {/* Left: Jai Sri Gurudev & Institutional Affiliation */}
          <div className="flex items-center gap-2.5">
            <span className="text-amber-300/85 uppercase font-semibold tracking-[0.08em] text-[10px]">
              Jai Sri Gurudev
            </span>
            <span className="hidden md:inline text-white/15">|</span>
            <span className="hidden md:inline text-gray-400 font-medium">
              Sri Adichunchanagiri Shikshana Trust ®
            </span>
            <span className="hidden lg:inline text-white/15">|</span>
            <span className="hidden lg:inline text-gray-500 font-normal">
              Autonomous Institute under VTU, Belagavi
            </span>
          </div>

          {/* Right: Utility Links & Badges */}
          <div className="flex items-center gap-2.5 text-[#9CA3AF]">
            <a
              href="https://turiya.co/360/SJBIT/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1 font-medium"
            >
              360° Tour <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <span className="text-white/15">|</span>
            <a
              href="https://www.sjbit.edu.in/nirf.php"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150 font-medium"
            >
              NIRF
            </a>
            <span className="text-white/15">|</span>
            <a
              href="https://www.sjbit.edu.in/alumni.php"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150 font-medium"
            >
              Alumni
            </a>
            <span className="hidden sm:inline text-white/15">|</span>
            <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-medium text-gray-300">
              NAAC 'A+'
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-medium text-gray-300">
              CET: E115
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-medium text-gray-300">
              COMED-K: E107
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR (Sticky, Glassmorphism, Shrink on scroll, One Accent Green) */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 max-w-7xl mx-auto w-full pt-2.5 transition-all duration-300 ease-out">
        <nav
          className={`w-full rounded-[14px] border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-[16px] backdrop-saturate-[140%] flex items-center justify-between px-4 sm:px-5 transition-all duration-300 ease-out ${
            isScrolled ? 'h-[60px] bg-[#0a0a0a]/90' : 'h-[72px] bg-[#0a0a0a]/70'
          }`}
        >
          {/* Logo block: 44px logo, brand text in semibold white, brand green CampusOS, tiny autonomous pill */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] rounded-lg outline-none"
          >
            <img
              src="/sjbit-emblem.png"
              alt="SJBIT Emblem"
              className="w-11 h-11 rounded-full object-cover border border-white/10 p-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.06)] group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[15px] tracking-tight text-white">
                  SJBIT <span className="text-lime">CampusOS</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-white/15 text-gray-300 font-medium tracking-wider uppercase">
                  Autonomous
                </span>
              </div>
              <span className="text-[12px] text-gray-400 font-normal leading-tight">
                SJB Institute of Technology · Bengaluru
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (No wrap, 14px font, equal gaps, clean glass dropdowns, collapsed below 1280px) */}
          <div className="hidden xl:flex items-center gap-0.5 text-[14px] font-medium tracking-[0.01em]">
            {/* 1. About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3.5 py-2 text-[#D1D5DB] hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all duration-150 ease-out whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none"
              >
                About Us{' '}
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    aboutDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-[12px] bg-[#0d0d0f]/95 border border-white/[0.08] p-2 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in space-y-1 z-50">
                  <a
                    href="/#overview"
                    className="block px-3 py-2 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium text-white block text-[13px]">Exceptional Leadership</span>
                    <span className="text-[11px] text-gray-400">Founders, Swamijis &amp; Principal</span>
                  </a>
                  <a
                    href="https://www.sjbit.edu.in/sri-adhichunchanagiri-shikshana-trust.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium text-white block text-[13px] flex items-center justify-between">
                      Adichunchanagiri Trust <ExternalLink className="w-3 h-3 text-gray-400" />
                    </span>
                    <span className="text-[11px] text-gray-400">Sri Adichunchanagiri Shikshana Trust®</span>
                  </a>
                  <a
                    href="https://www.sjbit.edu.in/accreditation-and-ranking.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium text-white block text-[13px] flex items-center justify-between">
                      Accreditation &amp; Ranking <ExternalLink className="w-3 h-3 text-gray-400" />
                    </span>
                    <span className="text-[11px] text-gray-400">NAAC A+, NBA, ISO 9001:2015</span>
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
                className="flex items-center gap-1 px-3.5 py-2 text-[#D1D5DB] hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all duration-150 ease-out whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none"
              >
                9 Branches{' '}
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    deptDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {deptDropdownOpen && (
                <div className="absolute top-full left-0 w-80 rounded-[12px] bg-[#0d0d0f]/95 border border-white/[0.08] p-3 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in z-50">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                    Autonomous Engineering &amp; Management Branches
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[13px]">
                    <Link
                      to="/faculty/cse"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">CSE</span>
                      <span className="text-[11px] text-gray-400">38</span>
                    </Link>
                    <Link
                      to="/faculty/ise"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">ISE</span>
                      <span className="text-[11px] text-lime font-semibold">41</span>
                    </Link>
                    <Link
                      to="/faculty/aiml"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">AI&amp;ML</span>
                      <span className="text-[11px] text-gray-400">18</span>
                    </Link>
                    <Link
                      to="/faculty/cs-ds"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">CS-DS</span>
                      <span className="text-[11px] text-gray-400">14</span>
                    </Link>
                    <Link
                      to="/faculty/ece"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">ECE</span>
                      <span className="text-[11px] text-gray-400">34</span>
                    </Link>
                    <Link
                      to="/faculty/eee"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">EEE</span>
                      <span className="text-[11px] text-gray-400">16</span>
                    </Link>
                    <Link
                      to="/faculty/mech"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">MECH</span>
                      <span className="text-[11px] text-gray-400">18</span>
                    </Link>
                    <Link
                      to="/faculty/civil"
                      className="px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">CIVIL</span>
                      <span className="text-[11px] text-gray-400">16</span>
                    </Link>
                    <Link
                      to="/faculty/mba"
                      className="col-span-2 px-2.5 py-1.5 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-white">MBA · Management Studies</span>
                      <span className="text-[11px] text-gray-400">14</span>
                    </Link>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/10 text-center">
                    <Link
                      to="/faculty"
                      className="block text-xs font-bold text-lime hover:underline py-1"
                    >
                      View All Department Faculty Directory →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Admissions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAdmissionsDropdownOpen(true)}
              onMouseLeave={() => setAdmissionsDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3.5 py-2 text-[#D1D5DB] hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all duration-150 ease-out whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none"
              >
                Admissions{' '}
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    admissionsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {admissionsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-[12px] bg-[#0d0d0f]/95 border border-white/[0.08] p-3 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in space-y-2 z-50">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1">
                    Official Counseling Codes
                  </div>
                  <div className="space-y-1.5 text-[12px] text-gray-300">
                    <div className="p-2 rounded-[8px] bg-white/[0.04] flex items-center justify-between">
                      <span>CET Code:</span> <strong className="text-white">E115</strong>
                    </div>
                    <div className="p-2 rounded-[8px] bg-white/[0.04] flex items-center justify-between">
                      <span>COMED-K:</span> <strong className="text-white">E107</strong>
                    </div>
                    <div className="p-2 rounded-[8px] bg-white/[0.04] flex items-center justify-between">
                      <span>MBA / MCA:</span> <strong className="text-white">B288 / C547MC</strong>
                    </div>
                  </div>
                  <a
                    href="https://www.sjbit.edu.in/admissions.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[12px] text-lime hover:underline font-medium pt-1"
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
                className="flex items-center gap-1 px-3.5 py-2 text-[#D1D5DB] hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all duration-150 ease-out whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none"
              >
                Placements{' '}
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    placementsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {placementsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-[12px] bg-[#0d0d0f]/95 border border-white/[0.08] p-2 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in space-y-1 z-50">
                  <a
                    href="/#partners"
                    className="block px-3 py-2 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium text-white block text-[13px]">350+ Recruiting Partners</span>
                    <span className="text-[11px] text-gray-400">Cisco, Oracle, TCS, Infosys, Bosch</span>
                  </a>
                  <a
                    href="https://www.sjbit.edu.in/center-of-excellence.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium text-white block text-[13px] flex items-center justify-between">
                      Centers of Excellence <ExternalLink className="w-3 h-3 text-gray-400" />
                    </span>
                    <span className="text-[11px] text-gray-400">20+ Advanced Industry Hubs</span>
                  </a>
                </div>
              )}
            </div>

            {/* 6. Merged "Campus Life" Dropdown (Life @ SJBIT + Campus Modules) */}
            <div
              className="relative"
              onMouseEnter={() => setCampusDropdownOpen(true)}
              onMouseLeave={() => setCampusDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3.5 py-2 text-[#D1D5DB] hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all duration-150 ease-out whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none"
              >
                Campus Life{' '}
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    campusDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {campusDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-[12px] bg-[#0d0d0f]/95 border border-white/[0.08] p-2 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in space-y-1 z-50">
                  <a
                    href="/#life-at-sjbit"
                    className="block px-3 py-2 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium text-white block text-[13px]">Life @ SJBIT</span>
                    <span className="text-[11px] text-gray-400">Hostels, Library, Cultural Hubs &amp; Sports</span>
                  </a>
                  <a
                    href="/#modules"
                    className="block px-3 py-2 rounded-[8px] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium text-white block text-[13px]">Campus Modules</span>
                    <span className="text-[11px] text-gray-400">Venues, Events, Resources &amp; Maintenance</span>
                  </a>
                </div>
              )}
            </div>

            {/* 7. Contact Us */}
            <Link
              to="/contact"
              className="px-3.5 py-2 text-[#D1D5DB] hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all duration-150 ease-out whitespace-nowrap focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none"
            >
              Contact Us
            </Link>
          </div>

          {/* Action CTAs: shrink-0 guarantees Register is NEVER clipped, identical 40px height, clean spacing */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Admin Portal (Ghost/Outline with small shield icon in neutral white, visible on wide screens) */}
            <Link to="/login?role=admin" className="hidden 2xl:inline-block">
              <button
                type="button"
                className="h-10 px-3.5 rounded-[10px] text-[13px] font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.06] inline-flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
                <span>Admin Portal</span>
              </button>
            </Link>

            {/* Sign In (Secondary Ghost Button) */}
            <Link to="/login" className="hidden sm:inline-block">
              <button
                type="button"
                className="h-10 px-3.5 rounded-[10px] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] inline-flex items-center justify-center transition-all duration-150 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none cursor-pointer"
              >
                Sign In
              </button>
            </Link>

            {/* Register (The ONLY solid filled primary green button - shrink-0 ensures full visibility) */}
            <Link to="/register" className="shrink-0">
              <button
                type="button"
                className="h-10 px-4 rounded-[10px] bg-lime text-black font-semibold text-[13px] shadow-[0_0_20px_rgba(74,222,128,0.25)] hover:-translate-y-[1px] hover:shadow-[0_0_24px_rgba(131,243,77,0.35)] transition-all duration-150 inline-flex items-center justify-center whitespace-nowrap focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none cursor-pointer shrink-0"
              >
                Register
              </button>
            </Link>

            {/* Mobile Hamburger Toggle (Collapsed below 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden h-10 w-10 flex items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] outline-none shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-2 p-4 rounded-[14px] bg-[#0d0d0f]/95 border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-3 animate-fade-in text-[13px]">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/[0.08]">
              <a
                href="/#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-white/70" /> Leadership
              </a>
              <Link
                to="/faculty/ise"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/70" /> ISE Faculty
                </span>
                <span className="text-[11px] text-lime font-semibold">41</span>
              </Link>
              <a
                href="/#branches"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-white/70" /> 9 Branches
              </a>
              <a
                href="/#partners"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-white/70" /> Placements
              </a>
              <a
                href="/#life-at-sjbit"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-white/70" /> Life @ SJBIT
              </a>
              <a
                href="/#modules"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-white/70" /> Campus Modules
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 p-2.5 rounded-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-white/70" /> Contact SJBIT Administration
              </Link>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link to="/login?role=admin" onClick={() => setMobileMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full h-10 px-3.5 rounded-[10px] text-[13px] font-medium text-gray-300 hover:text-white border border-white/10 hover:bg-white/[0.06] inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-white/80" /> Admin Office Portal
                </button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    type="button"
                    className="w-full h-10 px-4 rounded-[10px] text-[13px] font-medium text-gray-300 hover:text-white border border-white/10 hover:bg-white/[0.06] transition-all"
                  >
                    Sign In
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    type="button"
                    className="w-full h-10 px-4 rounded-[10px] bg-lime text-black font-semibold text-[13px] shadow-[0_0_20px_rgba(74,222,128,0.25)] transition-all"
                  >
                    Register
                  </button>
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
