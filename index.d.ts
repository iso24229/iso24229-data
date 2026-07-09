export type RegistrationStatus = 'proposed' | 'accepted' | 'notAccepted' | 'withdrawn' | 'superseded' | 'retired';

export interface BaseEntry {
  uuid: string;
  registrationStatus: RegistrationStatus;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Authority extends BaseEntry {
  uri: string;
  authorityIdentifier: string;
  name: string;
  abstract?: string;
}

export interface CodeStatus extends BaseEntry {
  codeStatus: string;
}

export interface SpellingSystem extends BaseEntry {
  uri?: string;
  languageCode: string | null;
  scriptCode: string;
  countryCode?: string | null;
  extension?: string;
}

export interface SystemCodeReference {
  id: string;
  label: string;
  title: string;
  publisher?: string | null;
  date?: string | null;
  url?: string | null;
}

export interface SystemCodeExample {
  input: string;
  output: string;
  remarks?: string | null;
}

export interface SystemCode extends BaseEntry {
  uri?: string;
  code: string;
  name: string;
  abstract?: string;
  description?: string | null;
  specification?: string[];
  examples?: SystemCodeExample[];
  references?: SystemCodeReference[];
  notes?: string[];
  provenance?: string[];
  authority?: string;
  sourceSpelling?: string;
  sourceScriptCode?: string | null;
  targetSpelling?: string;
  targetScriptCode?: string | null;
  identifyingSegment: string;
  relations?: string[];
  codeStatus: string;
  systemStatus: string;
}

export interface SystemRelation extends BaseEntry {
  type: string;
  targetSystem: string;
}

export interface SystemRelationType extends BaseEntry {
  systemRelationType: string;
}

export interface SystemStatus extends BaseEntry {
  systemStatus: string;
}

export const itemClasses: readonly [
  'authority', 'code-status', 'spelling-system', 'system-code',
  'system-relation', 'system-relation-type', 'system-status'
];

export const authorities: Record<string, Authority>;
export const codeStatuses: Record<string, CodeStatus>;
export const spellingSystems: Record<string, SpellingSystem>;
export const systemCodes: Record<string, SystemCode>;
export const systemRelations: Record<string, SystemRelation>;
export const systemRelationTypes: Record<string, SystemRelationType>;
export const systemStatuses: Record<string, SystemStatus>;

export const entries: {
  authority: typeof authorities;
  'code-status': typeof codeStatuses;
  'spelling-system': typeof spellingSystems;
  'system-code': typeof systemCodes;
  'system-relation': typeof systemRelations;
  'system-relation-type': typeof systemRelationTypes;
  'system-status': typeof systemStatuses;
};

export const version: string;
