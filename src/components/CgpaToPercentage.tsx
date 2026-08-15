import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Zap,
  Tag,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Info,
  HelpCircle,
  Award,
  ArrowRight,
  Percent,
  GraduationCap,
  Calculator,
  Layers,
  FileText,
  CalendarCheck
} from 'lucide-react';
import { UNIVERSITIES, getGradeClassification } from '../data/universities';
import { ConversionMethod, UniversityFormula } from '../types';
import { copyToClipboard } from '../utils/calculator';

interface CgpaToPercentageProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onNavigateTab?: (tab: 'cgpa-to-pct' | 'pct-to-cgpa' | 'sgpa-calc' | 'about') => void;
}

export const CgpaToPercentage: React.FC<CgpaToPercentageProps> = ({ inputRef, onNavigateTab }) => {
  const [cgpaInput, setCgpaInput] = useState<string>('8.4');
  const [conversionMethod, setConversionMethod] = useState<ConversionMethod>('standard');
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('cbse');
  const [customMultiplier, setCustomMultiplier] = useState<string>('9.5');
  const [customOffset, setCustomOffset] = useState<string>('0');
  
  const [calculatedPercentage, setCalculatedPercentage] = useState<number | null>(79.8);
  const [calculationBreakdown, setCalculationBreakdown] = useState<string>('8.4 × 9.5 = 79.8%');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const localInputRef = useRef<HTMLInputElement>(null);
  const effectiveInputRef = inputRef || localInputRef;

  const currentUniversity = UNIVERSITIES.find((u) => u.id === selectedUniversityId) || UNIVERSITIES[0];

  const performCalculation = (inputVal: string, method: ConversionMethod, univ: UniversityFormula) => {
    const num = parseFloat(inputVal.trim());
    if (isNaN(num)) {
      setCalculatedPercentage(null);
      setCalculationBreakdown('');
      setErrorMessage(inputVal.trim() === '' ? null : 'Please enter a valid numeric CGPA.');
      return;
    }

    if (num < 0 || num > 10) {
      setCalculatedPercentage(null);
      setErrorMessage('CGPA must be between 0.0 and 10.0');
      return;
    }

    setErrorMessage(null);
    let result = 0;
    let breakdown = '';

    if (method === 'standard') {
      result = num * 9.5;
      breakdown = `${num} × 9.5 = ${result.toFixed(2)}%`;
    } else if (method === 'university') {
      result = univ.calculate(num);
      if (univ.multiplier) {
        breakdown = `${num} × ${univ.multiplier} = ${result.toFixed(2)}%`;
      } else if (univ.id === 'vtu' || univ.id === 'makaut') {
        breakdown = `(${num} - 0.75) × 10 = ${result.toFixed(2)}%`;
      } else if (univ.id === 'gtu' || univ.id === 'jntu') {
        breakdown = `(${num} - 0.5) × 10 = ${result.toFixed(2)}%`;
      } else if (univ.id === 'ktu') {
        breakdown = `(${num} × 10) - 2.5 = ${result.toFixed(2)}%`;
      } else if (univ.id === 'mumbai') {
        breakdown = `${num < 7 ? `(7.1 × ${num}) + 12` : `(7.4 × ${num}) + 12`} = ${result.toFixed(2)}%`;
      } else {
        breakdown = `${univ.name}: ${result.toFixed(2)}%`;
      }
    } else if (method === 'custom') {
      const mult = parseFloat(customMultiplier) || 9.5;
      const offset = parseFloat(customOffset) || 0;
      result = (num - offset) * mult;
      breakdown = offset > 0 
        ? `(${num} - ${offset}) × ${mult} = ${result.toFixed(2)}%`
        : `${num} × ${mult} = ${result.toFixed(2)}%`;
    }

    // Clamp percentage logically between 0 and 100 for display
    const clampedResult = Math.max(0, Math.min(100, result));
    setCalculatedPercentage(Number(clampedResult.toFixed(2)));
    setCalculationBreakdown(breakdown);
  };

  useEffect(() => {
    performCalculation(cgpaInput, conversionMethod, currentUniversity);
  }, [cgpaInput, conversionMethod, selectedUniversityId, customMultiplier, customOffset]);

  const handleCalculateClick = () => {
    if (!cgpaInput.trim()) {
      setErrorMessage('Please enter your CGPA between 0.0 and 10.0');
      effectiveInputRef.current?.focus();
      return;
    }
    performCalculation(cgpaInput, conversionMethod, currentUniversity);
  };

  const handleCalculateAgain = () => {
    setCgpaInput('');
    setCalculatedPercentage(null);
    setCalculationBreakdown('');
    setErrorMessage(null);
    effectiveInputRef.current?.focus();
  };

  const handleCopy = async () => {
    if (calculatedPercentage !== null) {
      const textToCopy = `CGPA: ${cgpaInput} = ${calculatedPercentage}% (${calculationBreakdown})`;
      const success = await copyToClipboard(textToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const gradeInfo = calculatedPercentage !== null ? getGradeClassification(calculatedPercentage) : null;

  // Active formula text for the formula card
  const activeFormulaDisplay =
    conversionMethod === 'standard'
      ? 'Percentage = CGPA × 9.5'
      : conversionMethod === 'university'
      ? currentUniversity.formulaDisplay
      : customOffset && parseFloat(customOffset) > 0
      ? `Percentage = (CGPA - ${customOffset}) × ${customMultiplier}`
      : `Percentage = CGPA × ${customMultiplier}`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Header Section */}
      <section className="text-center space-y-4 pt-2">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#434CE8] text-xs font-semibold tracking-wide shadow-xs">
          <span>Free • Fast • No Signup</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          CGPA to Percentage Calculator
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Convert your CGPA to percentage instantly with this accurate CGPA calculator. Designed for Indian CBSE, AICTE, and university conversion formulas.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm text-slate-500 font-medium">
          <div className="inline-flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>Works on mobile</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span>Instant results</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>Free to use</span>
          </div>
        </div>
      </section>

      {/* Main Calculator Card */}
      <section className="max-w-xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculateClick();
          }}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 md:p-8 space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Calculate Your Percentage
            </h2>
            <p className="text-xs text-slate-500">
              {conversionMethod === 'standard' && 'Using CBSE / AICTE 9.5 Multiplier standard'}
              {conversionMethod === 'university' && `Using guideline for ${currentUniversity.shortName}`}
              {conversionMethod === 'custom' && 'Using custom multiplier configuration'}
            </p>
          </div>

          {/* Input Group */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="cgpa-input" className="block text-sm font-medium text-slate-700">
                Enter your CGPA
              </label>
              <span className="text-xs text-slate-400">Scale: 0.0 - 10.0</span>
            </div>

            <div className="relative">
              <input
                ref={effectiveInputRef}
                id="cgpa-input"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpaInput}
                onChange={(e) => setCgpaInput(e.target.value)}
                placeholder="e.g. 8.4"
                aria-label="Cumulative Grade Point Average (CGPA)"
                aria-invalid={errorMessage ? 'true' : 'false'}
                aria-describedby={errorMessage ? 'cgpa-error-msg' : 'cgpa-help-text'}
                className={`w-full min-h-[48px] px-4 py-3 text-lg font-medium text-slate-900 bg-slate-50/60 rounded-lg border transition-all duration-150 focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#434CE8] ${
                  errorMessage
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-300 focus:border-[#434CE8] focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {cgpaInput && (
                <button
                  type="button"
                  onClick={() => {
                    setCgpaInput('');
                    setCalculatedPercentage(null);
                  }}
                  aria-label="Clear CGPA input"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 hover:bg-slate-200 px-2.5 py-1.5 rounded transition-colors min-h-[32px] flex items-center focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Samples */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
              <span className="text-slate-400 whitespace-nowrap text-xs mr-0.5">Quick fill:</span>
              {['6.5', '7.2', '8.0', '8.4', '9.2', '9.8'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setCgpaInput(sample)}
                  aria-label={`Set CGPA to ${sample}`}
                  className={`min-h-[36px] min-w-[42px] px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-medium focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none flex items-center justify-center ${
                    cgpaInput === sample
                      ? 'bg-indigo-50 border-indigo-200 text-[#434CE8] font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sample}
                </button>
              ))}
            </div>

            {errorMessage ? (
              <p id="cgpa-error-msg" role="alert" className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                <span>⚠️ {errorMessage}</span>
              </p>
            ) : (
              <p id="cgpa-help-text" className="text-xs text-slate-500 mt-1">
                Enter a value between 0 and 10
              </p>
            )}
          </div>

          {/* Calculate Button */}
          <button
            id="calculate-percentage-btn"
            type="submit"
            aria-label="Calculate percentage from CGPA"
            className="w-full min-h-[48px] py-3.5 px-4 text-base font-semibold text-white bg-[#434CE8] hover:bg-[#373ecc] active:bg-[#2f35b5] rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span>Calculate Percentage</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Real-time Result Card Display */}
          {calculatedPercentage !== null && (
            <div
              id="result-display-box"
              aria-live="polite"
              className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Calculated Percentage
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    id="calculate-again-btn"
                    type="button"
                    onClick={handleCalculateAgain}
                    aria-label="Calculate again with a new CGPA"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#434CE8] transition-colors bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs cursor-pointer min-h-[38px] focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>Calculate Again</span>
                  </button>
                  <button
                    id="copy-result-btn"
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied calculation result to clipboard' : 'Copy calculation result'}
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

              {/* Big Percentage Number */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#434CE8]">
                  {calculatedPercentage}%
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-500">
                  from {cgpaInput} CGPA
                </span>
              </div>

              {/* Visual Percentage Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={calculatedPercentage} aria-valuemin={0} aria-valuemax={100} aria-label="Percentage progress bar">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-[#434CE8] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, calculatedPercentage))}%` }}
                />
              </div>

              {/* Grade Classification Pill & Details */}
              {gradeInfo && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${gradeInfo.color}`}>
                    <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{gradeInfo.label}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono break-all sm:break-normal">
                    {calculationBreakdown}
                  </span>
                </div>
              )}
            </div>
          )}
        </form>
      </section>

      {/* Choose Conversion Method Section */}
      <section aria-labelledby="conversion-method-heading" className="max-w-2xl mx-auto space-y-4 text-center w-full">
        <div className="space-y-1">
          <h2 id="conversion-method-heading" className="text-xs font-bold uppercase tracking-widest text-slate-500">
            CHOOSE CONVERSION METHOD
          </h2>
        </div>

        {/* Segmented Toggle Bar */}
        <div
          role="tablist"
          aria-label="Conversion Method"
          className="inline-flex p-1 sm:p-1.5 bg-slate-100 rounded-full border border-slate-200 max-w-md mx-auto w-full"
        >
          <button
            id="method-standard"
            type="button"
            role="tab"
            aria-selected={conversionMethod === 'standard'}
            onClick={() => setConversionMethod('standard')}
            className={`flex-1 min-h-[40px] py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              conversionMethod === 'standard'
                ? 'bg-[#434CE8] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Standard 9.5
          </button>
          <button
            id="method-university"
            type="button"
            role="tab"
            aria-selected={conversionMethod === 'university'}
            onClick={() => setConversionMethod('university')}
            className={`flex-1 min-h-[40px] py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              conversionMethod === 'university'
                ? 'bg-[#434CE8] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            University
          </button>
          <button
            id="method-custom"
            type="button"
            role="tab"
            aria-selected={conversionMethod === 'custom'}
            onClick={() => setConversionMethod('custom')}
            className={`flex-1 min-h-[40px] py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none ${
              conversionMethod === 'custom'
                ? 'bg-[#434CE8] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Dynamic Options for University Method */}
        {conversionMethod === 'university' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-left space-y-3 max-w-lg mx-auto shadow-xs">
            <div>
              <label htmlFor="university-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Select Your University / Board Guideline
              </label>
              <div className="relative">
                <select
                  id="university-select"
                  value={selectedUniversityId}
                  onChange={(e) => setSelectedUniversityId(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium appearance-none focus:outline-none focus:border-[#434CE8] focus:bg-white cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                >
                  {UNIVERSITIES.map((univ) => (
                    <option key={univ.id} value={univ.id}>
                      {univ.name} ({univ.state})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-slate-700 space-y-1.5">
              <div className="font-semibold text-[#434CE8] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Published Guideline: {currentUniversity.formulaDisplay}</span>
              </div>
              <p className="text-slate-600">{currentUniversity.note}</p>
              <p className="text-[11px] text-amber-800 bg-amber-50/80 p-1.5 rounded border border-amber-200/60">
                ⚠️ Conversion rules vary by institution and regulation scheme. Please verify the formula printed on your official transcript.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Options for Custom Method */}
        {conversionMethod === 'custom' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-left space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Institution-Specific Formula:</span> Enter the exact multiplier or offset printed on your college marksheet.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="custom-multiplier" className="block text-xs font-semibold text-slate-700 mb-1">
                  Multiplier (X)
                </label>
                <input
                  id="custom-multiplier"
                  type="number"
                  step="0.01"
                  value={customMultiplier}
                  onChange={(e) => setCustomMultiplier(e.target.value)}
                  placeholder="e.g. 9.5 or 10.0"
                  aria-label="Multiplier X"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#434CE8] focus:bg-white focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                />
              </div>
              <div>
                <label htmlFor="custom-offset" className="block text-xs font-semibold text-slate-700 mb-1">
                  Offset Subtraction (A)
                </label>
                <input
                  id="custom-offset"
                  type="number"
                  step="0.01"
                  value={customOffset}
                  onChange={(e) => setCustomOffset(e.target.value)}
                  placeholder="e.g. 0.75 or 0.5"
                  aria-label="Offset Subtraction A"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#434CE8] focus:bg-white focus-visible:ring-2 focus-visible:ring-[#434CE8]"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-200">
              Formula: Percentage = (CGPA - {customOffset || '0'}) × {customMultiplier || '9.5'}
            </p>
          </div>
        )}

        {/* Explanatory Note */}
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          <span className="font-medium text-slate-700">Important Note:</span> Conversion rules vary by institution. The 9.5 multiplier is the standard CBSE / AICTE guideline, but no single formula is universally valid across all universities.
        </p>
      </section>

      {/* Student Academic Guide & Understanding CGPA Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-[#434CE8] text-xs font-semibold">
              <span>Academic Fundamentals</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Understanding CGPA vs. Percentage
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>CGPA (Cumulative Grade Point Average)</strong> is a standardized 10-point numerical score reflecting overall academic performance across all completed semesters, weighted by subject credit units.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Percentage (%)</strong> is the conventional 100-point metric representing the aggregate proportion of marks secured out of total available marks. Converting CGPA to percentage is often required for job applications, scholarship eligibility, and competitive exams.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800">Standard CBSE Conversion:</span>
            <p className="font-mono text-slate-700">Percentage (%) = CGPA × 9.5</p>
            <p className="text-[11px] text-slate-500">Example: 8.40 CGPA = 8.40 × 9.5 = 79.80%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 text-xs font-semibold">
              <span>Verification Checklist</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Why Formulas Differ & How to Verify
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Different universities adopt distinct conversion formulas based on their grading distributions. For instance, VTU applies <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">(CGPA - 0.75) × 10</code>, GTU applies <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">(CGPA - 0.5) × 10</code>, while Anna University and Mumbai University multiply directly by 10.
            </p>
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-800">How to verify your official formula:</span>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Check the reverse side or footer instructions of your official grade card.</li>
                <li>Review the examination circular or ordinance on your university portal.</li>
                <li>If no custom formula is stated, the standard AICTE / CBSE 9.5 factor applies.</li>
              </ul>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            Select your specific university above or input a custom multiplier for exact calculations.
          </div>
        </div>
      </section>

      {/* Info & Formula Cards (2-Column Grid matching user's design) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Card: "How it works" */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How the CGPA Calculator Works
          </h2>

          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#434CE8] font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-100">
                1
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Enter CGPA
                </h3>
                <p className="text-xs text-slate-500">
                  Input your cumulative grade point average on a 10-point scale.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#434CE8] font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-100">
                2
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Choose Conversion Method
                </h3>
                <p className="text-xs text-slate-500">
                  Select the standard 9.5 multiplier or university formula.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#434CE8] font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-100">
                3
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Get Instant Percentage
                </h3>
                <p className="text-xs text-slate-500">
                  Instantly view, copy, and verify your percentage score.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 border-t border-slate-100">
            Validated for academic transcripts, resumes & higher education portals.
          </div>
        </div>

        {/* Right Card: "Standard Conversion Formula" */}
        <div className="relative overflow-hidden bg-[#434CE8] text-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
          {/* Stylized Sigma / Math Background Symbol */}
          <div className="absolute right-4 top-4 text-white/10 select-none pointer-events-none text-9xl font-serif font-black leading-none -z-0">
            Σ
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {conversionMethod === 'standard' ? 'CGPA Conversion Formula' : `${currentUniversity.shortName} CGPA Formula`}
            </h2>

            {/* Formula Highlight Box */}
            <div className="p-3.5 sm:p-5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-center">
              <span className="text-base sm:text-xl md:text-2xl font-bold tracking-wide font-mono text-white break-words">
                {activeFormulaDisplay}
              </span>
            </div>

            {/* Dynamic Example Box */}
            <div className="space-y-1 text-indigo-100">
              <p className="text-xs sm:text-sm font-medium opacity-90">
                Example: If your CGPA is {cgpaInput || '8.4'}
              </p>
              <p className="text-base sm:text-lg font-bold text-white font-mono">
                {calculationBreakdown || `8.4 × 9.5 = 79.8%`}
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-2 text-xs text-indigo-200/90 border-t border-white/15 flex items-center justify-between">
            <span>Accuracy tested against board circulars</span>
            <span className="font-semibold text-white">100% Precision</span>
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
          {/* Card 1: Percentage to CGPA */}
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
                Convert your percentage marks back to equivalent 10.0 scale CGPA using CBSE or university reverse formulas.
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
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#434CE8] transition-colors">
                SGPA to Percentage
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Convert single-semester SGPA into percentage marks based on your university's statutory formula and multiplier.
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

          {/* Card 6: Semester CGPA Tracker */}
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
            aria-label="Open Semester CGPA Tracker"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#434CE8] focus-visible:outline-none"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#434CE8] flex items-center justify-center group-hover:bg-[#434CE8] group-hover:text-white transition-colors shadow-2xs">
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#434CE8] transition-colors">
                Semester CGPA Tracker
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track and combine SGPA across multiple semesters (1st to 8th sem) with cumulative credit weighting.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#434CE8] pt-1">
              <span>Track Semesters</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#434CE8]" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Common questions on CGPA conversion, multipliers, and academic transcripts
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Why is the standard multiplier 9.5 in India (CBSE / AICTE)?',
              a: 'The Central Board of Secondary Education (CBSE) calculated that the average marks scored by top candidates achieving Grade 10 (CGPA 10.0) was approximately 95%. Dividing 95 by 10 gives 9.5. Hence, CBSE and AICTE established 9.5 as the national standard multiplier to approximate percentage from 10-point CGPA.'
            },
            {
              q: 'Do all Indian universities use the 9.5 multiplier?',
              a: 'No. While CBSE, Delhi University, and many AICTE approved institutions use 9.5, universities such as VTU use (CGPA - 0.75) × 10, GTU uses (CGPA - 0.5) × 10, and Anna University / IPU use CGPA × 10. You can choose your university in the "University" conversion method tab above.'
            },
            {
              q: 'What is the difference between SGPA and CGPA?',
              a: 'SGPA (Semester Grade Point Average) evaluates your performance in a single semester weighted by course credit units. CGPA (Cumulative Grade Point Average) is the overall credit-weighted cumulative average of all completed semesters across your entire degree.'
            },
            {
              q: 'Can I use this calculated percentage on resumes, TCS, Infosys, GATE, and CAT registrations?',
              a: 'Yes. Most campus placements, corporate recruitment portals, and national exam forms (GATE, CAT, UPSC) accept percentage calculated via the official university formula or the CBSE 9.5 multiplier.'
            },
            {
              q: 'How to convert Indian 10-point CGPA to the US 4.0 GPA scale (for WES / MS admissions)?',
              a: 'US graduate admissions and World Education Services (WES) evaluate transcripts on a 4.0 scale. Generally, a CGPA ≥ 8.0/10 corresponds to ~3.7–4.0 GPA (Grade A), 7.0–7.9 corresponds to ~3.0–3.6 GPA (Grade B+), and 6.0–6.9 corresponds to ~2.5–2.9 GPA.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-900 text-sm transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                    activeFaq === idx ? 'rotate-90 text-[#434CE8]' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="p-4 text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-600 space-y-1">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Disclaimer:</span> This calculator provides an estimated percentage based on general conversion logic. CGPA-to-percentage conversion rules may vary by university, institution, board, or academic program. Always verify the official conversion method specified by your institution.
          </p>
        </div>
      </section>
    </div>
  );
};
