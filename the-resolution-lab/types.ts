
export enum ResolutionPhase {
  COOLING_OFF = 'COOLING_OFF',
  I_STATEMENT = 'I_STATEMENT',
  MIRRORING = 'MIRRORING',
  NEGOTIATION = 'NEGOTIATION',
  CONTRACT = 'CONTRACT',
  VAULT = 'VAULT'
}

export interface IStatement {
  feel: string;
  when: string;
  because: string;
  outcome: string;
  tags: string[];
  categories: string[];
}

export interface Proposal {
  id: string;
  from: 'Partner A' | 'Partner B';
  iWill: string;
  ifYou: string;
  importance: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Accepted' | 'Counter' | 'Parked';
}

export interface NegotiatedAgreement {
  id: string;
  timestamp: string;
  summary: string;
  commitments: string[];
  reviewDate: string;
  participants: string[];
  categories: string[];
}

export type Partner = 'Partner A' | 'Partner B';

export interface AppState {
  currentPhase: ResolutionPhase;
  activePartner: Partner;
  frustrationLevel: number;
  iStatement: IStatement | null;
  partnerBSummary: string;
  summaryValidated: boolean;
  sliderA: { ideal: number; min: number };
  sliderB: { ideal: number; min: number };
  proposals: Proposal[];
  vault: NegotiatedAgreement[];
}
