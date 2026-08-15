import React from 'react';
import { X, Shield, FileText, Mail, Map, CheckCircle } from 'lucide-react';

export type ModalType = 'privacy' | 'terms' | 'support' | 'sitemap' | null;

interface LegalModalProps {
  modalType: ModalType;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  modalType,
  onClose,
  onNavigateToTab,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (modalType) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalType, onClose]);

  if (!modalType) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {modalType === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center">
                <Shield className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-slate-900">Privacy Policy</h3>
                <p className="text-xs text-slate-500">100% Client-Side & Private</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>Zero Data Tracking:</strong> All CGPA, SGPA, grades, and percentage calculations are processed entirely within your browser locally.
              </p>
              <p>
                No academic records, marks, or personal identifiers are collected, transmitted to remote servers, or stored in external tracking databases.
              </p>
              <p>
                We do not use tracking cookies or sell user information to third-party ad brokers.
              </p>
            </div>
          </div>
        )}

        {modalType === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center">
                <FileText className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-slate-900">Terms of Service</h3>
                <p className="text-xs text-slate-500">Academic Disclaimer</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                This calculation utility is provided for educational and academic estimation purposes based on published circulars from CBSE, AICTE, UGC, and recognized state universities.
              </p>
              <p>
                While calculations adhere strictly to official multiplying factors (e.g. CBSE 9.5, VTU -0.75×10, GTU -0.5×10), students are advised to confirm the specific conversion guidelines listed on their official university grade cards and transcripts for statutory applications.
              </p>
            </div>
          </div>
        )}

        {modalType === 'support' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-slate-900">Contact & Support</h3>
                <p className="text-xs text-slate-500">Need help or want to request a formula?</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                If your university or autonomous college uses a unique conversion formula that you would like added to the directory, please feel free to reach out.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Support Email</span>
                <p className="font-mono font-medium text-slate-800">support@cgpacalculator.in</p>
              </div>
              <p className="text-xs text-slate-500">
                Average response time: within 24 hours.
              </p>
            </div>
          </div>
        )}

        {modalType === 'sitemap' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center">
                <Map className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-slate-900">Sitemap</h3>
                <p className="text-xs text-slate-500">Directory of Calculator Tools</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  onNavigateToTab?.('cgpa-to-pct');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-[#434CE8] font-medium text-slate-700 transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
              >
                <span>1. CGPA to Percentage Calculator (Standard 9.5 & University)</span>
                <CheckCircle className="w-4 h-4 text-[#434CE8]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToTab?.('pct-to-cgpa');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-[#434CE8] font-medium text-slate-700 transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
              >
                <span>2. Percentage to CGPA Reverse Converter</span>
                <CheckCircle className="w-4 h-4 text-[#434CE8]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToTab?.('sgpa-calc');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-[#434CE8] font-medium text-slate-700 transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
              >
                <span>3. SGPA & Cumulative Multi-Semester CGPA Calculator</span>
                <CheckCircle className="w-4 h-4 text-[#434CE8]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToTab?.('about');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-[#434CE8] font-medium text-slate-700 transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
              >
                <span>4. University Formula Directory & FAQs</span>
                <CheckCircle className="w-4 h-4 text-[#434CE8]" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#434CE8] hover:bg-[#373ecc] rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
