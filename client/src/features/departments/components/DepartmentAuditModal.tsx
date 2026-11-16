import React from 'react';
import { DepartmentBranch } from '../data/branchesData';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Scale,
  Award,
  BookOpen,
  Users,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DepartmentAuditModalProps {
  branch: DepartmentBranch | null;
  onClose: () => void;
}

export const DepartmentAuditModal: React.FC<DepartmentAuditModalProps> = ({ branch, onClose }) => {
  if (!branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#14151a] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
          aria-label="Close audit"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <FileCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                Audit Status: Certified Compliant
              </span>
              <span className="text-[10px] text-white/50 font-mono">VTU-LIC-2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Academic &amp; Infrastructure Audit — {branch.code}
            </h2>
            <p className="text-xs text-white/60">{branch.name}</p>
          </div>
        </div>

        {/* Audit Summary Card */}
        <div className="p-4 rounded-xl bg-[#0e1014] border border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-white/60">Inspecting Authority:</span>
            <span className="text-white font-bold">VTU Local Inquiry Committee (LIC) &amp; IQAC</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-white/60">Head of Department:</span>
            <span className="text-amber-300 font-semibold">{branch.hod}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-white/60">Syllabus &amp; Curriculum Compliance:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% 2022 Scheme Covered
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Faculty-to-Student Ratio (FSR):</span>
            <span className="text-lime font-mono font-bold">1:15 (Exceeds AICTE 1:20 Norms)</span>
          </div>
        </div>

        {/* NAAC & NBA Audit Criteria Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lime" /> NAAC 'A+' &amp; NBA Compliance Metrics
          </h3>

          <div className="space-y-2 text-xs">
            {[
              {
                title: 'Outcome-Based Education (OBE) & Course Outcomes (CO-PO)',
                status: 'Verified',
                note: 'Course articulation matrix verified across all 8 semesters',
              },
              {
                title: 'Laboratory Hardware & Software Maintenance',
                status: 'Certified',
                note: `${branch.labs.length} laboratories fully calibrated with licensed software`,
              },
              {
                title: 'Continuous Internal Evaluation (CIE) Integrity',
                status: 'Compliant',
                note: 'Test blue-books and rubric assessments archived digitally',
              },
              {
                title: 'Student Proctoring & Mentorship Logs',
                status: 'Active',
                note: '1:20 proctor ratio with bi-weekly counsel sessions logged',
              },
              {
                title: 'Industry MoUs & Internship Track',
                status: 'Approved',
                note: 'Active industrial collaborations meeting VTU autonomous criteria',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#181920] border border-white/5 flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-[11px] text-white/50">{item.note}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-white/50">
            Audit certificate logged in SJBIT Autonomous Controller of Examinations (COE) ledger.
          </span>
          <Button variant="lime" size="sm" onClick={onClose} className="font-bold">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
