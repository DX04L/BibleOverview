import { Person, Relationship } from '../types/genealogy';

export const mockPersons: Person[] = [
  { id: 'god', nameZh: '耶和華', nameEn: 'God', aliasesZh: [], aliasesEn: [], importance: 'crucial', sourceTraditions: ['luke'], scriptureRefs: ['創 1:1'], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z3'] },
  { id: 'adam', nameZh: '亞當', nameEn: 'Adam', aliasesZh: [], aliasesEn: [], importance: 'important', sourceTraditions: ['both'], scriptureRefs: ['創 5:3'], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z10'] },
  { id: 'eve', nameZh: '夏娃', nameEn: 'Eve', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['other'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['AE10'] },
  { id: 'cain', nameZh: '該隱', nameEn: 'Cain', rawNameZh: '該隱(1)', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['other'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['P16'] },
  { id: 'abel', nameZh: '亞伯', nameEn: 'Abel', rawNameZh: '亞伯(2)', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['other'], scriptureRefs: ['創 4:8'], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['U16'] },
  { id: 'seth', nameZh: '塞特', nameEn: 'Seth', rawNameZh: '賽特(3)', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z16'] },
  { id: 'enosh', nameZh: '以挪士', nameEn: 'Enosh', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z21'] },
  { id: 'kenan', nameZh: '該南', nameEn: 'Kenan', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z24'] },
  { id: 'mahalalel', nameZh: '瑪勒列', nameEn: 'Mahalalel', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z27'] },
  { id: 'jared', nameZh: '雅列', nameEn: 'Jared', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z30'] },
  { id: 'enoch', nameZh: '以諾', nameEn: 'Enoch', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z33'] },
  { id: 'methuselah', nameZh: '瑪土撒拉', nameEn: 'Methuselah', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: ['創 5:27'], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z38'] },
  { id: 'lamech', nameZh: '拉麥', nameEn: 'Lamech', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z43'] },
  { id: 'noah', nameZh: '挪亞', nameEn: 'Noah', aliasesZh: [], aliasesEn: [], importance: 'important', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z46'] },
  { id: 'shem', nameZh: '閃', nameEn: 'Shem', rawNameZh: '閃(2)', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['luke'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['Z52'] },
  { id: 'ham', nameZh: '含', nameEn: 'Ham', rawNameZh: '含(3)', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['other'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['AE52'], hasSubtreeView: true },
  { id: 'japheth', nameZh: '雅弗', nameEn: 'Japheth', rawNameZh: '雅弗(1)', aliasesZh: [], aliasesEn: [], importance: 'normal', sourceTraditions: ['other'], scriptureRefs: [], certainty: 'confirmed', needsEnglishReview: false, sourceCells: ['U52'], hasSubtreeView: true }
];

export const mockRelationships: Relationship[] = [
  { id: 'r1', fromPersonId: 'god', toPersonId: 'adam', type: 'parent_child', certainty: 'confirmed', scriptureRefs: ['路 3:38'], sourceCells: [], notes: [] },
  { id: 'r2', fromPersonId: 'adam', toPersonId: 'eve', type: 'spouse', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r3', fromPersonId: 'adam', toPersonId: 'cain', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r4', fromPersonId: 'adam', toPersonId: 'abel', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r5', fromPersonId: 'adam', toPersonId: 'seth', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r6', fromPersonId: 'seth', toPersonId: 'enosh', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r7', fromPersonId: 'enosh', toPersonId: 'kenan', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r8', fromPersonId: 'kenan', toPersonId: 'mahalalel', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r9', fromPersonId: 'mahalalel', toPersonId: 'jared', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r10', fromPersonId: 'jared', toPersonId: 'enoch', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r11', fromPersonId: 'enoch', toPersonId: 'methuselah', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r12', fromPersonId: 'methuselah', toPersonId: 'lamech', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r13', fromPersonId: 'lamech', toPersonId: 'noah', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r14', fromPersonId: 'noah', toPersonId: 'japheth', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r15', fromPersonId: 'noah', toPersonId: 'shem', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] },
  { id: 'r16', fromPersonId: 'noah', toPersonId: 'ham', type: 'parent_child', certainty: 'confirmed', scriptureRefs: [], sourceCells: [], notes: [] }
];
