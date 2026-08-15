import React, { useState } from 'react';
import { Search, HelpCircle, ChevronRight, School, Award } from 'lucide-react';
import { UNIVERSITIES } from '../data/universities';

export const AboutUniversities: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const filteredUniversities = UNIVERSITIES.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqs = [
    {
      q: 'Why is the standard multiplier 9.5 in India?',
      a: 'The Central Board of Secondary Education (CBSE) calculated that the average marks scored by the top candidate scoring Grade 10 (CGPA 10) was approximately 95%. Dividing 95 by 10 gives 9.5. Hence, CBSE established 9.5 as the national standard multiplier to approximate equivalent percentage from CGPA.'
    },
    {
      q: 'Do all universities use the 9.5 multiplier?',
      a: 'No. While CBSE, Delhi University, and many AICTE affiliated institutions use 9.5, universities such as VTU use (CGPA - 0.75) × 10, GTU uses (CGPA - 0.5) × 10, and Anna University/IPU use CGPA × 10. Always consult your university’s official transcript rules.'
    },
    {
      q: 'What is the difference between SGPA and CGPA?',
      a: 'SGPA (Semester Grade Point Average) measures academic performance in a single semester weighted by subject credit units. CGPA (Cumulative Grade Point Average) is the credit-weighted cumulative average of all completed semesters across the entire degree program.'
    },
    {
      q: 'How do I convert Indian 10-point CGPA for US universities (WES)?',
      a: 'World Education Services (WES) and US graduate schools evaluate Indian transcripts on a 4.0 GPA scale. Generally, a CGPA ≥ 8.0/10 corresponds to approximately 3.7 - 4.0 GPA (Grade A), 7.0 - 7.9 corresponds to 3.0 - 3.6 GPA (Grade B+), and 6.0 - 6.9 corresponds to 2.5 - 2.9 GPA.'
    },
    {
      q: 'Can I use this calculated percentage on my resume and job applications?',
      a: 'Yes. Most corporate hiring portals (TCS, Infosys, Wipro, Accenture) and higher studies portals (GATE, CAT, UPSC) accept percentage derived using the official formula stated on your college grade card or the CBSE 9.5 standard.'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <section className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#434CE8] text-xs font-semibold tracking-wide shadow-xs">
          <span>Academic Knowledge Base • Official Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About CGPA & University Conversion Formulas
        </h1>
        <p className="max-w-2xl mx-auto text-base text-slate-600">
          Learn how CGPA is calculated, explore official conversion formulas from accredited boards and universities across India.
        </p>
      </section>

      {/* University Directory Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-[#434CE8]" />
              <span>University Formula Directory</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified formulas from official examination circulars
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search university or state..."
              aria-label="Search university formulas by name or state"
              className="w-full min-h-[42px] pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-[#434CE8] focus-visible:ring-2 focus-visible:ring-[#434CE8]"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full min-w-[540px] text-left text-sm border-collapse" aria-label="University Formulas Directory Table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th scope="col" className="py-3 px-3">University / Board</th>
                <th scope="col" className="py-3 px-3">Region / State</th>
                <th scope="col" className="py-3 px-3">Official Formula</th>
                <th scope="col" className="py-3 px-3">Notes & Applicability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUniversities.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {u.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-xs">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {u.state}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#434CE8] text-xs sm:text-sm">
                    {u.formulaDisplay}
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-500 max-w-xs">
                    {u.note}
                  </td>
                </tr>
              ))}
              {filteredUniversities.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No university found matching "{searchQuery}". You can use the <strong>Custom Formula</strong> mode in the calculator.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Grading Scale Classification Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#434CE8]" aria-hidden="true" />
          <span>UGC CBCS Grade Points & Class Classifications</span>
        </h2>
        <p className="text-xs text-slate-500">
          Standard 10-point letter grading system recommended by University Grants Commission (UGC)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase">Distinction (O / A+)</span>
            <div className="text-xl font-extrabold text-emerald-900">75% - 100%</div>
            <p className="text-xs text-emerald-700">CGPA 7.9 – 10.0 • Outstanding</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="text-xs font-bold text-blue-800 uppercase">First Class (Grade A)</span>
            <div className="text-xl font-extrabold text-blue-900">60% - 74.9%</div>
            <p className="text-xs text-blue-700">CGPA 6.32 – 7.89 • Very Good</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase">Second Class (Grade B+)</span>
            <div className="text-xl font-extrabold text-amber-900">50% - 59.9%</div>
            <p className="text-xs text-amber-700">CGPA 5.26 – 6.31 • Good</p>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-1">
            <span className="text-xs font-bold text-orange-800 uppercase">Pass Class (Grade B / C)</span>
            <div className="text-xl font-extrabold text-orange-900">40% - 49.9%</div>
            <p className="text-xs text-orange-700">CGPA 4.21 – 5.25 • Pass</p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#434CE8]" aria-hidden="true" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                id={`faq-btn-${idx}`}
                type="button"
                aria-expanded={activeFaq === idx}
                aria-controls={`faq-panel-${idx}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-900 text-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                    activeFaq === idx ? 'rotate-90 text-[#434CE8]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {activeFaq === idx && (
                <div
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  className="p-4 text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed"
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
