import React, { useState } from 'react';
import { Calculator, Menu, X } from 'lucide-react';
import { NavTab } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onGetStartedClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onGetStartedClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'cgpa-to-pct', label: 'CGPA to %' },
    { id: 'pct-to-cgpa', label: '% to CGPA' },
    { id: 'sgpa-calc', label: 'SGPA Calc' },
    { id: 'about', label: 'About' },
  ];

  const handleTabClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div
            id="brand-logo"
            role="button"
            tabIndex={0}
            onClick={() => handleTabClick('cgpa-to-pct')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick('cgpa-to-pct');
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group rounded-lg focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
            aria-label="CGPA Calculator Home"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#434CE8] group-hover:bg-[#434CE8] group-hover:text-white transition-all shadow-xs">
              <Calculator className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-[#434CE8] transition-colors">
              CGPA Calculator
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors rounded-md focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none cursor-pointer ${
                    isActive
                      ? 'text-[#434CE8] font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#434CE8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="get-started-nav-btn"
              type="button"
              onClick={onGetStartedClick}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#434CE8] hover:bg-[#373ecc] active:bg-[#2f35b5] rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" aria-label="Mobile Navigation" className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1.5 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-link-${item.id}`}
              type="button"
              onClick={() => handleTabClick(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`w-full text-left px-3.5 py-3 min-h-[44px] rounded-lg text-base font-medium transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none cursor-pointer ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-[#434CE8] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && (
                <span className="w-2 h-2 rounded-full bg-[#434CE8]"></span>
              )}
            </button>
          ))}
          <div className="pt-2">
            <button
              id="mobile-get-started-btn"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStartedClick();
              }}
              className="w-full text-center py-3 min-h-[44px] text-sm font-semibold text-white bg-[#434CE8] hover:bg-[#373ecc] rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
