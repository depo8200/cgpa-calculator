export type NavTab = 'cgpa-to-pct' | 'pct-to-cgpa' | 'sgpa-calc' | 'about';

export type ConversionMethod = 'standard' | 'university' | 'custom';

export interface UniversityFormula {
  id: string;
  name: string;
  shortName: string;
  state: string;
  formulaDisplay: string;
  multiplier?: number;
  calculate: (cgpa: number) => number;
  reverseCalculate: (pct: number) => number;
  note: string;
}

export interface SubjectGrade {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
  gradeLetter: string;
}

export interface SemesterData {
  semesterNumber: number;
  sgpa: number;
  credits: number;
}
