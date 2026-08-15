/**
 * Utility functions for CGPA, Percentage, and SGPA calculations.
 */

import { SubjectGrade, SemesterData, UniversityFormula, ConversionMethod } from '../types';

/**
 * Copies a given text string to the user's clipboard.
 * Returns true if successful, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    return false;
  }
}

/**
 * Converts a 10-point CGPA into a percentage score based on the chosen method.
 */
export function convertCgpaToPercentage(
  cgpa: number,
  method: ConversionMethod,
  university: UniversityFormula,
  customMultiplier: number,
  customOffset: number
): { percentage: number; formulaText: string } {
  let percentage = 0;
  let formulaText = '';

  if (method === 'standard') {
    // CBSE & AICTE standard formula: CGPA * 9.5
    percentage = cgpa * 9.5;
    formulaText = `${cgpa} × 9.5 = ${percentage.toFixed(2)}%`;
  } else if (method === 'university') {
    // University-specific conversion rules
    percentage = university.calculate(cgpa);
    formulaText = `${university.shortName}: ${percentage.toFixed(2)}%`;
  } else {
    // Custom user formula: (CGPA * multiplier) + offset
    percentage = (cgpa * customMultiplier) + customOffset;
    const sign = customOffset >= 0 ? '+' : '-';
    formulaText = `(${cgpa} × ${customMultiplier}) ${sign} ${Math.abs(customOffset)} = ${percentage.toFixed(2)}%`;
  }

  // Cap within logical boundaries 0% to 100%
  const clampedPercentage = Math.min(100, Math.max(0, parseFloat(percentage.toFixed(2))));
  return { percentage: clampedPercentage, formulaText };
}

/**
 * Converts a percentage score back into an equivalent 10-point CGPA.
 */
export function convertPercentageToCgpa(
  percentage: number,
  method: ConversionMethod,
  university: UniversityFormula,
  customMultiplier: number,
  customOffset: number
): { cgpa: number; formulaText: string } {
  let cgpa = 0;
  let formulaText = '';

  if (method === 'standard') {
    // Reverse CBSE formula: Percentage / 9.5
    cgpa = percentage / 9.5;
    formulaText = `${percentage}% ÷ 9.5 = ${cgpa.toFixed(2)}`;
  } else if (method === 'university') {
    cgpa = university.reverseCalculate(percentage);
    formulaText = `${university.shortName} Reverse: ${cgpa.toFixed(2)}`;
  } else {
    const mult = customMultiplier || 9.5;
    cgpa = (percentage - customOffset) / mult;
    formulaText = `(${percentage}% - ${customOffset}) ÷ ${mult} = ${cgpa.toFixed(2)}`;
  }

  // Cap within 0 to 10.0 scale
  const clampedCgpa = Math.min(10, Math.max(0, parseFloat(cgpa.toFixed(2))));
  return { cgpa: clampedCgpa, formulaText };
}

/**
 * Computes Semester Grade Point Average (SGPA) using credit weighting.
 * Formula: sum(gradePoint * credits) / sum(credits)
 */
export function calculateSgpaFromSubjects(subjects: SubjectGrade[]): { sgpa: number; totalCredits: number; totalPoints: number } {
  let totalCredits = 0;
  let totalPoints = 0;

  subjects.forEach((sub) => {
    const cred = sub.credits > 0 ? sub.credits : 0;
    totalCredits += cred;
    totalPoints += sub.gradePoint * cred;
  });

  const sgpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
  return { sgpa, totalCredits, totalPoints };
}

/**
 * Computes cumulative CGPA across multiple semesters using semester credits.
 * Formula: sum(sgpa * credits) / sum(credits)
 */
export function calculateCgpaFromSemesters(semesters: SemesterData[]): { overallCgpa: number; totalCredits: number } {
  let totalCredits = 0;
  let weightedPoints = 0;

  semesters.forEach((sem) => {
    if (sem.sgpa > 0 && sem.credits > 0) {
      totalCredits += sem.credits;
      weightedPoints += sem.sgpa * sem.credits;
    }
  });

  const overallCgpa = totalCredits > 0 ? parseFloat((weightedPoints / totalCredits).toFixed(2)) : 0;
  return { overallCgpa, totalCredits };
}
