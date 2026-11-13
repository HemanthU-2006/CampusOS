import React, { useState } from 'react';
import { Users, Plus, Sparkles, MessageSquare, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PillCard } from '@/components/ui/PillCard';
import { toast } from 'sonner';

interface ClubItem {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
}

interface PostItem {
  id: string;
  clubName: string;
  authorName: string;
  title: string;
  content: string;
  date: string;
}

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const isClubHeadOrAdmin = user?.role === 'club_head' || user?.role === 'admin';

  const [clubs, setClubs] = useState<ClubItem[]>([
    {
      id: 'c-1',
      name: 'Robotics & AI Guild',
      code: 'ROBO-AI',
      category: 'Technical',
      description: 'Building autonomous rovers, drones, and computer vision systems.',
      memberCount: 48,
      isJoined: true,
    },
    {
      id: 'c-2',
      name: 'Design & Web Society',
      code: 'DWS',
      category: 'Creative & UI',
      description: 'Cultivating digital product design, modern web standards, and UI/UX crafts.',
      memberCount: 36,
      isJoined: false,
    },
    {
      id: 'c-3',
      name: 'E-Cell Entrepreneurship Hub',
      code: 'ECELL',
      category: 'Startups & Business',
      description: 'Incubating student-led startups with mentorship, pitch workshops, and seed funding.',
      memberCount: 52,
      isJoined: false,
    },
  ]);

  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: 'p-1',
      clubName: 'Robotics & AI Guild',
      authorName: 'Rohan Sharma (Club Head)',
      title: 'Call for Hardware Sub-team: Autonomous Rover Challenge',
      content:
        'We are scouting team members interested in ESP32, ROS2, and LiDAR navigation. Weekly workshops start this Thursday at the Innovation Lab.',
      date: '2 hours ago',
    },
    {
      id: 'p-2',
      clubName: 'Design & Web Society',
      authorName: 'Aanya Sen',
      title: 'Obsidian Interface Teardown & Figma Session',
      content:
        'Join us this Friday for a live teardown of glassmorphic dark design tokens and accessible micro-interactions.',
      date: 'Yesterday',
    },
  ]);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('c-1');

  const toggleJoin = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const nextState = !c.isJoined;
          if (nextState) {
            toast.success(`Joined ${c.name}! (+25 Activity Points)`, {
              description: 'You are now receiving club announcements and event alerts.',
            });
          } else {
            toast.info(`Left ${c.name}`);
          }
          return {
            ...c,
            isJoined: nextState,
            memberCount: nextState ? c.memberCount + 1 : Math.max(0, c.memberCount - 1),
          };
        }
        return c;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const club = clubs.find((c) => c.id === selectedClubId);

    const newPost: PostItem = {
      id: `p-${Date.now()}`,
      clubName: club?.name || 'Campus Club',
      authorName: user?.name || 'Club Head',
      title: postTitle,
      content: postContent,
      date: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
    toast.success('Announcement Published!', {
      description: `Notification dispatched to all members of ${club?.name}.`,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Clubs &amp; Societies
            </h1>
            <Badge variant="lime">+25 Pts per Guild</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Join student communities, receive announcements, and earn verified activity credentials.
          </p>
        </div>

        {isClubHeadOrAdmin && (
          <Button variant="lime" onClick={() => setIsPostModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Post Announcement
          </Button>
        )}
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="p-6 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-all flex flex-col justify-between space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-row border border-ring text-white/60">
                  {club.code}
                </span>
                <Badge variant={club.isJoined ? 'lime' : 'neutral'}>
                  {club.isJoined ? 'Member' : club.category}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-white">{club.name}</h3>
              <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                {club.description}
              </p>
            </div>

            <div className="pt-3 border-t border-ring/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-white/50">
                <Users className="w-3.5 h-3.5 text-lime" />
                <span>{club.memberCount} Members</span>
              </div>
              <Button
                variant={club.isJoined ? 'outline' : 'lime'}
                size="sm"
                onClick={() => toggleJoin(club.id)}
              >
                {club.isJoined ? 'Leave' : 'Join Guild'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Announcements Feed */}
      <section className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-lime" />
          <span>Club Broadcasts &amp; Announcements</span>
        </h2>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl bg-card border border-ring/80 space-y-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-lime">{post.clubName}</span>
                <span className="text-white/40">{post.date}</span>
              </div>
              <h3 className="text-base font-bold text-white">{post.title}</h3>
              <p className="text-xs text-white/75 leading-relaxed">{post.content}</p>
              <div className="pt-2 text-[11px] text-white/40">
                Posted by <span className="text-white/60">{post.authorName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Post Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Broadcast Club Announcement"
        description="Notify all guild members of meetings, hardware workshops, and deadlines."
        size="md"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input
            label="Announcement Title"
            placeholder="e.g. Sub-team meeting schedule"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />

          <Textarea
            label="Content"
            placeholder="Write full message details, room coordinates, prerequisites..."
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-ring/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPostModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Publish Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
