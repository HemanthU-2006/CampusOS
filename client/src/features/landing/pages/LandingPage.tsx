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
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PillCard } from '@/components/ui/PillCard';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';

export const LandingPage: React.FC = () => {
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does real-time conflict-free venue booking work?',
      badge: 'Core Logic',
      content: (
        <p>
          Whenever a student, club head, or faculty member requests a room, CampusOS runs an immediate database query checking existing approved reservations. If an overlap is found, the request is rejected with a clear <code>409 Conflict</code> error. Approved requests reserve the timeslot instantly with automated audit logging.
        </p>
      ),
    },
    {
      id: 'faq-2',
      title: 'How does automated event waitlist promotion work?',
      badge: 'Automation',
      content: (
        <p>
          When an event reaches full seating capacity, applicants are automatically placed on an ordered waitlist. If a registered attendee cancels their ticket, the system automatically promotes the earliest waitlisted user, generates their contactless QR ticket, and dispatches a notification.
        </p>
      ),
    },
    {
      id: 'faq-3',
      title: 'How is attendance calculated and warned?',
      badge: 'Compliance',
      content: (
        <p>
          Faculty members can bulk-mark student records with compound unique keys (course + date + student). The platform runs an aggregation pipeline to calculate attendance percentages. Any student falling below the 75% threshold receives an automated notice, and faculty can export complete semester CSV reports with one click.
        </p>
      ),
    },
    {
      id: 'faq-4',
      title: 'Who oversees hardware checkouts and maintenance dispatch?',
      badge: 'Operations',
      content: (
        <p>
          Lab gear checkout follows a strict state machine (requested → approved → issued → returned/overdue), updating real-time inventory counts at every transition. Maintenance tickets include photos, allow admin dispatch to specific staff, and allow students to provide 1-5 star ratings upon repair completion.
        </p>
      ),
    },
    {
      id: 'faq-5',
      title: 'Can CampusOS run entirely on local campus infrastructure?',
      badge: 'Deployment',
      content: (
        <p>
          Yes. CampusOS is engineered with Node, Express, MongoDB, and React with zero external vendor lock-in. It can be hosted on a single campus server or scaled across containerized cloud clusters with strict httpOnly security headers.
        </p>
      ),
    },
  ];

  return (
    <div className="text-white selection:bg-lime selection:text-lime-ink">
      {/* =========================================================================
          1. CINEMATIC HERO SECTION (Directly Integrated, No 300vh Empty Scroll Void)
          ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 pt-28 pb-20"
      >
        {/* Fullscreen Background Video (Continuous Smooth 60fps Drone View) */}
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

        {/* Cinematic Vignette & Bottom Feathering: Fades directly into #090909 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 via-40% to-[#090909] to-95% pointer-events-none" />

        {/* Central Radial Lime Aura for Depth */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(131,243,77,0.12),transparent_70%)] pointer-events-none" />

        {/* Hero Content Stage */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/85 border border-ring text-lime text-xs font-semibold shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-lime" />
            <span>CampusOS v1.0 Production Platform</span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-2xl">
            Run Your Campus <br />
            <span className="text-lime">Smarter, Faster.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Venues, events, resources, clubs, attendance and maintenance in one place. No paperwork, no delays.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button
                variant="lime"
                size="lg"
                className="shadow-[0_0_30px_rgba(131,243,77,0.45)] hover:shadow-[0_0_40px_rgba(131,243,77,0.6)] font-bold text-sm sm:text-base px-7"
              >
                Get Started Free <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="white"
                size="lg"
                className="font-semibold text-sm sm:text-base px-6 backdrop-blur-md"
              >
                Sign In (Quick Demo)
              </Button>
            </Link>
            <a href="#modules">
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-sm sm:text-base px-6 border-white/20 hover:border-white/40"
              >
                Explore Modules
              </Button>
            </a>
          </div>

          {/* Core Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-medium text-white/75">
            <span className="px-3 py-1 rounded-full bg-card/60 border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-lime" /> Conflict-Free Venues
            </span>
            <span className="px-3 py-1 rounded-full bg-card/60 border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime" /> Auto Waitlists &amp; QR
            </span>
            <span className="px-3 py-1 rounded-full bg-card/60 border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime" /> Strict SLA Maintenance
            </span>
          </div>
        </div>

        {/* Scroll Prompt directly linking into Modules */}
        <div className="relative z-10 pt-16 flex flex-col items-center gap-2 text-white/60 text-xs font-medium tracking-wider">
          <a
            href="#modules"
            className="group flex flex-col items-center gap-2 hover:text-lime transition-colors"
          >
            <span className="group-hover:tracking-widest transition-all">EXPLORE 7 CORE MODULES</span>
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 group-hover:border-lime transition-colors">
              <div className="w-1.5 h-2.5 rounded-full bg-lime animate-bounce" />
            </div>
          </a>
        </div>
      </section>

      {/* =========================================================================
          2. MODULES GRID (7 PillCards as requested, Seamlessly Flowing Below Hero)
          ========================================================================= */}
      <section
        id="modules"
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12"
      >
        {/* Subtle Ambient Lime Glow connecting from the hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[radial-gradient(ellipse_at_top,rgba(131,243,77,0.06),transparent_70%)] pointer-events-none" />

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="lime" className="mx-auto">
            7 Integrated Core Modules
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Complete Campus Infrastructure
          </h2>
          <p className="text-sm text-white/60">
            Every module is crafted to eliminate manual back-and-forth and guarantee conflict-free operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link to="/venues">
            <PillCard
              icon={<Building2 className="w-5 h-5" />}
              title="Venues"
              subtitle="Conflict-free room booking with instant DB collision detection and faculty audit logging."
            />
          </Link>
          <Link to="/events">
            <PillCard
              icon={<Calendar className="w-5 h-5" />}
              title="Events"
              subtitle="Seating caps, automatic waitlist promotion, and instant QR check-in passes."
            />
          </Link>
          <Link to="/resources">
            <PillCard
              icon={<Package className="w-5 h-5" />}
              title="Resources"
              subtitle="Strict state-machine hardware checkout tracking requested, approved, issued, and returned items."
            />
          </Link>
          <Link to="/clubs">
            <PillCard
              icon={<Users className="w-5 h-5" />}
              title="Clubs"
              subtitle="Official member rosters, broadcast feeds, and automated student activity points."
            />
          </Link>
          <Link to="/lost-found">
            <PillCard
              icon={<Search className="w-5 h-5" />}
              title="Lost & Found"
              subtitle="Keyword & category match engine with verified claim flows and secure handoffs."
            />
          </Link>
          <Link to="/attendance">
            <PillCard
              icon={<UserCheck className="w-5 h-5" />}
              title="Attendance"
              subtitle="Unique compound records, automated <75% warning thresholds, and 1-click semester CSV exports."
            />
          </Link>
          <Link to="/maintenance" className="md:col-span-2 lg:col-span-1">
            <PillCard
              icon={<Wrench className="w-5 h-5" />}
              title="Maintenance"
              subtitle="Photo dispatch, role assignment, live status updates, and student star ratings."
            />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE FAQ ACCORDION (320ms Spring Physics)
          ========================================================================= */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="approved" className="mx-auto">
            Architecture &amp; Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-white/60">
            Engineered with strict types, deterministic workflows, and full data integrity.
          </p>
        </div>

        <Accordion items={faqItems} defaultOpenId="faq-1" />
      </section>

      {/* =========================================================================
          4. FINAL CTA BANNER
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative rounded-pill border border-lime/30 bg-card/60 backdrop-blur-xl p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_50px_rgba(131,243,77,0.12)]">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to modernize <br />
              <span className="text-lime">your entire campus?</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70">
              Sign up today or test instant access across all 5 user roles with one click.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/register">
                <Button variant="lime" size="lg" className="shadow-[0_0_24px_rgba(131,243,77,0.4)]">
                  Create CampusOS Account <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="white" size="lg">
                  Try Demo Accounts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
