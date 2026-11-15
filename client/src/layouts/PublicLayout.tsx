import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, ExternalLink, Award, GraduationCap } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-glow-landing relative flex flex-col text-white selection:bg-lime selection:text-lime-ink">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(131,243,77,0.06),transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* Official Top Institutional Bar */}
      <div className="relative z-50 w-full bg-[#080808]/90 border-b border-white/5 py-1.5 px-4 text-[11px] text-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span className="text-amber-400 font-bold tracking-wider">|| JAI SRI GURUDEV ||</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="font-medium text-white/80">Sri Adichunchanagiri Shikshana Trust ®</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline text-white/60">Autonomous Institute under VTU, Belagavi</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/60">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <Award className="w-3 h-3" /> NAAC 'A+' Grade
            </span>
            <span className="text-white/20">|</span>
            <span className="hidden sm:inline text-white/60">NBA Accredited</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <a
              href="https://www.sjbit.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-lime transition-colors inline-flex items-center gap-1 font-medium"
            >
              Main Website <ExternalLink className="w-3 h-3 text-lime" />
            </a>
          </div>
        </div>
      </div>

      {/* Frosted Navigation Bar */}
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
                <span className="hidden lg:inline text-[9px] px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 font-semibold uppercase">
                  Autonomous
                </span>
              </div>
              <span className="text-[10px] text-white/50 block font-normal leading-tight truncate max-w-[200px] sm:max-w-none">
                SJB Institute of Technology · Bengaluru
              </span>
            </div>
          </Link>

          {/* Navigation Links matching https://www.sjbit.edu.in/ */}
          <div className="hidden xl:flex items-center gap-5 text-xs font-medium text-white/75">
            <a href="/#overview" className="hover:text-white transition-colors">
              Leadership
            </a>
            <a href="/#branches" className="hover:text-white transition-colors">
              9 Branches
            </a>
            <a href="/#ise-faculty" className="hover:text-white text-amber-300 font-semibold transition-colors">
              ISE Faculty
            </a>
            <a href="/#life-at-sjbit" className="hover:text-white transition-colors">
              Life @ SJBIT
            </a>
            <a href="/#partners" className="hover:text-white transition-colors">
              Industry Partners
            </a>
            <a href="/#modules" className="hover:text-white transition-colors">
              Campus Modules
            </a>
            <Link to="/contact" className="hover:text-white text-lime transition-colors font-semibold">
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
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      {/* Institutional Footer */}
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
              BGS Health &amp; Education City, Dr. Vishnuvardhan Road, Kengeri, Bengaluru – 560060, Karnataka, India. 
              Autonomous Institution under VTU, Belagavi. Approved by AICTE, New Delhi. Accredited by NAAC with 'A+' Grade.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-2.5 uppercase tracking-wider text-[11px]">
              Institutional Links
            </h5>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li><a href="https://www.sjbit.edu.in/" target="_blank" rel="noopener noreferrer" className="hover:text-lime">Official SJBIT Portal</a></li>
              <li><Link to="/contact" className="hover:text-lime">Campus Directory &amp; HOD Contacts</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-rose-300">Principal Office &amp; Admin Board</Link></li>
              <li><Link to="/attendance" className="hover:text-lime">VTU Course Attendance</Link></li>
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
              <li>Women Safety: +91-7204081185</li>
              <li>Student Grievance: +91-9902310181</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 SJBIT CampusOS · SJB Institute of Technology, Bengaluru. All rights reserved.</p>
          <p className="text-[11px] text-white/40">Affiliated to VTU · Approved by AICTE · NAAC 'A+' Accredited</p>
        </div>
      </footer>
    </div>
  );
};
