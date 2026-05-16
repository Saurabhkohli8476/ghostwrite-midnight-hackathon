// ─── Domain Types ───────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
  userExperience: string;
  generatedLetter: string;
  midnightHash?: string;
  midnightTx?: string;
  isSecured: boolean;
  securedAt?: string;
  createdAt: string;
}

export interface MidnightReceipt {
  hash: string;
  txId: string;
  timestamp: string;
  network: string;
  verified: boolean;
}

export interface Fingerprint {
  topics: string[];
  avgSentenceLength: number;
  vocabularyRichness: number;
  entities: string[];
  tone: string;
  transitionFreq: number;
  // Expanded metrics
  sentenceLengthVariance?: number;
  paragraphCount?: number;
  punctuationDensity?: number;
  passiveVoiceRatio?: number;
  averageWordComplexity?: number;
  rhetoricalPatternScore?: number;
}

export interface AuthorshipMatch {
  semanticSimilarity: number;
  styleMatch: number;
  semanticAlignment: number;
  conceptualReferenceMatch: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

// ─── API Payload Types ──────────────────────────────────────────

export interface GenerateLetterPayload {
  jobDescription: string;
  userExperience: string;
}

export interface SecureLetterPayload {
  letterId: string;
  content: string;
}

export interface GenerateLetterResponse {
  letter: string;
  jobTitle: string;
  company?: string;
}

export interface SecureLetterResponse {
  receipt: MidnightReceipt;
}

// ─── Component specific types ───────────────────────────────────
export interface GenerateResponse {
  letter: string;
  jobTitle: string;
  company?: string;
}

export interface SecureResponse {
  hash: string;
  txId: string;
  timestamp: string;
  network: string;
  verified: boolean;
}
