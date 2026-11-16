import React from 'react';
import { Link } from 'react-router-dom';
import { DepartmentBranch } from '../data/branchesData';
import {
  X,
  Building2,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  FlaskConical,
  Mail,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface BranchDetailsModalProps {
  branch: DepartmentBranch | null;
  onClose: () => void;
}

export const BranchDetailsModal: React.FC<BranchDetailsModalProps> = ({ branch, onClose }) => {
  if (!branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#14151a] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
          aria-label="Close branch details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime font-mono font-extrabold text-base shrink-0 shadow-inner">
            {branch.code}
          </div>
          <div className="space-y-1 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-amber-400/15 border border-amber-400/30 text-amber-300">
                {branch.scheme}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {branch.accreditation}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {branch.name}
            </h2>
          </div>
        </div>

        {/* Overview Description */}
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed bg-[#0d0e12] p-4 rounded-xl border border-white/5">
          {branch.description}
        </p>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#181920] border border-white/10 text-center">
            <span className="text-[10px] text-white/50 uppercase block font-medium">Annual Intake</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{branch.intake} Seats</span>
          </div>
          <div className="p-3 rounded-xl bg-[#181920] border border-white/10 text-center">
            <span className="text-[10px] text-white/50 uppercase block font-medium">Established</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">{branch.established}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#181920] border border-white/10 text-center">
            <span className="text-[10px] text-white/50 uppercase block font-medium">Faculty Strength</span>
            <span className="text-lg font-bold text-lime mt-0.5 block">{branch.facultyCount}+ Members</span>
          </div>
          <div className="p-3 rounded-xl bg-[#181920] border border-white/10 text-center">
            <span className="text-[10px] text-white/50 uppercase block font-medium">Dedicated Labs</span>
            <span className="text-lg font-bold text-sky-400 mt-0.5 block">{branch.labs.length} Labs</span>
          </div>
        </div>

        {/* Department Leadership & Location */}
        <div className="p-4 rounded-xl bg-[#181920] border border-white/10 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Head of Department (HOD):</strong> {branch.hod} ({branch.qualification})
            </span>
          </div>
          {branch.hodEmail && (
            <div className="flex items-center gap-2 text-white/80">
              <Mail className="w-4 h-4 text-lime shrink-0" />
              <span>
                <strong>Official Contact:</strong>{' '}
                <a href={`mailto:${branch.hodEmail}`} className="text-lime hover:underline">
                  {branch.hodEmail}
                </a>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-white/80">
            <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Department Location:</strong> {branch.block}, SJBIT Campus
            </span>
          </div>
        </div>

        {/* Department Laboratories */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-lime" /> Specialized Laboratories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {branch.labs.map((lab, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-[#0e1014] border border-white/10 text-white/80 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
                <span className="truncate">{lab}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations & Tracks */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" /> Focus Specializations &amp; Electives
          </h3>
          <div className="flex flex-wrap gap-2">
            {branch.specializations.map((spec, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          {branch.hasFacultyPage && branch.facultyRoute ? (
            <Link to={branch.facultyRoute} onClick={onClose}>
              <Button variant="lime" size="sm" className="font-bold">
                View All {branch.facultyCount} Faculty &amp; Staff <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          ) : (
            <span className="text-[11px] text-white/50">
              Department Faculty Roster maintained under SJBIT Academic Board
            </span>
          )}

          <Button variant="outline" size="sm" onClick={onClose} className="border-white/20">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
