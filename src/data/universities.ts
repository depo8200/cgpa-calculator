import { UniversityFormula } from '../types';

export const UNIVERSITIES: UniversityFormula[] = [
  {
    id: 'cbse',
    name: 'CBSE / AICTE (Standard 9.5)',
    shortName: 'CBSE / AICTE',
    state: 'National',
    formulaDisplay: 'Percentage = CGPA × 9.5',
    multiplier: 9.5,
    calculate: (cgpa: number) => cgpa * 9.5,
    reverseCalculate: (pct: number) => pct / 9.5,
    note: 'Most common national standard across CBSE board and AICTE approved engineering/management institutions.'
  },
  {
    id: 'vtu',
    name: 'Visvesvaraya Technological University (VTU)',
    shortName: 'VTU Karnataka',
    state: 'Karnataka',
    formulaDisplay: 'Percentage = (CGPA - 0.75) × 10',
    calculate: (cgpa: number) => (cgpa - 0.75) * 10,
    reverseCalculate: (pct: number) => (pct / 10) + 0.75,
    note: 'Official VTU circular formula for 2010/2015/2017/2018/2021/2022 scheme.'
  },
  {
    id: 'gtu',
    name: 'Gujarat Technological University (GTU)',
    shortName: 'GTU Gujarat',
    state: 'Gujarat',
    formulaDisplay: 'Percentage = (CGPA - 0.5) × 10',
    calculate: (cgpa: number) => (cgpa - 0.5) * 10,
    reverseCalculate: (pct: number) => (pct / 10) + 0.5,
    note: 'Applies to Degree Engineering, Diploma, Pharmacy, and MBA/MCA at GTU.'
  },
  {
    id: 'mumbai',
    name: 'Mumbai University (MU)',
    shortName: 'Mumbai University',
    state: 'Maharashtra',
    formulaDisplay: 'Percentage = 7.1 × CGPA + 11 (or (CGPA × 7.25) + 11)',
    calculate: (cgpa: number) => {
      if (cgpa < 7) {
        return (7.1 * cgpa) + 12;
      }
      return (7.4 * cgpa) + 12;
    },
    reverseCalculate: (pct: number) => (pct - 12) / 7.25,
    note: 'Official conversion formula prescribed in circular by University of Mumbai for CBSGS credit grading system.'
  },
  {
    id: 'anna',
    name: 'Anna University',
    shortName: 'Anna University',
    state: 'Tamil Nadu',
    formulaDisplay: 'Percentage = CGPA × 10',
    multiplier: 10,
    calculate: (cgpa: number) => cgpa * 10,
    reverseCalculate: (pct: number) => pct / 10,
    note: 'Standard 10x multiplier for Autonomous & Affiliated colleges under Anna University (Regulation 2017 & 2021).'
  },
  {
    id: 'sppu',
    name: 'Savitribai Phule Pune University (SPPU)',
    shortName: 'SPPU Pune',
    state: 'Maharashtra',
    formulaDisplay: 'Percentage = (CGPA - 0.75) × 10 (or Grade Tier formula)',
    calculate: (cgpa: number) => {
      if (cgpa >= 8.25) return (cgpa * 10) - 7.5;
      if (cgpa >= 7.25) return (cgpa * 10) - 7.5;
      if (cgpa >= 6.75) return (cgpa * 10) - 7.5;
      return (cgpa - 0.75) * 10;
    },
    reverseCalculate: (pct: number) => (pct / 10) + 0.75,
    note: 'Prescribed by SPPU Examination circular for Choice Based Credit System (CBCS).'
  },
  {
    id: 'makaut',
    name: 'MAKAUT / WBUT',
    shortName: 'MAKAUT (West Bengal)',
    state: 'West Bengal',
    formulaDisplay: 'Percentage = (CGPA - 0.75) × 10',
    calculate: (cgpa: number) => (cgpa - 0.75) * 10,
    reverseCalculate: (pct: number) => (pct / 10) + 0.75,
    note: 'Standard Maulana Abul Kalam Azad University of Technology percentage conversion formula.'
  },
  {
    id: 'du',
    name: 'Delhi University (DU)',
    shortName: 'Delhi University',
    state: 'Delhi',
    formulaDisplay: 'Percentage = CGPA × 9.5',
    multiplier: 9.5,
    calculate: (cgpa: number) => cgpa * 9.5,
    reverseCalculate: (pct: number) => pct / 9.5,
    note: 'University of Delhi CBCS grading system formula notified for undergraduate and postgraduate programs.'
  },
  {
    id: 'ipu',
    name: 'Guru Gobind Singh Indraprastha University (GGSIPU)',
    shortName: 'IP University (GGSIPU)',
    state: 'Delhi',
    formulaDisplay: 'Percentage = CGPA × 10',
    multiplier: 10,
    calculate: (cgpa: number) => cgpa * 10,
    reverseCalculate: (pct: number) => pct / 10,
    note: 'Official GGSIPU Examination division circular multiplier (10.0).'
  },
  {
    id: 'ktu',
    name: 'APJ Abdul Kalam Technological University (KTU)',
    shortName: 'KTU Kerala',
    state: 'Kerala',
    formulaDisplay: 'Percentage = (CGPA × 10) - 2.5',
    calculate: (cgpa: number) => (cgpa * 10) - 2.5,
    reverseCalculate: (pct: number) => (pct + 2.5) / 10,
    note: 'Official KTU Kerala B.Tech & M.Tech conversion rule formula.'
  },
  {
    id: 'jntu',
    name: 'Jawaharlal Nehru Technological University (JNTU)',
    shortName: 'JNTU Hyderabad / Kakinada',
    state: 'Telangana / AP',
    formulaDisplay: 'Percentage = (CGPA - 0.5) × 10',
    calculate: (cgpa: number) => (cgpa - 0.5) * 10,
    reverseCalculate: (pct: number) => (pct / 10) + 0.5,
    note: 'Standard conversion formula specified in JNTU Academic Regulations.'
  },
  {
    id: 'rgpv',
    name: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)',
    shortName: 'RGPV Bhopal',
    state: 'Madhya Pradesh',
    formulaDisplay: 'Percentage = CGPA × 10',
    multiplier: 10,
    calculate: (cgpa: number) => cgpa * 10,
    reverseCalculate: (pct: number) => pct / 10,
    note: 'Standard formula for RGPV degree and diploma engineering courses.'
  },
  {
    id: 'calicut',
    name: 'University of Calicut',
    shortName: 'Calicut University',
    state: 'Kerala',
    formulaDisplay: 'Percentage = CGPA × 10',
    multiplier: 10,
    calculate: (cgpa: number) => cgpa * 10,
    reverseCalculate: (pct: number) => pct / 10,
    note: 'Used for Choice Based Credit Semester System (CBCSS).'
  },
  {
    id: 'wes_us',
    name: 'US / WES 4-Point GPA Equivalent',
    shortName: 'US 4.0 Scale (WES Standard)',
    state: 'International',
    formulaDisplay: '4.0 GPA = (CGPA / 10) × 4.0 (Approximate WES / US GPA Scale)',
    calculate: (cgpa: number) => (cgpa / 10) * 100, // percentage representation
    reverseCalculate: (pct: number) => (pct / 100) * 10,
    note: 'Approximate conversion reference for US universities & WES evaluations.'
  }
];

export const GRADE_CLASSIFICATIONS = [
  { minPct: 75, label: 'First Class with Distinction (Grade O / A+)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { minPct: 60, label: 'First Class / First Division (Grade A)', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { minPct: 50, label: 'Second Class / Second Division (Grade B+)', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { minPct: 40, label: 'Pass Class (Grade B / C)', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { minPct: 0, label: 'Needs Improvement / Fail', color: 'text-rose-700 bg-rose-50 border-rose-200' },
];

export function getGradeClassification(percentage: number) {
  for (const grade of GRADE_CLASSIFICATIONS) {
    if (percentage >= grade.minPct) {
      return grade;
    }
  }
  return GRADE_CLASSIFICATIONS[GRADE_CLASSIFICATIONS.length - 1];
}
