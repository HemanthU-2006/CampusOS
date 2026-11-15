import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Plus,
  CheckCircle2,
  Sparkles,
  Camera,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

interface LostFoundCard {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'lost' | 'found';
  location: string;
  date: string;
  reportedBy: string;
  status: 'open' | 'claimed' | 'resolved';
}

export const LostFoundPage: React.FC = () => {
  const { user } = useAuth();
  // Items start empty; real lost and found posts will be reported by students/staff
  const [items, setItems] = useState<LostFoundCard[]>([]);

  // Two Tabs: 'lost' or 'found'
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [searchTerm, setSearchTerm] = useState('');

  // 4-Field Form State
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [formWhat, setFormWhat] = useState('');
  const [formWhere, setFormWhere] = useState('');
  const [formWhen, setFormWhen] = useState(() => new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('Electronics');
  const [photoName, setPhotoName] = useState<string | null>(null);

  // Claim Modal
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<LostFoundCard | null>(null);
  const [proofDetails, setProofDetails] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWhat.trim() || !formWhere.trim()) {
      toast.error('Please fill in what and where');
      return;
    }

    const newItem: LostFoundCard = {
      id: `lf-${Date.now()}`,
      title: formWhat,
      description: `Reported at ${formWhere} on ${formWhen}.`,
      category: formCategory,
      type: activeTab, // Post to the currently selected tab
      location: formWhere,
      date: 'Just now',
      reportedBy: user?.name || 'You',
      status: 'open',
    };

    setItems([newItem, ...items]);
    setPostModalOpen(false);
    setFormWhat('');
    setFormWhere('');
    setPhotoName(null);

    toast.success('Notice posted!', {
      description: `Your item was added to the campus ${activeTab === 'lost' ? 'Lost' : 'Found'} directory.`,
    });
  };

  const handleClaimSubmit = () => {
    if (!claimTarget || !proofDetails.trim()) return;

    setItems((prev) =>
      prev.map((i) => (i.id === claimTarget.id ? { ...i, status: 'claimed' as const } : i))
    );

    setClaimModalOpen(false);
    toast.success('Claim submitted!', {
      description: `Finder will verify your description to coordinate handover.`,
    });
  };

  // Check for smart possible matches between Lost and Found
  const possibleMatches = items.filter((i) => {
    const oppositeType = activeTab === 'lost' ? 'found' : 'lost';
    return i.type === oppositeType && i.status === 'open';
  });

  const filteredItems = items.filter((i) => {
    if (i.type !== activeTab) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with One Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lost &amp; Found
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Report misplaced belongings or claim items found on the SJBIT campus.
          </p>
        </div>

        <Button
          variant="lime"
          size="lg"
          onClick={() => setPostModalOpen(true)}
          className="shadow-[0_0_20px_rgba(131,243,77,0.35)] shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Report an item
        </Button>
      </div>

      {/* 2. Two Clear Tabs: Lost Items & Found Items */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-ring/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('lost')}
            className={`px-5 py-2.5 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'lost'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Lost Items ({items.filter((i) => i.type === 'lost').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('found')}
            className={`px-5 py-2.5 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'found'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Found Items ({items.filter((i) => i.type === 'found').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items or places..."
            className="w-full bg-white/[0.07] border border-white/15 text-white text-xs rounded-pill pl-9 pr-3 py-2 outline-none focus:border-lime"
          />
        </div>
      </div>

      {/* 3. "Possible Matches" Alert Box */}
      {possibleMatches.length > 0 && (
        <div className="p-4 rounded-2xl bg-card border border-lime/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-lime">
            <Sparkles className="w-4 h-4" />
            <span>Possible Match Suggestions ({possibleMatches.length} items on campus)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {possibleMatches.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-row border border-ring/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{m.title}</p>
                  <p className="text-[11px] text-white/50">{m.location}</p>
                </div>
                <Badge variant={m.type === 'found' ? 'approved' : 'pending'}>
                  {m.type === 'found' ? 'Found' : 'Lost'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Simple Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
            <Search className="w-8 h-8 text-white/30 mx-auto" />
            <p className="text-sm font-semibold text-white">No items found</p>
            <p className="text-xs text-white/50">
              No reports in this tab right now. You can report an item above.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant={item.type === 'found' ? 'approved' : 'pending'}>
                    {item.type === 'found' ? 'Found' : 'Lost'}
                  </Badge>
                  <span className="text-[11px] text-white/40">{item.date}</span>
                </div>

                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-white/50 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-lime shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-ring/60 flex items-center justify-between">
                <span className="text-[11px] text-white/40">By {item.reportedBy}</span>
                {item.status === 'open' && item.type === 'found' && (
                  <Button
                    variant="lime"
                    size="sm"
                    onClick={() => {
                      setClaimTarget(item);
                      setProofDetails('');
                      setClaimModalOpen(true);
                    }}
                    className="min-h-[38px]"
                  >
                    This is mine
                  </Button>
                )}
                {item.status === 'claimed' && (
                  <Badge variant="info">Claimed</Badge>
                )}
                {item.status === 'resolved' && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Handed back
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Simple 4-Field "Report an Item" Form Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title={activeTab === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
        description="Share basic details so the owner or finder can connect."
        size="md"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input
            label="1. What is the item?"
            placeholder="e.g. Casio Scientific Calculator, Blue Water Bottle, Keys"
            value={formWhat}
            onChange={(e) => setFormWhat(e.target.value)}
            required
          />

          <Input
            label="2. Where was it lost or found?"
            placeholder="e.g. BGS Auditorium row 5, Central Library, Canteen"
            value={formWhere}
            onChange={(e) => setFormWhere(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="3. When?"
              type="date"
              value={formWhen}
              onChange={(e) => setFormWhen(e.target.value)}
              required
            />
            <Select
              label="Category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              options={[
                { value: 'Electronics', label: 'Electronics & Calculators' },
                { value: 'Bottles', label: 'Bottles & Lunchboxes' },
                { value: 'Cards & Keys', label: 'ID Cards, Wallets & Keys' },
                { value: 'Audio', label: 'Headphones & Earbuds' },
                { value: 'Books', label: 'Books, Bags & Stationary' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              4. Photo (optional)
            </label>
            <div className="border border-dashed border-ring/80 rounded-xl p-4 text-center hover:border-lime/40 transition-colors cursor-pointer bg-white/[0.02]">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="lf-photo"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPhotoName(e.target.files[0].name);
                  }
                }}
              />
              <label htmlFor="lf-photo" className="cursor-pointer block space-y-1">
                <Camera className="w-5 h-5 text-white/40 mx-auto" />
                <p className="text-xs text-white/70">
                  {photoName ? (
                    <span className="text-lime font-medium">{photoName}</span>
                  ) : (
                    'Click to upload photo'
                  )}
                </p>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-ring/60">
            <Button type="button" variant="ghost" onClick={() => setPostModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Publish notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Simple Claim Modal */}
      {claimModalOpen && claimTarget && (
        <Modal
          isOpen={true}
          onClose={() => setClaimModalOpen(false)}
          title="Claim this item"
          description={`Verify ownership for '${claimTarget.title}'.`}
          size="sm"
        >
          <div className="space-y-4">
            <Textarea
              label="Describe distinctive marks (stickers, scratches, color)"
              placeholder="e.g. Has my name written on the bottom, or yellow cat sticker on back..."
              rows={3}
              value={proofDetails}
              onChange={(e) => setProofDetails(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-ring/60">
              <Button variant="ghost" onClick={() => setClaimModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="lime" onClick={handleClaimSubmit}>
                Submit claim
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
