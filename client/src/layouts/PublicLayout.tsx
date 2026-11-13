import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Sparkles, Compass } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-glow-landing relative flex flex-col text-white selection:bg-lime selection:text-lime-ink">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(131,243,77,0.06),transparent_70%)] pointer-events-none z-0" aria-hidden="true" />

      {/* Frosted Pill Navigation */}
      <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-6 max-w-5xl mx-auto">
        <nav className="glass-nav rounded-pill px-5 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime group-hover:shadow-[0_0_12px_rgba(131,243,77,0.4)] transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-lime transition-colors">
              Campus<span className="text-lime">OS</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-white/70">
            <a href="/#hero" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="/#modules" className="hover:text-white transition-colors">
              Modules
            </a>
            <a href="/#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <Link to="/styleguide" className="hover:text-lime text-lime/90 transition-colors flex items-center gap-1 font-semibold">
              <Compass className="w-3.5 h-3.5" />
              Styleguide
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="lime" size="sm" className="text-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-ring/50 py-8 px-6 text-center text-xs text-white/40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CampusOS. Engineering the next generation of campus infrastructure.</p>
          <div className="flex items-center gap-4">
            <Link to="/styleguide" className="hover:text-lime transition-colors">
              Design System & Tokens
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
