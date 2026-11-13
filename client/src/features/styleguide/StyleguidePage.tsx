import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Sparkles,
  Search,
  Calendar,
  Building2,
  Package,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  Send,
  Trash2,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SearchBar } from '@/components/ui/SearchBar';
import { PillCard } from '@/components/ui/PillCard';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';

export const StyleguidePage: React.FC = () => {
  // Interactive state demos
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const accordionItems = [
    {
      id: 'venue-booking',
      title: 'How does the conflict-free venue booking algorithm work?',
      badge: 'Core Logic',
      content: (
        <p>
          Every reservation checks existing approved bookings against the requested start and end timestamps.
          If an overlap exists on the requested venue, the API immediately throws a <code>409 Conflict</code> error.
          Pending requests are held in escrow until a faculty member or administrator approves with a review comment.
        </p>
      ),
    },
    {
      id: 'waitlist-promotion',
      title: 'How are event waitlists promoted upon cancellation?',
      badge: 'Automation',
      content: (
        <p>
          When a registered attendee cancels their registration, a transaction query fetches the earliest waitlisted
          applicant and automatically promotes their status to <code>registered</code>, generating a personalized QR ticket and
          dispatching an instant notification.
        </p>
      ),
    },
    {
      id: 'design-tokens',
      title: 'What design philosophy drives CampusOS?',
      badge: 'Dark Glassy',
      content: (
        <p>
          Inspired by high-performance trading platforms: deep obsidian surface (<code>#090909</code>), frosted glass layers,
          high-contrast electric lime accents (<code>#83F34D</code>), and buttery smooth 320ms grid accordion physics.
        </p>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-28 px-4 sm:px-6 space-y-16 pb-20">
      {/* Page Title & Vision */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/30 text-lime text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CampusOS Design System v1.0</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Component Kit & Design Tokens
        </h1>
        <p className="text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed">
          Near-black obsidian base, frosted glass containers, electric lime accent, and tactile micro-interactions.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>1. Core Color Tokens</span>
            <span className="text-xs font-mono text-white/40 font-normal">(@theme tokens.css)</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#090909] border border-ring" />
            <div>
              <p className="text-xs font-bold text-white">--color-page</p>
              <p className="text-[11px] font-mono text-white/50">#090909</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#1B1B1B] border border-ring" />
            <div>
              <p className="text-xs font-bold text-white">--color-card</p>
              <p className="text-[11px] font-mono text-white/50">#1B1B1B</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#131313] border border-ring" />
            <div>
              <p className="text-xs font-bold text-white">--color-row</p>
              <p className="text-[11px] font-mono text-white/50">#131313</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#83F34D] border border-transparent shadow-[0_0_20px_rgba(131,243,77,0.4)]" />
            <div>
              <p className="text-xs font-bold text-lime">--color-lime (Primary)</p>
              <p className="text-[11px] font-mono text-white/50">#83F34D</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#0B2400] border border-ring" />
            <div>
              <p className="text-xs font-bold text-white">--color-lime-ink</p>
              <p className="text-[11px] font-mono text-white/50">#0B2400</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#1D2E13] border border-ring" />
            <div>
              <p className="text-xs font-bold text-white">--color-glow</p>
              <p className="text-[11px] font-mono text-white/50">#1D2E13</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#232323] border border-ring" />
            <div>
              <p className="text-xs font-bold text-white">--color-ring</p>
              <p className="text-[11px] font-mono text-white/50">#232323</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-ring/80 space-y-3">
            <div className="h-14 rounded-lg bg-[#2F2F2F] border border-ring" />
            <div>
              <p className="text-xs font-bold text-white">--color-rule</p>
              <p className="text-[11px] font-mono text-white/50">#2F2F2F</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Buttons */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">2. Button Variants & States</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="lime">Lime Primary</Button>
            <Button variant="outline">Lime Outline</Button>
            <Button variant="white">White Action</Button>
            <Button variant="ghost">Ghost Neutral</Button>
            <Button variant="danger">Danger</Button>
            <Button
              variant="lime"
              isLoading={btnLoading}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 1500);
              }}
            >
              {btnLoading ? 'Processing...' : 'Click for Loading'}
            </Button>
            <Button variant="lime" disabled>
              Disabled
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="lime" size="sm">Small</Button>
            <Button variant="lime" size="md">Medium</Button>
            <Button variant="lime" size="lg">Large Hero</Button>
          </div>
        </div>
      </section>

      {/* 3. Form Controls & SearchBar */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">3. Form Controls & SearchBar</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-5 rounded-2xl bg-card border border-ring/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Inputs & Search</h3>
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue('')}
              placeholder="Type to search (Lexend 300, glass backdrop)..."
            />
            <Input
              label="Venue Name"
              placeholder="e.g. Turing Auditorium Room 402"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="Error State Demonstration"
              placeholder="Required value missing"
              error="A valid capacity between 1 and 500 is required"
              defaultValue="Invalid Capacity"
            />
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-card border border-ring/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Selects & Textarea</h3>
            <Select
              label="Campus Role"
              options={[
                { value: 'student', label: 'Student' },
                { value: 'faculty', label: 'Faculty' },
                { value: 'club_head', label: 'Club Head' },
                { value: 'maintenance', label: 'Maintenance Staff' },
                { value: 'admin', label: 'Campus Administrator' },
              ]}
            />
            <Textarea
              label="Maintenance Description"
              placeholder="Describe the issue in detail (location, nature of problem)..."
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* 4. PillCards (Module Cards) */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            4. PillCards (Fully Rounded Module Tiles)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PillCard
            icon={<Building2 className="w-5 h-5" />}
            title="Venue Booking"
            subtitle="Conflict-free room reservation"
            badge={<Badge variant="lime">Active</Badge>}
            onClick={() => toast.info('Navigating to Venues')}
          />
          <PillCard
            icon={<Calendar className="w-5 h-5" />}
            title="Campus Events"
            subtitle="Waitlist & QR check-in"
            badge={<Badge variant="approved">3 Live</Badge>}
            onClick={() => toast.info('Navigating to Events')}
          />
          <PillCard
            icon={<Package className="w-5 h-5" />}
            title="Resource Allocation"
            subtitle="Hardware & lab checkout"
            badge={<Badge variant="pending">2 Pending</Badge>}
            onClick={() => toast.info('Navigating to Resources')}
          />
          <PillCard
            icon={<Wrench className="w-5 h-5" />}
            title="Maintenance Tickets"
            subtitle="Photo dispatch & tracking"
            badge={<Badge variant="overdue">1 Urgent</Badge>}
            onClick={() => toast.info('Navigating to Maintenance')}
          />
          <PillCard
            icon={<Search className="w-5 h-5" />}
            title="Lost & Found"
            subtitle="Smart match & claims"
            badge={<Badge variant="neutral">12 Items</Badge>}
            onClick={() => toast.info('Navigating to Lost & Found')}
          />
          <PillCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Admin Governance"
            subtitle="Campus health & reports"
            badge={<Badge variant="info">Audit</Badge>}
            active
            onClick={() => toast.info('Navigating to Governance')}
          />
        </div>
      </section>

      {/* 5. Status Badges */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">5. Status Badges</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-ring/80">
          <Badge variant="pending" dot>Pending Approval</Badge>
          <Badge variant="approved" dot>Approved</Badge>
          <Badge variant="resolved" dot>Resolved</Badge>
          <Badge variant="rejected" dot>Rejected</Badge>
          <Badge variant="overdue" dot>Overdue (Alert)</Badge>
          <Badge variant="lime" dot>Live System</Badge>
          <Badge variant="info" dot>Under Review</Badge>
          <Badge variant="neutral">Archived</Badge>
        </div>
      </section>

      {/* 6. Accordion (320ms Grid Physics) */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            6. Smooth Accordion (grid-template-rows 320ms)
          </h2>
        </div>

        <Accordion items={accordionItems} defaultOpenId="venue-booking" />
      </section>

      {/* 7. Tables */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">7. Styled Dark Table</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Venue / Event</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date & Window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold text-white">
                Main Seminar Hall A
              </TableCell>
              <TableCell>Robotics Club (Dr. Mehta)</TableCell>
              <TableCell className="text-white/70">Nov 18, 2:00 PM - 5:00 PM</TableCell>
              <TableCell>
                <Badge variant="approved" dot>Approved</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Manage</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-white">
                Innovation Lab 3
              </TableCell>
              <TableCell>Priya Sharma (Student)</TableCell>
              <TableCell className="text-white/70">Nov 19, 10:00 AM - 1:00 PM</TableCell>
              <TableCell>
                <Badge variant="pending" dot>Pending</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="lime" size="sm">Review</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-white">
                Basketball Court Floodlights
              </TableCell>
              <TableCell>Sports Council</TableCell>
              <TableCell className="text-white/70">Nov 15, 6:00 PM - 9:00 PM</TableCell>
              <TableCell>
                <Badge variant="overdue" dot>Overdue Return</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="danger" size="sm">Flag</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 8. Modal & Toast Triggers */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">8. Modal & Toast Interactivity</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="lime" onClick={() => setModalOpen(true)}>
            Open Glass Modal
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success('Action successful! Notification dispatched.', {
                description: 'Record updated with audit timestamp.',
              })
            }
          >
            Trigger Success Toast
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              toast.error('Booking Conflict Detected', {
                description: 'Turing Hall is already reserved between 2:00 PM and 4:00 PM.',
              })
            }
          >
            Trigger Error Toast
          </Button>
        </div>

        {/* Modal Instance */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Approve Venue Reservation"
          description="Confirm time window and verify faculty supervisor clearance."
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="lime"
                onClick={() => {
                  setModalOpen(false);
                  toast.success('Reservation Approved!', {
                    description: 'The requester has received an automated confirmation.',
                  });
                }}
              >
                Confirm Approval
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-row border border-ring/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-white/50">Requested Venue:</span>
                <span className="font-bold text-white">Main Auditorium Room 101</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Timeslot:</span>
                <span className="font-mono text-lime">Nov 20, 2026 (14:00 - 17:00)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Conflict Status:</span>
                <span className="text-emerald-400 font-semibold">0 Overlaps Detected</span>
              </div>
            </div>
            <Textarea
              label="Approval Comment (Optional)"
              placeholder="e.g. Approved. Audio engineer assigned to assist."
              rows={2}
            />
          </div>
        </Modal>
      </section>

      {/* 9. Skeletons, Empty States & Pagination */}
      <section className="space-y-6">
        <div className="border-b border-ring/80 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            9. Skeletons, Empty States & Pagination
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skeleton Loaders */}
          <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Skeleton State</h3>
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 w-28 rounded-btn" />
                <Skeleton className="h-10 w-28 rounded-btn" />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <EmptyState
            title="No Active Maintenance Tickets"
            description="All campus facilities are currently reported operational and in good condition."
            actionLabel="Report New Issue"
            onAction={() => toast.info('Opening new ticket drawer')}
          />
        </div>

        {/* Pagination */}
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </section>
    </div>
  );
};
