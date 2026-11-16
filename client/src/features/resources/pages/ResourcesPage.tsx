import React, { useState } from 'react';
import {
  Package,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  Check,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

interface ResourceItem {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  location: string;
}

interface RequestItem {
  id: string;
  resourceId: string;
  resourceName: string;
  applicantName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'requested' | 'approved' | 'issued' | 'returned';
  purpose: string;
}

export const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const canManage =
    user?.role === 'faculty' || user?.role === 'admin' || user?.role === 'maintenance';

  const [activeTab, setActiveTab] = useState<'available' | 'my_requests'>('available');
  const [searchTerm, setSearchTerm] = useState('');

  // Realistic SJBIT Lab Inventory
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 'res-1',
      name: 'Arduino Uno & Sensor Kit',
      category: 'Electronics',
      totalQuantity: 25,
      availableQuantity: 20,
      location: 'SJBIT IoT & Robotics Lab (Block 2)',
    },
    {
      id: 'res-2',
      name: 'Raspberry Pi 4 Model B (8GB)',
      category: 'Embedded Systems',
      totalQuantity: 15,
      availableQuantity: 12,
      location: 'CSE Embedded Labs (Room 203)',
    },
    {
      id: 'res-3',
      name: 'Digital Storage Oscilloscope',
      category: 'Lab Hardware',
      totalQuantity: 8,
      availableQuantity: 6,
      location: 'ECE Hardware & Circuits Lab',
    },
    {
      id: 'res-4',
      name: 'Creality 3D Printer Slot',
      category: 'Prototyping',
      totalQuantity: 4,
      availableQuantity: 3,
      location: 'SJBIT Innovation Center',
    },
    {
      id: 'res-5',
      name: 'Sony 4K Camera & Tripod Kit',
      category: 'Media Gear',
      totalQuantity: 3,
      availableQuantity: 2,
      location: 'BGS Media Center',
    },
  ]);

  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 'req-1',
      resourceId: 'res-2',
      resourceName: 'Raspberry Pi 4 Model B (8GB)',
      applicantName: 'Priya Patel (Student)',
      quantity: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'issued',
      purpose: 'Edge AI inference testing for capstone project.',
    },
    {
      id: 'req-2',
      resourceId: 'res-1',
      resourceName: 'Arduino Uno & Sensor Kit',
      applicantName: 'Devansh Kulkarni',
      quantity: 2,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'requested',
      purpose: 'Smart agriculture sensor prototyping.',
    },
  ]);

  // Request Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState('res-1');
  const [reqQuantity, setReqQuantity] = useState(1);
  const [reqPurpose, setReqPurpose] = useState('');
  const [reqDays, setReqDays] = useState('3');

  // Detail Modal State with Timeline
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<RequestItem | null>(
    null
  );

  const openCheckoutFor = (resId: string) => {
    setSelectedResId(resId);
    setReqQuantity(1);
    setReqPurpose('');
    setCheckoutModalOpen(true);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const resource = resources.find((r) => r.id === selectedResId);
    if (!resource) return;

    if (reqQuantity > resource.availableQuantity) {
      toast.error('Insufficient units', {
        description: `Only ${resource.availableQuantity} unit(s) are currently free.`,
      });
      return;
    }

    const start = new Date().toISOString().split('T')[0];
    const end = new Date(Date.now() + 86400000 * parseInt(reqDays, 10)).toISOString().split('T')[0];

    const newReq: RequestItem = {
      id: `req-${Date.now()}`,
      resourceId: resource.id,
      resourceName: resource.name,
      applicantName: user?.name || 'You',
      quantity: reqQuantity,
      startDate: start,
      endDate: end,
      status: 'requested',
      purpose: reqPurpose || 'Academic project work',
    };

    setRequests([newReq, ...requests]);
    setCheckoutModalOpen(false);
    toast.success('Equipment requested!', {
      description: `Request for ${resource.name} is waiting for lab in-charge approval.`,
    });
    setActiveTab('my_requests');
  };

  const handleStatusTransition = (reqId: string, newStatus: 'approved' | 'issued' | 'returned') => {
    const target = requests.find((r) => r.id === reqId);
    if (!target) return;

    if (newStatus === 'issued' && target.status !== 'issued') {
      setResources((prev) =>
        prev.map((r) =>
          r.id === target.resourceId
            ? { ...r, availableQuantity: Math.max(0, r.availableQuantity - target.quantity) }
            : r
        )
      );
    } else if (newStatus === 'returned' && target.status === 'issued') {
      setResources((prev) =>
        prev.map((r) =>
          r.id === target.resourceId
            ? {
                ...r,
                availableQuantity: Math.min(r.totalQuantity, r.availableQuantity + target.quantity),
              }
            : r
        )
      );
    }

    setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r)));

    toast.success(`Request marked as ${newStatus}!`);
  };

  const getTimelineStep = (status: RequestItem['status']) => {
    switch (status) {
      case 'requested':
        return 1;
      case 'approved':
        return 2;
      case 'issued':
        return 3;
      case 'returned':
        return 4;
      default:
        return 1;
    }
  };

  const filteredResources = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with One Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lab Gear &amp; Equipment
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Borrow development boards, lab kits, and test equipment for your projects.
          </p>
        </div>

        <Button
          variant="lime"
          size="lg"
          onClick={() => setCheckoutModalOpen(true)}
          className="shadow-[0_0_20px_rgba(131,243,77,0.35)] shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Borrow equipment
        </Button>
      </div>

      {/* 2. Top Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-ring/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Available Gear ({resources.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_requests')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'my_requests'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            My Requests ({requests.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gear or labs..."
              className="w-full bg-white/[0.07] border border-white/15 text-white text-xs rounded-pill pl-9 pr-3 py-2 outline-none focus:border-lime"
            />
          </div>
        )}
      </div>

      {/* 3. Available Gear Grid */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-row text-white/70 border border-ring/60">
                    {res.category}
                  </span>
                  <Badge variant={res.availableQuantity > 0 ? 'approved' : 'overdue'}>
                    {res.availableQuantity > 0
                      ? `${res.availableQuantity} available`
                      : 'All issued'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{res.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{res.location}</p>
                </div>

                <div className="text-xs text-white/60 flex justify-between pt-1">
                  <span>Total lab stock:</span>
                  <span className="font-mono text-white font-semibold">
                    {res.totalQuantity} units
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-ring/60 flex items-center justify-end">
                <Button
                  variant="lime"
                  size="sm"
                  onClick={() => openCheckoutFor(res.id)}
                  disabled={res.availableQuantity === 0}
                  className="min-h-[40px] px-4"
                >
                  {res.availableQuantity === 0 ? 'Unavailable' : 'Request to borrow'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. My Requests List with Timeline Access */}
      {activeTab === 'my_requests' && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
              <Package className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-sm font-semibold text-white">No loan requests yet</p>
              <p className="text-xs text-white/50">
                Browse available equipment and submit a borrow request for your project.
              </p>
              <Button variant="lime" size="sm" onClick={() => setActiveTab('available')}>
                Browse gear
              </Button>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequestForDetail(req)}
                className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{req.resourceName}</h3>
                    <Badge
                      variant={
                        req.status === 'issued'
                          ? 'lime'
                          : req.status === 'approved'
                            ? 'info'
                            : req.status === 'returned'
                              ? 'approved'
                              : 'pending'
                      }
                    >
                      {req.status === 'requested'
                        ? 'Waiting'
                        : req.status === 'approved'
                          ? 'Approved'
                          : req.status === 'issued'
                            ? 'In use'
                            : 'Returned'}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70">
                    Requested for {req.applicantName} · Quantity: x{req.quantity}
                  </p>
                  <p className="text-xs text-white/50">Return by: {req.endDate}</p>
                  <p className="text-xs text-lime font-medium pt-0.5">
                    {req.status === 'requested'
                      ? 'Next step: Waiting for lab in-charge approval'
                      : req.status === 'approved'
                        ? 'Next step: Collect physical gear from lab'
                        : req.status === 'issued'
                          ? 'Next step: Return equipment before deadline'
                          : 'Completed: Equipment returned & inspected'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {canManage && (
                    <>
                      {req.status === 'requested' && (
                        <Button
                          variant="lime"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusTransition(req.id, 'approved');
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      {req.status === 'approved' && (
                        <Button
                          variant="lime"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusTransition(req.id, 'issued');
                          }}
                        >
                          Issue Gear
                        </Button>
                      )}
                      {req.status === 'issued' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusTransition(req.id, 'returned');
                          }}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Mark Returned
                        </Button>
                      )}
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequestForDetail(req);
                    }}
                  >
                    View details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. Short Request Form Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Borrow Lab Equipment"
        description="Select how many units you need and for how long."
        size="md"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <Select
            label="Equipment"
            value={selectedResId}
            onChange={(e) => setSelectedResId(e.target.value)}
            options={resources.map((r) => ({
              value: r.id,
              label: `${r.name} (${r.availableQuantity} available)`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={reqQuantity}
              onChange={(e) => setReqQuantity(parseInt(e.target.value, 10) || 1)}
            />
            <Select
              label="Loan Duration"
              value={reqDays}
              onChange={(e) => setReqDays(e.target.value)}
              options={[
                { value: '1', label: '1 Day (Return tomorrow)' },
                { value: '3', label: '3 Days' },
                { value: '7', label: '1 Week' },
                { value: '14', label: '2 Weeks' },
              ]}
            />
          </div>

          <Textarea
            label="What is this for?"
            placeholder="e.g. Capstone project demonstration or lab experiment"
            value={reqPurpose}
            onChange={(e) => setReqPurpose(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-ring/60">
            <Button type="button" variant="ghost" onClick={() => setCheckoutModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Request Detail Modal with 4-Step Status Timeline */}
      {selectedRequestForDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequestForDetail(null)}
          title={selectedRequestForDetail.resourceName}
          description="Loan status timeline and handover history"
          size="md"
        >
          <div className="space-y-5">
            {/* 4-Step Timeline */}
            <div className="p-4 rounded-xl bg-row border border-ring/60">
              <p className="text-xs font-bold text-white mb-3">Loan Timeline</p>
              <div className="flex items-center justify-between text-xs">
                {/* Step 1: Requested */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-lime text-lime-ink font-bold flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span className="text-[11px] text-white font-medium mt-1">Requested</span>
                </div>

                <div
                  className={`h-0.5 flex-1 mx-1.5 ${
                    getTimelineStep(selectedRequestForDetail.status) >= 2 ? 'bg-lime' : 'bg-ring'
                  }`}
                />

                {/* Step 2: Approved */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      getTimelineStep(selectedRequestForDetail.status) >= 2
                        ? 'bg-lime text-lime-ink'
                        : 'bg-card border border-ring text-white/40'
                    }`}
                  >
                    {getTimelineStep(selectedRequestForDetail.status) >= 2 ? '✓' : '2'}
                  </div>
                  <span className="text-[11px] text-white/80 font-medium mt-1">Approved</span>
                </div>

                <div
                  className={`h-0.5 flex-1 mx-1.5 ${
                    getTimelineStep(selectedRequestForDetail.status) >= 3 ? 'bg-lime' : 'bg-ring'
                  }`}
                />

                {/* Step 3: Issued */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      getTimelineStep(selectedRequestForDetail.status) >= 3
                        ? 'bg-lime text-lime-ink'
                        : 'bg-card border border-ring text-white/40'
                    }`}
                  >
                    {getTimelineStep(selectedRequestForDetail.status) >= 3 ? '✓' : '3'}
                  </div>
                  <span className="text-[11px] text-white/80 font-medium mt-1">In Use</span>
                </div>

                <div
                  className={`h-0.5 flex-1 mx-1.5 ${
                    getTimelineStep(selectedRequestForDetail.status) >= 4 ? 'bg-lime' : 'bg-ring'
                  }`}
                />

                {/* Step 4: Returned */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      getTimelineStep(selectedRequestForDetail.status) >= 4
                        ? 'bg-lime text-lime-ink'
                        : 'bg-card border border-ring text-white/40'
                    }`}
                  >
                    {getTimelineStep(selectedRequestForDetail.status) >= 4 ? '✓' : '4'}
                  </div>
                  <span className="text-[11px] text-white/80 font-medium mt-1">Returned</span>
                </div>
              </div>
            </div>

            {/* Field Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Applicant:</span>
                <span className="text-white font-medium">
                  {selectedRequestForDetail.applicantName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Units Requested:</span>
                <span className="text-lime font-mono font-bold">
                  x{selectedRequestForDetail.quantity} Unit(s)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Loan Window:</span>
                <span className="text-white">
                  {selectedRequestForDetail.startDate} to {selectedRequestForDetail.endDate}
                </span>
              </div>
              <div className="py-1.5 border-b border-ring/40">
                <span className="text-white/50 block mb-1">Purpose:</span>
                <p className="text-white/80">{selectedRequestForDetail.purpose}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-ring/60">
              <Button variant="outline" size="sm" onClick={() => setSelectedRequestForDetail(null)}>
                Close details
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
