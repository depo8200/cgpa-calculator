/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { CgpaToPercentage } from './components/CgpaToPercentage';
import { Footer } from './components/Footer';
import { ModalType } from './components/LegalModals';
import { NavTab } from './types';

// Code-split secondary views and modal to keep initial landing payload ultralight
const PercentageToCgpa = lazy(() =>
  import('./components/PercentageToCgpa').then((m) => ({ default: m.PercentageToCgpa }))
);
const SgpaCalculator = lazy(() =>
  import('./components/SgpaCalculator').then((m) => ({ default: m.SgpaCalculator }))
);
const AboutUniversities = lazy(() =>
  import('./components/AboutUniversities').then((m) => ({ default: m.AboutUniversities }))
);
const LegalModal = lazy(() =>
  import('./components/LegalModals').then((m) => ({ default: m.LegalModal }))
);

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('cgpa-to-pct');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const cgpaInputRef = useRef<HTMLInputElement | null>(null);

  // Update page title dynamically according to active calculator view
  useEffect(() => {
    switch (activeTab) {
      case 'cgpa-to-pct':
        document.title = 'CGPA to Percentage Calculator — Convert CGPA to Percentage';
        break;
      case 'pct-to-cgpa':
        document.title = 'Percentage to CGPA Calculator — Convert Percentage to CGPA';
        break;
      case 'sgpa-calc':
        document.title = 'SGPA & CGPA Calculator — Semester Grade Point Average';
        break;
      case 'about':
        document.title = 'About CGPA & University Conversion Formulas';
        break;
    }
  }, [activeTab]);

  const handleGetStarted = () => {
    setActiveTab('cgpa-to-pct');
    setTimeout(() => {
      if (cgpaInputRef.current) {
        cgpaInputRef.current.focus();
        cgpaInputRef.current.select();
      }
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top sticky navigation bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGetStartedClick={handleGetStarted}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-sm">Loading...</div>}>
          <AnimatePresence mode="wait">
            {activeTab === 'cgpa-to-pct' && (
              <motion.div
                key="cgpa-to-pct"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <CgpaToPercentage inputRef={cgpaInputRef} onNavigateTab={setActiveTab} />
              </motion.div>
            )}

            {activeTab === 'pct-to-cgpa' && (
              <motion.div
                key="pct-to-cgpa"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <PercentageToCgpa onNavigateTab={setActiveTab} />
              </motion.div>
            )}

            {activeTab === 'sgpa-calc' && (
              <motion.div
                key="sgpa-calc"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <SgpaCalculator onNavigateTab={setActiveTab} />
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <AboutUniversities />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer onOpenModal={setActiveModal} onNavigateTab={setActiveTab} />

      {/* Legal & Directory Modals */}
      <Suspense fallback={null}>
        <LegalModal
          modalType={activeModal}
          onClose={() => setActiveModal(null)}
          onNavigateToTab={(tab) => {
            setActiveTab(tab);
            setActiveModal(null);
          }}
        />
      </Suspense>
    </div>
  );
}
