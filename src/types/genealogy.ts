export type SourceTradition = 'luke' | 'matthew' | 'both' | 'other';
export type CertaintyLevel = 'confirmed' | 'probable' | 'disputed' | 'unverified';
export type ImportanceLevel = 'normal' | 'important' | 'crucial';
export type RelationshipType = 'parent_child' | 'spouse' | 'concubine' | 'adoptive_or_legal' | 'dynastic_succession' | 'non_direct_descendant' | 'other';

export interface Person {
  id: string;
  nameZh: string;
  nameEn: string;
  rawNameZh?: string;
  aliasesZh: string[];
  aliasesEn: string[];
  gender?: 'male' | 'female' | 'unknown';
  importance: ImportanceLevel;
  sourceTraditions: SourceTradition[];
  scriptureRefs: string[];
  summary?: string;
  certainty: CertaintyLevel;
  needsEnglishReview: boolean;
  sourceCells: string[];
  hasSubtreeView?: boolean;
}

export interface Relationship {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  type: RelationshipType;
  certainty: CertaintyLevel;
  scriptureRefs: string[];
  sourceCells: string[];
  notes: string[];
}
