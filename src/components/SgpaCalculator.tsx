import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  Copy,
  Info,
  Calculator,
  Percent,
  FileText,
  CalendarCheck,
  GraduationCap,
  School,
  ArrowRight,
  Share2
} from 'lucide-react';
import { SubjectGrade, SemesterData, NavTab } from '../types';
import {
  calculateSgpaFromSubjects,
  calculateCgpaFromSemesters,
  copyToClipboard,
  shareCalculatorLink
} from '../utils/calculator';

const GRADE_POINTS_MAP: { [key: string]: number } = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
};

const DEFAULT_SUBJECTS: SubjectGrade[] = [
  { id: '1', name: 'Data Structures & Algorithms', credits: 4, gradePoint: 9, gradeLetter: 'A+' },
  { id: '2', name: 'Database Management Systems', credits: 4, gradePoint: 8, gradeLetter: 'A' },
  { id: '3', name: 'Computer Networks', credits: 3, gradePoint: 10, gradeLetter: 'O' },
  { id: '4', name: 'Software Engineering', credits: 3, gradePoint: 8, gradeLetter: 'A' },
  { id: '5', name: 'DBMS Laboratory', credits: 2, gradePoint: 10, gradeLetter: 'O' },
];

interface SgpaCalculatorProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const SgpaCalculator: React.FC<SgpaCalculatorProps> = ({ onNavigateTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'single-semester' | 'multi-semester'>('single-semester');
  const [subjects, setSubjects] = useState<SubjectGrade[]>(DEFAULT_SUBJECTS);
  
  // Multi-semester state
  const [semesters, setSemesters] = useState<SemesterData[]>([
    { semesterNumber: 1, sgpa: 8.2, credits: 20 },
    { semesterNumber: 2, sgpa: 8.6, credits: 22 },
    { semesterNumber: 3, sgpa: 8.4, credits: 21 },
    { semesterNumber: 4, sgpa: 8.8, credits: 22 },
  ]);

  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Calculate SGPA for current semester using helper
  const { sgpa: calculatedSgpa, totalCredits, totalPoints: totalWeightedPoints } = calculateSgpaFromSubjects(subjects);
  const calculatedPct = Number((calculatedSgpa * 9.5).toFixed(2));

  // Multi-semester cumulative CGPA using helper
  const { overallCgpa: calculatedCumulativeCgpa, totalCredits: totalMultiCredits } = calculateCgpaFromSemesters(semesters);
  const cumulativePct = Number((calculatedCumulativeCgpa * 9.5).toFixed(2));

  const handleAddSubject = () => {
    const newSubject: SubjectGrade = {
      id: Date.now().toString(),
      name: `Course ${subjects.length + 1}`,
      credits: 3,
      gradePoint: 8,
      gradeLetter: 'A',
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleUpdateSubject = (id: string, field: keyof SubjectGrade, val: any) => {
    setSubjects(
      subjects.map((sub) => {
        if (sub.id !== id) return sub;
        if (field === 'gradeLetter') {
          const pt = GRADE_POINTS_MAP[val] ?? 8;
          return { ...sub, gradeLetter: val, gradePoint: pt };
        }
        if (field === 'gradePoint') {
          const numPt = parseFloat(val) || 0;
          return { ...sub, gradePoint: numPt };
        }
        return { ...sub, [field]: val };
      })
    );
  };

  const handleAddSemester = () => {
    const nextNum = semesters.length + 1;
    setSemesters([...semesters, { semesterNumber: nextNum, sgpa: 8.0, credits: 20 }]);
  };

  const handleRemoveSemester = (index: number) => {
    if (semesters.length <= 1) return;
    const updated = semesters.filter((_, i) => i !== index).map((sem, i) => ({
      ...sem,
      semesterNumber: i + 1,
    }));
    setSemesters(updated);
  };

  const handleUpdateSemester = (index: number, field: 'sgpa' | 'credits', val: number) => {
    const updated = [...semesters];
    updated[index] = { ...updated[index], [field]: val };
    setSemesters(updated);
  };

  const handleCopySummary = async () => {
    const summary = activeSubTab === 'single-semester'
      ? `SGPA: ${calculatedSgpa} (Total Credits: ${totalCredits}, Approx Percentage: ${calculatedPct}%)`
      : `Cumulative CGPA: ${calculatedCumulativeCgpa} across ${semesters.length} semesters (${cumulativePct}%)`;
    const success = await copyToClipboard(summary);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareText = activeSubTab === 'single-semester'
      ? `My Semester SGPA is ${calculatedSgpa} (Approx ${calculatedPct}%) calculated on this CGPA & SGPA Tracker:`
      : `My Cumulative CGPA is ${calculatedCumulativeCgpa} across ${semesters.length} semesters (${cumulativePct}%) calculated here:`;

    const status = await shareCalculatorLink({
      title: 'SGPA & CGPA Calculator',
      text: shareText,
      url: window.location.href,
    });

    if (status === 'copied') {
      setShareFeedback('Copied link!');
      setTimeout(() => setShareFeedback(null), 2500);
    } else if (status === 'shared') {
      setShareFeedback('Shared!');
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <section className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#434CE8] text-xs font-semibold tracking-wide shadow-xs">
          <span>Weighted Credit System • UGC CBCS</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          SGPA & CGPA Calculator
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Calculate your Semester Grade Point Average (SGPA) with course credits, or calculate cumulative CGPA across all semesters.
        </p>

        {/* Tab switcher */}
        <div
          role="tablist"
          aria-label="Calculator Mode"
          className="flex flex-col sm:inline-flex sm:flex-row w-full sm:w-auto p-1 bg-slate-100 rounded-xl sm:rounded-lg border border-slate-200 gap-1 max-w-md mx-auto"
        >
          <button
            id="tab-single-semester"
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'single-semester'}
            onClick={() => setActiveSubTab('single-semester')}
            className={`min-h-[42px] px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-md text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              activeSubTab === 'single-semester'
                ? 'bg-white text-[#434CE8] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Single Semester (Subjects)
          </button>
          <button
            id="tab-multi-semester"
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'multi-semester'}
            onClick={() => setActiveSubTab('multi-semester')}
            className={`min-h-[42px] px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-md text-xs sm:text-sm font-medium transition-all flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              activeSubTab === 'multi-semester'
                ? 'bg-white text-[#434CE8] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Semester (Cumulative)
          </button>
        </div>
      </section>

      {/* Mode 1: Single Semester SGPA Calculator */}
      {activeSubTab === 'single-semester' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Semester Course List
                </h2>
                <p className="text-xs text-slate-500">
                  Enter course name, credit weight, and obtained grade
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="add-subject-btn"
                  type="button"
                  onClick={handleAddSubject}
                  aria-label="Add a new subject to semester"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#434CE8] hover:bg-[#373ecc] rounded-lg shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Subject</span>
                </button>
              </div>
            </div>

            {/* Subject Table */}
            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full min-w-[480px] text-left text-sm border-collapse" aria-label="Semester Courses and Grades Table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-3">Subject / Course Name</th>
                    <th scope="col" className="py-3 px-3 w-28 text-center">Credits</th>
                    <th scope="col" className="py-3 px-3 w-36 text-center">Grade Letter</th>
                    <th scope="col" className="py-3 px-3 w-28 text-center">Grade Point</th>
                    <th scope="col" className="py-3 px-3 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sub, index) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleUpdateSubject(sub.id, 'name', e.target.value)}
                          aria-label={`Subject ${index + 1} name`}
                          className="w-full min-h-[38px] px-2.5 py-1.5 text-sm bg-slate-50/80 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#434CE8] focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                          placeholder="e.g. Mathematics"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={sub.credits}
                          onChange={(e) => handleUpdateSubject(sub.id, 'credits', parseFloat(e.target.value) || 0)}
                          aria-label={`Subject ${index + 1} credit weight`}
                          className="w-20 min-h-[38px] mx-auto px-2 py-1.5 text-center text-sm font-semibold bg-slate-50/80 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#434CE8] focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={sub.gradeLetter}
                          onChange={(e) => handleUpdateSubject(sub.id, 'gradeLetter', e.target.value)}
                          aria-label={`Subject ${index + 1} grade letter`}
                          className="w-28 min-h-[38px] mx-auto px-2 py-1.5 text-center text-sm font-semibold bg-slate-50/80 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#434CE8] focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                        >
                          <option value="O">O (10)</option>
                          <option value="A+">A+ (9)</option>
                          <option value="A">A (8)</option>
                          <option value="B+">B+ (7)</option>
                          <option value="B">B (6)</option>
                          <option value="C">C (5)</option>
                          <option value="P">P (4)</option>
                          <option value="F">F (0)</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700" aria-label={`Subject ${index + 1} grade points: ${sub.gradePoint}`}>
                        {sub.gradePoint}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(sub.id)}
                          disabled={subjects.length <= 1}
                          aria-label={`Remove subject ${sub.name || index + 1}`}
                          className="p-2 min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-lg hover:bg-rose-50 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none cursor-pointer"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results summary card */}
            <div
              aria-live="polite"
              className="p-6 bg-gradient-to-br from-indigo-50/70 to-slate-50 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#434CE8]">
                  Calculated Semester Grade Point Average
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#434CE8]">
                    {calculatedSgpa}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    / 10.0 SGPA
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Total Credits: <strong>{totalCredits}</strong> • Total Weighted Grade Points: <strong>{totalWeightedPoints}</strong>
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  Approx Percentage: <strong className="text-slate-900 text-sm">{calculatedPct}%</strong> (CBSE 9.5)
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    aria-label={copied ? 'Copied SGPA summary' : 'Copy SGPA summary'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#434CE8] hover:text-[#373ecc] bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                    <span>{copied ? 'Copied SGPA!' : 'Copy Summary'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={shareFeedback ? shareFeedback : 'Share SGPA with friends'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-[#434CE8] bg-indigo-50/90 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg border border-indigo-200 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                  >
                    {shareFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                        <span className="text-emerald-700 font-semibold">{shareFeedback}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-[#434CE8]" aria-hidden="true" />
                        <span>Share SGPA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Multi-Semester CGPA Calculator */}
      {activeSubTab === 'multi-semester' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Semester-wise SGPA Tracker
                </h2>
                <p className="text-xs text-slate-500">
                  Combine SGPA across semesters weighted by credit totals
                </p>
              </div>

              <button
                id="add-semester-btn"
                type="button"
                onClick={handleAddSemester}
                aria-label="Add another semester to tracker"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#434CE8] hover:bg-[#373ecc] rounded-lg shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Semester</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {semesters.map((sem, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#434CE8]">
                      Semester {sem.semesterNumber}
                    </span>
                    {semesters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSemester(idx)}
                        aria-label={`Remove semester ${sem.semesterNumber}`}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                        title="Remove Semester"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`sem-sgpa-${idx}`} className="block text-xs font-medium text-slate-600 mb-1">
                      SGPA (0 - 10)
                    </label>
                    <input
                      id={`sem-sgpa-${idx}`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={sem.sgpa}
                      onChange={(e) => handleUpdateSemester(idx, 'sgpa', parseFloat(e.target.value) || 0)}
                      aria-label={`Semester ${sem.semesterNumber} SGPA`}
                      className="w-full px-3 py-1.5 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#434CE8] focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                    />
                  </div>

                  <div>
                    <label htmlFor={`sem-credits-${idx}`} className="block text-xs font-medium text-slate-600 mb-1">
                      Total Credits
                    </label>
                    <input
                      id={`sem-credits-${idx}`}
                      type="number"
                      min="1"
                      value={sem.credits}
                      onChange={(e) => handleUpdateSemester(idx, 'credits', parseFloat(e.target.value) || 0)}
                      aria-label={`Semester ${sem.semesterNumber} total credits`}
                      className="w-full px-3 py-1.5 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#434CE8] focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Cumulative Summary */}
            <div
              aria-live="polite"
              className="p-6 bg-[#434CE8] text-white rounded-xl shadow-md flex flex-wrap items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                  Overall Cumulative CGPA ({semesters.length} Semesters)
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {calculatedCumulativeCgpa}
                  </span>
                  <span className="text-sm font-medium text-indigo-200">
                    / 10.0 CGPA
                  </span>
                </div>
                <p className="text-xs text-indigo-200">
                  Total Accumulated Credits: <strong>{totalMultiCredits}</strong>
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="text-xs font-medium text-slate-900 bg-white px-3.5 py-2 rounded-lg shadow-sm">
                  Equivalent Percentage: <strong className="text-[#434CE8] text-sm">{cumulativePct}%</strong>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    aria-label={copied ? 'Copied CGPA summary' : 'Copy CGPA summary'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:bg-white/10 bg-white/20 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                    <span>{copied ? 'Copied CGPA!' : 'Copy Summary'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={shareFeedback ? shareFeedback : 'Share CGPA with friends'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:bg-white/20 bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    {shareFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                        <span className="text-emerald-200 font-semibold">{shareFeedback}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-white" aria-hidden="true" />
                        <span>Share CGPA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More Student Calculators Section */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
            <span>Academic Toolkit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            More Student Calculators
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Essential academic estimation tools designed for engineering, degree, and board students
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {/* Card 1: CGPA to Percentage */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigateTab?.('cgpa-to-pct')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateTab?.('cgpa-to-pct');
              }
            }}
            aria-label="Open CGPA to Percentage Calculator"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center group-hover:bg-[#434CE8] group-hover:text-white transition-colors shadow-2xs">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#434CE8] transition-colors">
                CGPA to Percentage
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Convert your 10.0 scale CGPA to equivalent percentage using CBSE 9.5 multiplier or university statutory formulas.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#434CE8] pt-1">
              <span>Open Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </div>

          {/* Card 2: Percentage to CGPA */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigateTab?.('pct-to-cgpa')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateTab?.('pct-to-cgpa');
              }
            }}
            aria-label="Open Percentage to CGPA Calculator"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center group-hover:bg-[#434CE8] group-hover:text-white transition-colors shadow-2xs">
                <Percent className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#434CE8] transition-colors">
                Percentage to CGPA
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Convert your percentage marks back to equivalent 10-point CGPA with breakdown and letter grade classifications.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#434CE8] pt-1">
              <span>Open Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </div>

          {/* Card 3: Marks Percentage */}
          <div
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs transition-all duration-200 flex flex-col justify-between space-y-4 group opacity-95"
            aria-label="Marks Percentage Calculator - Coming Soon"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center shadow-2xs">
                <FileText className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Marks Percentage
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold tracking-wide uppercase">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculate total scored percentage across multiple subjects, theoretical assessments, and practical exams.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 pt-1">
              <span>In Development</span>
            </div>
          </div>

          {/* Card 4: Attendance Calculator */}
          <div
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs transition-all duration-200 flex flex-col justify-between space-y-4 group opacity-95"
            aria-label="Attendance Calculator - Coming Soon"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center shadow-2xs">
                <CalendarCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Attendance Calculator
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold tracking-wide uppercase">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track required attendance thresholds (75% / 85% rule) and calculate how many classes you can afford to miss or must attend.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 pt-1">
              <span>In Development</span>
            </div>
          </div>

          {/* Card 5: GPA Calculator (4.0 Scale) */}
          <div
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs transition-all duration-200 flex flex-col justify-between space-y-4 group opacity-95"
            aria-label="GPA Calculator (4.0 Scale) - Coming Soon"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center shadow-2xs">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  GPA Calculator (4.0 Scale)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold tracking-wide uppercase">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compute US 4.0 collegiate GPA equivalents for study abroad, MS admissions, and WES transcript evaluations.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 pt-1">
              <span>In Development</span>
            </div>
          </div>

          {/* Card 6: University Directory */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigateTab?.('about')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateTab?.('about');
              }
            }}
            aria-label="Open University Directory"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center group-hover:bg-[#434CE8] group-hover:text-white transition-colors shadow-2xs">
                <School className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#434CE8] transition-colors">
                University Formulas
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore statutory conversion guidelines across 15+ Indian universities and UGC CBCS grading classifications.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#434CE8] pt-1">
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-600 space-y-1">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Disclaimer:</span> This calculator provides an estimated calculation based on standard credit weighting logic. Grading scales and minimum passing grades may vary by institution, board, or autonomous university regulation. Always verify with your official grade card.
          </p>
        </div>
      </section>
    </div>
  );
};
