import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Tag,
  Copy,
  Check,
  Award,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  Info,
  Percent,
  Calculator,
  FileText,
  CalendarCheck,
  GraduationCap,
  Layers,
  School
} from 'lucide-react';
import { UNIVERSITIES, getGradeClassification } from '../data/universities';
import { ConversionMethod, UniversityFormula, NavTab } from '../types';
import { copyToClipboard } from '../utils/calculator';

interface PercentageToCgpaProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const PercentageToCgpa: React.FC<PercentageToCgpaProps> = ({ onNavigateTab }) => {
  const [pctInput, setPctInput] = useState<string>('79.8');
  const [conversionMethod, setConversionMethod] = useState<ConversionMethod>('standard');
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('cbse');
  const [customMultiplier, setCustomMultiplier] = useState<string>('9.5');
  const [customOffset, setCustomOffset] = useState<string>('0');
  
  const [calculatedCgpa, setCalculatedCgpa] = useState<number | null>(8.4);
  const [calculationBreakdown, setCalculationBreakdown] = useState<string>('79.8% ÷ 9.5 = 8.40 CGPA');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUniversity = UNIVERSITIES.find((u) => u.id === selectedUniversityId) || UNIVERSITIES[0];

  const performCalculation = (inputVal: string, method: ConversionMethod, univ: UniversityFormula) => {
    const num = parseFloat(inputVal.trim());
    if (isNaN(num)) {
      setCalculatedCgpa(null);
      setCalculationBreakdown('');
      setErrorMessage(inputVal.trim() === '' ? null : 'Please enter a valid percentage number.');
      return;
    }

    if (num < 0 || num > 100) {
      setCalculatedCgpa(null);
      setErrorMessage('Percentage must be between 0.0% and 100.0%');
      return;
    }

    setErrorMessage(null);
    let result = 0;
    let breakdown = '';

    if (method === 'standard') {
      result = num / 9.5;
      breakdown = `${num}% ÷ 9.5 = ${result.toFixed(2)} CGPA`;
    } else if (method === 'university') {
      result = univ.reverseCalculate(num);
      if (univ.multiplier) {
        breakdown = `${num}% ÷ ${univ.multiplier} = ${result.toFixed(2)} CGPA`;
      } else if (univ.id === 'vtu' || univ.id === 'makaut') {
        breakdown = `(${num}% ÷ 10) + 0.75 = ${result.toFixed(2)} CGPA`;
      } else if (univ.id === 'gtu' || univ.id === 'jntu') {
        breakdown = `(${num}% ÷ 10) + 0.5 = ${result.toFixed(2)} CGPA`;
      } else if (univ.id === 'ktu') {
        breakdown = `(${num}% + 2.5) ÷ 10 = ${result.toFixed(2)} CGPA`;
      } else {
        breakdown = `${univ.shortName} reverse: ${result.toFixed(2)} CGPA`;
      }
    } else if (method === 'custom') {
      const mult = parseFloat(customMultiplier) || 9.5;
      const offset = parseFloat(customOffset) || 0;
      result = (num / mult) + offset;
      breakdown = offset > 0
        ? `(${num}% ÷ ${mult}) + ${offset} = ${result.toFixed(2)} CGPA`
        : `${num}% ÷ ${mult} = ${result.toFixed(2)} CGPA`;
    }

    const clamped = Math.max(0, Math.min(10, result));
    setCalculatedCgpa(Number(clamped.toFixed(2)));
    setCalculationBreakdown(breakdown);
  };

  useEffect(() => {
    performCalculation(pctInput, conversionMethod, currentUniversity);
  }, [pctInput, conversionMethod, selectedUniversityId, customMultiplier, customOffset]);

  const handleCalculateClick = () => {
    if (!pctInput.trim()) {
      setErrorMessage('Please enter your percentage between 0.0% and 100.0%');
      inputRef.current?.focus();
      return;
    }
    performCalculation(pctInput, conversionMethod, currentUniversity);
  };

  const handleCalculateAgain = () => {
    setPctInput('');
    setCalculatedCgpa(null);
    setCalculationBreakdown('');
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  const handleCopy = async () => {
    if (calculatedCgpa !== null) {
      const textToCopy = `Percentage: ${pctInput}% = ${calculatedCgpa} CGPA (${calculationBreakdown})`;
      const success = await copyToClipboard(textToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const gradeInfo = pctInput && !isNaN(parseFloat(pctInput)) ? getGradeClassification(parseFloat(pctInput)) : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Header */}
      <section className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#434CE8] text-xs font-semibold tracking-wide shadow-xs">
          <span>Reverse Calculator • 10-Point Scale</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Percentage to CGPA Calculator
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Convert your overall percentage marks back into equivalent CGPA on a standard 10.0 scale.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm text-slate-500 font-medium">
          <div className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant conversion</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-slate-400" />
            <span>Official University Formulas</span>
          </div>
        </div>
      </section>

      {/* Main Percentage Calculator Card */}
      <section className="max-w-xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculateClick();
          }}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Calculate Your CGPA
            </h2>
            <p className="text-xs text-slate-500">
              {conversionMethod === 'standard' && 'Using CBSE standard (Percentage ÷ 9.5)'}
              {conversionMethod === 'university' && `Using reverse formula for ${currentUniversity.shortName}`}
              {conversionMethod === 'custom' && 'Using custom formula settings'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pct-input" className="block text-sm font-medium text-slate-700">
                Enter your Percentage (%)
              </label>
              <span className="text-xs text-slate-400">Scale: 0% - 100%</span>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                id="pct-input"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={pctInput}
                onChange={(e) => setPctInput(e.target.value)}
                placeholder="e.g. 79.8"
                aria-label="Percentage marks out of 100"
                aria-invalid={errorMessage ? 'true' : 'false'}
                aria-describedby={errorMessage ? 'pct-error-msg' : 'pct-help-text'}
                className={`w-full px-4 py-3.5 text-lg font-medium text-slate-900 bg-slate-50/60 rounded-lg border transition-all duration-150 focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#434CE8] ${
                  errorMessage
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-300 focus:border-[#434CE8] focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {pctInput && (
                <button
                  type="button"
                  onClick={() => {
                    setPctInput('');
                    setCalculatedCgpa(null);
                  }}
                  aria-label="Clear percentage input"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 hover:bg-slate-200 px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Samples */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
              <span className="text-slate-400 whitespace-nowrap text-xs mr-0.5">Quick fill:</span>
              {['60%', '70%', '75%', '79.8%', '85%', '92%'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setPctInput(sample.replace('%', ''))}
                  aria-label={`Set percentage to ${sample}`}
                  className={`min-h-[36px] min-w-[42px] px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-medium focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none flex items-center justify-center ${
                    pctInput === sample.replace('%', '')
                      ? 'bg-indigo-50 border-indigo-200 text-[#434CE8] font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sample}
                </button>
              ))}
            </div>

            {errorMessage ? (
              <p id="pct-error-msg" role="alert" className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                <span>⚠️ {errorMessage}</span>
              </p>
            ) : (
              <p id="pct-help-text" className="text-xs text-slate-500 mt-1">
                Enter your total percentage marks out of 100
              </p>
            )}
          </div>

          <button
            id="calculate-cgpa-btn"
            type="submit"
            aria-label="Calculate equivalent CGPA from percentage"
            className="w-full py-3.5 px-4 text-base font-semibold text-white bg-[#434CE8] hover:bg-[#373ecc] active:bg-[#2f35b5] rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span>Calculate CGPA</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          {calculatedCgpa !== null && (
            <div
              id="pct-result-box"
              aria-live="polite"
              className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Equivalent CGPA (10 Scale)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    id="pct-calculate-again-btn"
                    type="button"
                    onClick={handleCalculateAgain}
                    aria-label="Calculate again with a new percentage"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#434CE8] transition-colors bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs cursor-pointer min-h-[38px] focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>Calculate Again</span>
                  </button>
                  <button
                    id="copy-cgpa-btn"
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied CGPA to clipboard' : 'Copy calculated CGPA'}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#434CE8] transition-colors bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs cursor-pointer min-h-[38px] focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span>Copy Result</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#434CE8]">
                  {calculatedCgpa.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  / 10.0 CGPA
                </span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={calculatedCgpa} aria-valuemin={0} aria-valuemax={10} aria-label="CGPA Meter">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-[#434CE8] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, (calculatedCgpa / 10) * 100))}%` }}
                />
              </div>

              {gradeInfo && (
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${gradeInfo.color}`}>
                    <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{gradeInfo.label}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {calculationBreakdown}
                  </span>
                </div>
              )}
            </div>
          )}
        </form>
      </section>

      {/* Conversion Method Controls */}
      <section aria-labelledby="pct-conversion-method-heading" className="max-w-2xl mx-auto space-y-4 text-center">
        <h2 id="pct-conversion-method-heading" className="text-xs font-bold uppercase tracking-widest text-slate-500">
          CHOOSE CONVERSION METHOD
        </h2>

        <div
          role="tablist"
          aria-label="Reverse Conversion Method"
          className="inline-flex p-1.5 bg-slate-100 rounded-full border border-slate-200 max-w-md mx-auto w-full"
        >
          <button
            type="button"
            role="tab"
            aria-selected={conversionMethod === 'standard'}
            onClick={() => setConversionMethod('standard')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              conversionMethod === 'standard'
                ? 'bg-[#434CE8] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Standard 9.5
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={conversionMethod === 'university'}
            onClick={() => setConversionMethod('university')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              conversionMethod === 'university'
                ? 'bg-[#434CE8] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            University
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={conversionMethod === 'custom'}
            onClick={() => setConversionMethod('custom')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              conversionMethod === 'custom'
                ? 'bg-[#434CE8] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Custom
          </button>
        </div>

        {conversionMethod === 'university' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-left space-y-3 max-w-lg mx-auto shadow-xs">
            <label htmlFor="reverse-univ-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Your University
            </label>
            <div className="relative">
              <select
                id="reverse-univ-select"
                value={selectedUniversityId}
                onChange={(e) => setSelectedUniversityId(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium appearance-none focus:outline-none focus:border-[#434CE8] focus-visible:ring-2 focus-visible:ring-[#434CE8] cursor-pointer"
              >
                {UNIVERSITIES.map((univ) => (
                  <option key={univ.id} value={univ.id}>
                    {univ.name} ({univ.state})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            </div>
            <p className="text-xs text-slate-600 bg-indigo-50 p-2.5 rounded border border-indigo-100">
              {currentUniversity.note}
            </p>
          </div>
        )}
      </section>

      {/* Formula & Reverse Guide Card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Reverse Conversion Rules
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In CBSE and AICTE grading, CGPA is multiplied by 9.5 to compute percentage. Thus, to revert percentage to CGPA, simply divide your percentage by 9.5:
          </p>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-semibold text-slate-800">
            CGPA = Percentage ÷ 9.5
          </div>
          <p className="text-xs text-slate-500">
            For universities with offset formulas like VTU or GTU, the offset is added back after dividing by the multiplier.
          </p>
        </div>

        <div className="bg-[#434CE8] text-white rounded-2xl shadow-md p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              Formula in Action
            </h2>
            <div className="p-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-center font-mono text-lg font-bold">
              CGPA = {pctInput || '79.8'}% ÷ 9.5
            </div>
            <p className="text-sm text-indigo-100">
              Result: <strong className="text-white text-base">{calculatedCgpa !== null ? calculatedCgpa.toFixed(2) : '8.40'} CGPA</strong>
            </p>
          </div>
          <div className="text-xs text-indigo-200 border-t border-white/15 pt-3">
            Verified with national UGC CBCS standards.
          </div>
        </div>
      </section>

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

          {/* Card 2: SGPA to Percentage */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigateTab?.('sgpa-calc')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateTab?.('sgpa-calc');
              }
            }}
            aria-label="Open SGPA to Percentage Calculator"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center group-hover:bg-[#434CE8] group-hover:text-white transition-colors shadow-2xs">
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#434CE8] transition-colors">
                SGPA & CGPA Calculator
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculate single-semester SGPA with subject credits, or combine multiple semesters for cumulative CGPA.
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
            <span className="font-semibold text-slate-700">Disclaimer:</span> This calculator provides an estimated CGPA based on general conversion logic. CGPA-to-percentage conversion rules may vary by university, institution, board, or academic program. Always verify the official conversion method specified by your institution.
          </p>
        </div>
      </section>
    </div>
  );
};
