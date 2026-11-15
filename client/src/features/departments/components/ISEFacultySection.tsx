import React, { useState } from 'react';
import { ISE_FACULTY, FacultyMember } from '../data/iseFaculty';
import { Search, GraduationCap, Users, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const ISEFacultySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'hod-prof' | 'associate' | 'assistant' | 'non-teaching'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = ISE_FACULTY.filter((member) => {
    // Search filter
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'hod-prof') return matchesSearch && (member.tier === 'hod' || member.tier === 'professor');
    if (activeTab === 'associate') return matchesSearch && member.tier === 'associate';
    if (activeTab === 'assistant') return matchesSearch && member.tier === 'assistant';
    if (activeTab === 'non-teaching') return matchesSearch && member.category === 'non-teaching';

    return matchesSearch;
  });

  return (
    <section id="ise-faculty" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12 border-t border-ring/40">
      {/* 1. Department Overview Header */}
      <div className="space-y-4 max-w-4xl mx-auto text-center">
        <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
          Department Spotlight · ISE
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Department of Information Science &amp; Engineering
        </h2>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-3xl mx-auto">
          The Department of Information Science and Engineering stands as a vibrant center of academic excellence, innovation, 
          and holistic student development under the autonomous curriculum framework. With state-of-the-art infrastructure, 
          experienced faculty, and an industry-oriented curriculum, the department nurtures future-ready professionals equipped 
          with multidisciplinary skills and strong graduate attributes.
        </p>
      </div>

      {/* 2. Vision & Mission Cards (From Official Portal) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        <div className="p-6 rounded-2xl bg-[#141519] border border-white/10 space-y-2.5 shadow-md hover:border-lime/30 transition-all duration-300">
          <div className="flex items-center gap-2 text-lime font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Our Vision</span>
          </div>
          <p className="text-xs text-white/75 leading-relaxed">
            We envision our department as a catalyst for developing educated, engaged and employable individuals 
            whose collective energy will be the driving force for prosperity and the quality of life in our diverse world.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#141519] border border-white/10 space-y-2.5 shadow-md hover:border-amber-400/30 transition-all duration-300">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Our Mission</span>
          </div>
          <p className="text-xs text-white/75 leading-relaxed">
            Our mission is to provide quality technical education in the field of information technology and to strive 
            for excellence in education by developing and sharpening the intellectual and human potential for good industry and community.
          </p>
        </div>
      </div>

      {/* 3. Faculty & Staff Directory Controls */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-ring/40">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-lime" />
              Faculty &amp; Staff Members
            </h3>
            <p className="text-xs text-white/60">
              Official faculty roster of the ISE Department with authenticated designations and credentials.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by faculty name or role..."
              className="w-full bg-[#121316] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Members', count: 41 },
            { id: 'hod-prof', label: 'HOD & Professors', count: 4 },
            { id: 'associate', label: 'Associate Professors', count: 2 },
            { id: 'assistant', label: 'Assistant Professors', count: 22 },
            { id: 'non-teaching', label: 'Technical & Staff', count: 13 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-lime text-lime-ink shadow-sm font-bold'
                  : 'bg-[#15161A] text-white/70 hover:text-white hover:bg-[#1D1E24] border border-white/10'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-black/20 text-lime-ink' : 'bg-white/10 text-white/60'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Faculty Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMembers.map((member) => {
            const isHOD = member.tier === 'hod';
            const isProfessor = member.tier === 'professor';

            return (
              <div
                key={member.id}
                className={`group rounded-2xl p-4 transition-all duration-300 flex items-center gap-3.5 shadow-sm hover:shadow-lg hover:-translate-y-1 ${
                  isHOD
                    ? 'bg-[#18191E] border-2 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                    : isProfessor
                    ? 'bg-[#16171C] border border-lime/30 hover:border-lime/60'
                    : 'bg-[#141519] border border-white/10 hover:border-white/25'
                }`}
              >
                {/* Faculty Portrait */}
                <div className="relative shrink-0">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className={`w-16 h-18 sm:w-18 sm:h-20 object-cover rounded-xl bg-slate-900 border transition-transform duration-300 group-hover:scale-105 ${
                      isHOD
                        ? 'border-amber-400 shadow-md'
                        : isProfessor
                        ? 'border-lime/50 shadow-sm'
                        : 'border-white/15'
                    }`}
                    loading="lazy"
                  />
                  {isHOD && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                      HOD
                    </span>
                  )}
                </div>

                {/* Faculty Info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-bold tracking-wider uppercase truncate block ${
                        isHOD
                          ? 'text-amber-400'
                          : isProfessor
                          ? 'text-lime'
                          : member.category === 'non-teaching'
                          ? 'text-sky-400'
                          : 'text-white/60'
                      }`}
                    >
                      {member.designation}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug group-hover:text-lime transition-colors">
                    {member.name}
                  </h4>

                  <p className="text-[10px] text-white/50 truncate">
                    {member.category === 'teaching' ? 'Dept of ISE · Teaching' : 'Technical Support Staff'}
                  </p>

                  <div className="pt-1 flex items-center gap-1 text-[10px] font-medium text-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Active Member</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-[#141519] border border-white/10 space-y-2">
            <p className="text-sm text-white/60">No faculty members found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="text-xs text-lime underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
