
import { RPI, RegulatoryFunction, PerformanceStatus, CAPA } from './types';

export const MOCK_RPIS: RPI[] = [
  {
    id: '1',
    function: RegulatoryFunction.MA,
    code: 'MA-RPI-01',
    description: 'Percentage of marketing authorization applications for new medicines processed within statutory timelines.',
    numeratorLogic: 'Number of MA applications processed on time',
    denominatorLogic: 'Total number of MA applications received',
    baseline: 75,
    target: 95,
    threshold: 85,
    currentValue: 82,
    unit: '%',
    measurementPeriod: 'Quarterly',
    dataSource: 'NAPAMS',
    responsibleRole: 'Director, R&R',
    whoGbtLinkage: 'MA01.01 (ML4)',
    wlaRelevance: true,
    status: PerformanceStatus.BEHIND,
    trend: 'down'
  },
  {
    id: '2',
    function: RegulatoryFunction.PV,
    code: 'PV-RPI-05',
    description: 'Percentage of serious adverse events (AEFIs) investigated within 48 hours of reporting.',
    numeratorLogic: 'Serious SAEs investigated in 48h',
    denominatorLogic: 'Total serious SAEs reported',
    baseline: 80,
    target: 100,
    threshold: 90,
    currentValue: 92,
    unit: '%',
    measurementPeriod: 'Monthly',
    dataSource: 'VigiFlow',
    responsibleRole: 'Director, PV/PMS',
    whoGbtLinkage: 'PV05.02 (ML4)',
    wlaRelevance: true,
    status: PerformanceStatus.ON_TRACK,
    trend: 'up'
  },
  {
    id: '3',
    function: RegulatoryFunction.LT,
    code: 'LT-RPI-02',
    description: 'Average turnaround time (TAT) for laboratory testing of high-risk biological products.',
    numeratorLogic: 'Sum of TAT for all samples',
    denominatorLogic: 'Total samples tested',
    baseline: 45,
    target: 20,
    threshold: 30,
    currentValue: 22,
    unit: 'Days',
    measurementPeriod: 'Monthly',
    dataSource: 'LIMS',
    responsibleRole: 'Director, Lab Services',
    whoGbtLinkage: 'LT02.04 (ML3)',
    wlaRelevance: true,
    status: PerformanceStatus.ACHIEVED,
    trend: 'stable'
  },
  {
    id: '4',
    function: RegulatoryFunction.RS,
    code: 'RS-RPI-10',
    description: 'Existence of an automated, risk-based resource allocation model for regulatory functions.',
    numeratorLogic: 'Binary check (0/1)',
    denominatorLogic: 'N/A',
    baseline: 0,
    target: 1,
    threshold: 1,
    currentValue: 1,
    unit: 'Status',
    measurementPeriod: 'Annual',
    dataSource: 'QMS Audit',
    responsibleRole: 'DG Office',
    whoGbtLinkage: 'RS01.01 (ML4)',
    wlaRelevance: true,
    status: PerformanceStatus.ACHIEVED,
    trend: 'stable'
  },
  {
    id: '5',
    function: RegulatoryFunction.RI,
    code: 'RI-RPI-03',
    description: 'Percentage of non-conformances closed out by industry within 60 days of inspection.',
    numeratorLogic: 'NCs closed in 60d',
    denominatorLogic: 'Total NCs issued',
    baseline: 60,
    target: 90,
    threshold: 75,
    currentValue: 55,
    unit: '%',
    measurementPeriod: 'Quarterly',
    dataSource: 'PIDCARMS',
    responsibleRole: 'Director, DER',
    whoGbtLinkage: 'RI03.05 (ML4)',
    wlaRelevance: true,
    status: PerformanceStatus.RED_ALERT,
    trend: 'down'
  }
];

export const MOCK_CAPAS: CAPA[] = [
  {
    id: 'c1',
    rpiId: '5',
    rootCause: 'Manual follow-up system causing delays in verifying industry compliance.',
    actionPlan: 'Deploy automated email trigger in PIDCARMS for NC deadlines.',
    owner: 'Head of ICT / Director DER',
    dueDate: '2024-12-15',
    status: 'Open'
  },
  {
    id: 'c2',
    rpiId: '1',
    rootCause: 'Staff turnover in the registration unit and backlog from Q1 strike.',
    actionPlan: 'Implement temporary overtime shift and outsource preliminary documentation review.',
    owner: 'Director R&R',
    dueDate: '2024-11-20',
    status: 'Resolved'
  }
];

export const MOCK_TREND_DATA = [
  { period: 'Jan', value: 65, target: 95 },
  { period: 'Feb', value: 70, target: 95 },
  { period: 'Mar', value: 75, target: 95 },
  { period: 'Apr', value: 72, target: 95 },
  { period: 'May', value: 80, target: 95 },
  { period: 'Jun', value: 82, target: 95 },
  { period: 'Jul', value: 78, target: 95 },
  { period: 'Aug', value: 82, target: 95 },
];

export const FUNCTION_COLORS: Record<RegulatoryFunction, string> = {
  [RegulatoryFunction.RS]: '#10b981', // Emerald
  [RegulatoryFunction.MA]: '#3b82f6', // Blue
  [RegulatoryFunction.PV]: '#8b5cf6', // Violet
  [RegulatoryFunction.MC]: '#f59e0b', // Amber
  [RegulatoryFunction.LT]: '#ec4899', // Pink
  [RegulatoryFunction.CT]: '#06b6d4', // Cyan
  [RegulatoryFunction.RI]: '#ef4444', // Red
  [RegulatoryFunction.LR]: '#6366f1'  // Indigo
};
