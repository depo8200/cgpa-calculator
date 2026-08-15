import React from 'react';
import { ModalType } from './LegalModals';
import { NavTab } from '../types';
import { Calculator, Percent, Layers, School, FileText, CalendarCheck, GraduationCap } from 'lucide-react';

interface FooterProps {
  onOpenModal: (type: ModalType) => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal, onNavigateTab }) => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-slate-50/70 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#434CE8] flex items-center justify-center text-white shadow-xs">
                <Calculator className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-base">
                CGPA Calculator
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard-compliant CGPA, SGPA, and percentage conversion platform for CBSE, AICTE, and Indian universities.
            </p>
          </div>

          {/* Academic Calculators Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Academic Calculators
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('cgpa-to-pct')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded text-left flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-slate-400" />
                  <span>CGPA to Percentage</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('pct-to-cgpa')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded text-left flex items-center gap-1.5"
                >
                  <Percent className="w-3.5 h-3.5 text-slate-400" />
                  <span>Percentage to CGPA</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('sgpa-calc')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded text-left flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>SGPA & CGPA Tracker</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('about')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded text-left flex items-center gap-1.5"
                >
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  <span>University Directory</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Planned Tools (Roadmap) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Toolkit Roadmap
            </h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Marks Percentage</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 font-medium">Soon</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Attendance Calculator</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 font-medium">Soon</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>GPA Calculator (4.0)</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 font-medium">Soon</span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Trust & Legal
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  id="footer-privacy-btn"
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded px-0.5"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-terms-btn"
                  type="button"
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded px-0.5"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  id="footer-support-btn"
                  type="button"
                  onClick={() => onOpenModal('support')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded px-0.5"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  id="footer-sitemap-btn"
                  type="button"
                  onClick={() => onOpenModal('sitemap')}
                  className="hover:text-[#434CE8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none rounded px-0.5"
                >
                  Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="font-medium text-slate-700 text-center sm:text-left">
            © 2026 CGPA Calculator. Academic Precision Guaranteed.
          </div>
          <div className="text-slate-400 text-center sm:text-right text-[11px]">
            Compliant with CBSE, AICTE, and UGC CBCS Grading Guidelines.
          </div>
        </div>
      </div>
    </footer>
  );
};
