
export enum RegulatoryFunction {
  RS = 'National Regulatory System',
  MA = 'Market Authorization',
  PV = 'Pharmacovigilance',
  MC = 'Market Surveillance & Control',
  LT = 'Laboratory Testing',
  CT = 'Clinical Trial Oversight',
  RI = 'Regulatory Inspection',
  LR = 'Lot Release'
}

export enum PerformanceStatus {
  ACHIEVED = 'Achieved',
  ON_TRACK = 'On Track',
  BEHIND = 'Behind',
  RED_ALERT = 'Red Alert'
}

export interface RPI {
  id: string;
  function: RegulatoryFunction;
  code: string;
  description: string;
  numeratorLogic: string;
  denominatorLogic: string;
  baseline: number;
  target: number;
  threshold: number;
  currentValue: number;
  unit: string;
  measurementPeriod: 'Monthly' | 'Quarterly' | 'Annual';
  dataSource: string;
  responsibleRole: string;
  whoGbtLinkage: string;
  wlaRelevance: boolean;
  status: PerformanceStatus;
  trend: 'up' | 'down' | 'stable';
}

export interface CAPA {
  id: string;
  rpiId: string;
  rootCause: string;
  actionPlan: string;
  owner: string;
  dueDate: string;
  status: 'Open' | 'Resolved' | 'Overdue';
}

export interface User {
  role: 'DG' | 'Director' | 'ProcessOwner' | 'QMS' | 'WHOAssessor';
  name: string;
}
