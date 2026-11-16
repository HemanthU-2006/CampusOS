import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Star,
  MapPin,
  ArrowRight,
  Upload,
  Check,
  Search,
  Camera,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { DEFAULT_TICKETS, MaintenanceTicketItem, maintenanceApi } from '../api';
import { aiApi } from '@/features/ai/api';

export const MaintenancePage: React.FC = () => {
  const { user } = useAuth();
  const isMaintenanceStaff = user?.role === 'maintenance' || user?.role === 'admin';

  const [tickets, setTickets] = useState<MaintenanceTicketItem[]>(DEFAULT_TICKETS);
  const [activeTab, setActiveTab] = useState<'all' | 'my_tasks' | 'done'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real tickets from backend on mount
  React.useEffect(() => {
    let isMounted = true;
    maintenanceApi.getTickets().then((data) => {
      if (isMounted && data && data.length > 0) {
        setTickets(data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // 3-field form state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [whatIsWrong, setWhatIsWrong] = useState('');
  const [whereIsIt, setWhereIsIt] = useState('');
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [aiTriageResult, setAiTriageResult] = useState<{
    category: MaintenanceTicketItem['category'];
    priority: MaintenanceTicketItem['priority'];
    summary: string;
    suggestedAction: string;
    safetyCaution?: string;
    estimatedHours: number;
  } | null>(null);
  const [isTriaging, setIsTriaging] = useState(false);

  const handleAutoTriage = async () => {
    if (!whatIsWrong.trim()) {
      toast.info('Please enter what is wrong first so AI can analyze it');
      return;
    }
    setIsTriaging(true);
    try {
      const res = await aiApi.triage(whatIsWrong, whatIsWrong, whereIsIt || 'SJBIT Campus');
      setAiTriageResult(res);
      toast.success(`AI Classified: ${res.category.toUpperCase()} (${res.priority.toUpperCase()} Priority)`);
    } catch {
      toast.error('AI triage unavailable right now');
    } finally {
      setIsTriaging(false);
    }
  };

  // Detail Modal State with 4-step timeline
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<MaintenanceTicketItem | null>(null);

  // Quick staff resolution modal
  const [resolveNote, setResolveNote] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatIsWrong.trim()) {
      toast.error('Please describe what is wrong');
      return;
    }
    if (!whereIsIt.trim()) {
      toast.error('Please specify the location');
      return;
    }

    const newTicket: MaintenanceTicketItem = {
      _id: `tick-${Date.now()}`,
      title: whatIsWrong,
      description: whatIsWrong,
      category: aiTriageResult?.category || 'other',
      priority: aiTriageResult?.priority || 'medium',
      status: 'open',
      location: whereIsIt,
      reportedBy: {
        _id: user?._id || 'user-curr',
        name: user?.name || 'You',
        email: user?.email || 'user@campus.edu',
        role: user?.role || 'student',
      },
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setTickets([newTicket, ...tickets]);
    setCreateModalOpen(false);
    setWhatIsWrong('');
    setWhereIsIt('');
    setPhotoName(null);
    setAiTriageResult(null);
    toast.success('Problem reported!', {
      description: 'Campus maintenance team has been notified.',
    });

    maintenanceApi.createTicket({
      title: whatIsWrong,
      description: whatIsWrong,
      location: whereIsIt,
      category: aiTriageResult?.category || 'other',
      priority: aiTriageResult?.priority || 'medium',
    }).then((created) => {
      if (created?._id) {
        setTickets((prev) => [created, ...prev.filter(t => t._id !== newTicket._id)]);
      }
    }).catch(() => {});
  };

  const advanceTicketStep = (ticketId: string, nextStatus: MaintenanceTicketItem['status']) => {
    if (!ticketId.startsWith('tick-')) {
      maintenanceApi.updateStatus(ticketId, nextStatus).catch(() => {});
    }
    setTickets((prev) =>
      prev.map((t) => {
        if (t._id === ticketId) {
          const updated = {
            ...t,
            status: nextStatus,
            resolvedAt: nextStatus === 'resolved' ? new Date().toISOString() : t.resolvedAt,
          };
          if (selectedTicketForDetail && selectedTicketForDetail._id === ticketId) {
            setSelectedTicketForDetail(updated);
          }
          return updated;
        }
        return t;
      })
    );

    const label =
      nextStatus === 'in_progress' ? 'marked In progress' : nextStatus === 'resolved' ? 'marked Done' : 'updated';
    toast.success(`Task ${label}!`);
  };

  const handleRateTicket = (ticketId: string, rating: number) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t._id === ticketId) {
          const updated = { ...t, status: 'closed' as const, rating };
          if (selectedTicketForDetail && selectedTicketForDetail._id === ticketId) {
            setSelectedTicketForDetail(updated);
          }
          return updated;
        }
        return t;
      })
    );
    toast.success('Thank you for rating the repair!');
  };

  const getTimelineStepIndex = (status: MaintenanceTicketItem['status']) => {
    switch (status) {
      case 'open':
        return 1;
      case 'assigned':
        return 2;
      case 'in_progress':
        return 3;
      case 'resolved':
      case 'closed':
        return 4;
      default:
        return 1;
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      t.title.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeTab === 'my_tasks') {
      return isMaintenanceStaff
        ? t.status === 'assigned' || t.status === 'in_progress'
        : t.reportedBy._id === user?._id;
    }
    if (activeTab === 'done') {
      return t.status === 'resolved' || t.status === 'closed';
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with One Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Repairs
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Report broken equipment or campus issues for repair.
          </p>
        </div>

        <Button
          variant="lime"
          size="lg"
          onClick={() => setCreateModalOpen(true)}
          className="shadow-[0_0_20px_rgba(131,243,77,0.35)] shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Report a problem
        </Button>
      </div>

      {/* 2. Top Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-ring/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            All Reports ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_tasks')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'my_tasks'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {isMaintenanceStaff ? 'My Assigned Tasks' : 'My Reports'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('done')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'done'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Done &amp; Closed
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems or places..."
            className="w-full bg-white/[0.07] border border-white/15 text-white text-xs rounded-pill pl-9 pr-3 py-2 outline-none focus:border-lime"
          />
        </div>
      </div>

      {/* 3. Ticket List (Simple, Clear Cards with 4-5 key fields) */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-lime mx-auto" />
            <p className="text-sm font-semibold text-white">No reports found</p>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Everything in this section is running smoothly. Click below if you need to report an issue.
            </p>
            <Button variant="lime" size="sm" onClick={() => setCreateModalOpen(true)}>
              Report a problem
            </Button>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const stepIndex = getTimelineStepIndex(ticket.status);
            const isDone = ticket.status === 'resolved' || ticket.status === 'closed';

            return (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicketForDetail(ticket)}
                className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">{ticket.title}</h3>
                    <Badge
                      variant={
                        isDone
                          ? 'approved'
                          : ticket.status === 'in_progress'
                          ? 'lime'
                          : ticket.status === 'assigned'
                          ? 'info'
                          : 'pending'
                      }
                    >
                      {ticket.status === 'open'
                        ? 'Reported'
                        : ticket.status === 'assigned'
                        ? 'Assigned'
                        : ticket.status === 'in_progress'
                        ? 'In progress'
                        : 'Done'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-lime shrink-0" />
                    <span className="truncate">{ticket.location}</span>
                    <span>·</span>
                    <span>Time to fix: ~3h</span>
                  </div>

                  <p className="text-xs text-lime font-medium">
                    {ticket.status === 'open'
                      ? 'Next step: Waiting for staff assignment'
                      : ticket.status === 'assigned'
                      ? `Next step: Assigned to ${ticket.assignedTo?.name || 'facilities staff'}`
                      : ticket.status === 'in_progress'
                      ? 'Next step: Repair underway'
                      : ticket.rating
                      ? `Rated: ${'★'.repeat(ticket.rating)}`
                      : 'Next step: Ready for your rating'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Staff actions */}
                  {isMaintenanceStaff && !isDone && (
                    <>
                      {ticket.status === 'open' || ticket.status === 'assigned' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            advanceTicketStep(ticket._id, 'in_progress');
                          }}
                        >
                          Start work
                        </Button>
                      ) : (
                        <Button
                          variant="lime"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            advanceTicketStep(ticket._id, 'resolved');
                          }}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Mark Done
                        </Button>
                      )}
                    </>
                  )}

                  {/* Student rate button */}
                  {ticket.status === 'resolved' && !ticket.rating && (
                    <Button
                      variant="lime"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicketForDetail(ticket);
                      }}
                      className="shadow-[0_0_12px_rgba(131,243,77,0.3)]"
                    >
                      <Star className="w-3.5 h-3.5 mr-1" /> Rate fix
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTicketForDetail(ticket);
                    }}
                  >
                    View details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Simple 3-Field Problem Reporting Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Report a problem"
        description="Tell us what is broken so campus facilities can inspect and fix it."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <Input
              label="1. What is wrong?"
              placeholder="e.g. AC leaking water, projector not turning on, door latch broken"
              value={whatIsWrong}
              onChange={(e) => setWhatIsWrong(e.target.value)}
            />
            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <span className="text-[11px] text-white/50">Need automatic priority assessment?</span>
              <button
                type="button"
                onClick={handleAutoTriage}
                disabled={isTriaging || !whatIsWrong.trim()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime/10 border border-lime/30 text-lime text-[11px] font-medium hover:bg-lime/20 cursor-pointer disabled:opacity-40 transition-all"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isTriaging ? 'Analyzing...' : 'AI Auto-Triage'}</span>
              </button>
            </div>

            {aiTriageResult && (
              <div className="mt-2.5 p-3 rounded-xl bg-lime/5 border border-lime/25 text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="lime" className="text-[10px] uppercase font-bold tracking-wider">
                    {aiTriageResult.category}
                  </Badge>
                  <span className="text-white/70">
                    Priority: <strong className="text-white capitalize">{aiTriageResult.priority}</strong>
                  </span>
                  <span className="text-white/40">· Est. {aiTriageResult.estimatedHours}h</span>
                </div>
                {aiTriageResult.safetyCaution && (
                  <p className="text-amber-400 font-semibold text-[11px]">
                    ⚠️ {aiTriageResult.safetyCaution}
                  </p>
                )}
                {aiTriageResult.suggestedAction && (
                  <p className="text-white/60 text-[11px]">
                    Action: {aiTriageResult.suggestedAction}
                  </p>
                )}
              </div>
            )}
          </div>

          <Input
            label="2. Where is it?"
            placeholder="e.g. CS Block 2nd Floor, Room 204 near rear window"
            value={whereIsIt}
            onChange={(e) => setWhereIsIt(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              3. Photo of problem (optional)
            </label>
            <div className="border border-dashed border-ring/80 rounded-xl p-4 text-center hover:border-lime/40 transition-colors cursor-pointer bg-white/[0.02]">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPhotoName(e.target.files[0].name);
                  }
                }}
              />
              <label htmlFor="photo-upload" className="cursor-pointer block space-y-1">
                <Camera className="w-6 h-6 text-white/40 mx-auto" />
                <p className="text-xs text-white/70">
                  {photoName ? (
                    <span className="text-lime font-medium">{photoName}</span>
                  ) : (
                    'Click to attach photo from phone or computer'
                  )}
                </p>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-ring/60">
            <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Submit report
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Ticket Detail Side Panel / Modal with 4-Step Timeline & Star Rating */}
      {selectedTicketForDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTicketForDetail(null)}
          title={selectedTicketForDetail.title}
          description={`Reported by ${selectedTicketForDetail.reportedBy.name} · ${selectedTicketForDetail.location}`}
          size="md"
        >
          <div className="space-y-5">
            {/* 4-Step Timeline: Reported -> Assigned -> In progress -> Done */}
            <div className="p-4 rounded-xl bg-row border border-ring/60">
              <p className="text-xs font-bold text-white mb-3">Repair Progress</p>
              <div className="flex items-center justify-between text-xs">
                {/* Step 1: Reported */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-lime text-lime-ink font-bold flex items-center justify-center text-xs shadow-[0_0_10px_rgba(131,243,77,0.3)]">
                    ✓
                  </div>
                  <span className="text-[11px] text-white font-medium mt-1">Reported</span>
                </div>

                <div
                  className={`h-0.5 flex-1 mx-1.5 ${
                    getTimelineStepIndex(selectedTicketForDetail.status) >= 2 ? 'bg-lime' : 'bg-ring'
                  }`}
                />

                {/* Step 2: Assigned */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      getTimelineStepIndex(selectedTicketForDetail.status) >= 2
                        ? 'bg-lime text-lime-ink'
                        : 'bg-card border border-ring text-white/40'
                    }`}
                  >
                    {getTimelineStepIndex(selectedTicketForDetail.status) >= 2 ? '✓' : '2'}
                  </div>
                  <span className="text-[11px] text-white/80 font-medium mt-1">Assigned</span>
                </div>

                <div
                  className={`h-0.5 flex-1 mx-1.5 ${
                    getTimelineStepIndex(selectedTicketForDetail.status) >= 3 ? 'bg-lime' : 'bg-ring'
                  }`}
                />

                {/* Step 3: In progress */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      getTimelineStepIndex(selectedTicketForDetail.status) >= 3
                        ? 'bg-lime text-lime-ink'
                        : 'bg-card border border-ring text-white/40'
                    }`}
                  >
                    {getTimelineStepIndex(selectedTicketForDetail.status) >= 3 ? '✓' : '3'}
                  </div>
                  <span className="text-[11px] text-white/80 font-medium mt-1">In progress</span>
                </div>

                <div
                  className={`h-0.5 flex-1 mx-1.5 ${
                    getTimelineStepIndex(selectedTicketForDetail.status) >= 4 ? 'bg-lime' : 'bg-ring'
                  }`}
                />

                {/* Step 4: Done */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      getTimelineStepIndex(selectedTicketForDetail.status) >= 4
                        ? 'bg-lime text-lime-ink'
                        : 'bg-card border border-ring text-white/40'
                    }`}
                  >
                    {getTimelineStepIndex(selectedTicketForDetail.status) >= 4 ? '✓' : '4'}
                  </div>
                  <span className="text-[11px] text-white/80 font-medium mt-1">Done</span>
                </div>
              </div>
            </div>

            {/* Field Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Location:</span>
                <span className="text-white font-medium">{selectedTicketForDetail.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Assigned Technician:</span>
                <span className="text-white">
                  {selectedTicketForDetail.assignedTo?.name || 'Facilities Supervisor'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Time to fix:</span>
                <span className="text-lime font-mono">Under 4 hours</span>
              </div>
            </div>

            {/* Interactive 5-Star Rating Section when ticket reaches Done */}
            {(selectedTicketForDetail.status === 'resolved' ||
              selectedTicketForDetail.status === 'closed') && (
              <div className="p-4 rounded-xl bg-card border border-ring/80 text-center space-y-2">
                <p className="text-xs font-bold text-white">How was this repair handled?</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRateTicket(selectedTicketForDetail._id, star)}
                      className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                        (selectedTicketForDetail.rating || 0) >= star
                          ? 'text-amber-300'
                          : 'text-white/20'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/50">
                  {selectedTicketForDetail.rating
                    ? `Thank you! You rated this fix ${selectedTicketForDetail.rating} out of 5 stars.`
                    : 'Click a star to submit your rating'}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-ring/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicketForDetail(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
