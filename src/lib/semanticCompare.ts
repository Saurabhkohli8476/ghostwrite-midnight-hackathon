import type { Fingerprint, AuthorshipMatch } from '@/types';

/**
 * Word-stem fuzzy overlap: splits topics/entities into words,
 * then matches on word STEMS (first 5 chars) to handle
 * "education" vs "educational", "decentralize" vs "decentralized", etc.
 */
function calculateFuzzyOverlap(arr1: string[], arr2: string[]): number {
  if (!arr1 || !arr2) return 0;
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;

  // Build stem sets from each array (words > 3 chars, take first 5 chars as stem)
  const toStems = (arr: string[]) =>
    new Set(
      arr.flatMap(s => s.toLowerCase().trim().split(/[\s\-_,;:]+/))
        .filter(w => w.length > 3)
        .map(w => w.substring(0, 5))
    );

  const stems1 = toStems(arr1);
  const stems2 = toStems(arr2);

  if (stems1.size === 0 && stems2.size === 0) return 1;
  if (stems1.size === 0 || stems2.size === 0) return 0;

  let matches = 0;
  for (const s of stems1) {
    if (stems2.has(s)) matches++;
  }

  // Overlap coefficient: intersection / smaller set
  const overlap = matches / Math.max(1, Math.min(stems1.size, stems2.size));
  return Math.min(1, overlap);
}

/**
 * Forgiving proximity match for LLM-extracted numeric values.
 * The LLM is inherently noisy — even the same text produces slightly
 * different numbers each run. This curve is deliberately generous.
 */
function numericProximity(a: number, b: number, tolerance: number): number {
  const diff = Math.abs(a - b);
  if (diff <= tolerance * 0.3) return 1.0;   // Within 30% of tolerance → perfect match
  if (diff >= tolerance) return 0.2;           // Beyond tolerance → floor at 0.2 (not zero)
  // Smooth falloff in between
  return 0.2 + 0.8 * (1 - Math.pow((diff - tolerance * 0.3) / (tolerance * 0.7), 1.2));
}

export function compareFingerprints(f1: Fingerprint, f2: Fingerprint): AuthorshipMatch {
  // --- Content overlap ---
  const topicOverlap = calculateFuzzyOverlap(f1.topics, f2.topics);
  const entitiesOverlap = calculateFuzzyOverlap(f1.entities, f2.entities);

  // --- Tone (generous partial matching) ---
  const tone1 = (f1.tone || 'neutral').toLowerCase();
  const tone2 = (f2.tone || 'neutral').toLowerCase();
  const toneMatch = tone1 === tone2 ? 1.0
    : (tone1.includes(tone2) || tone2.includes(tone1)) ? 0.85
    : 0.4; // Even mismatched tones get a 0.4 base — LLM picks different words for similar tone

  // --- Style metrics ---
  // Generous tolerances to account for LLM extraction noise
  const sentenceLengthMatch = numericProximity(f1.avgSentenceLength || 15, f2.avgSentenceLength || 15, 12);
  const vocabMatch = numericProximity(f1.vocabularyRichness || 0.5, f2.vocabularyRichness || 0.5, 0.5);
  const transitionMatch = numericProximity(f1.transitionFreq || 0.5, f2.transitionFreq || 0.5, 0.5);

  // Style match: weighted average
  const styleMatch = (sentenceLengthMatch * 0.4) + (vocabMatch * 0.35) + (transitionMatch * 0.25);

  // --- Overall similarity (weights: style 45%, topics 25%, entities 15%, tone 15%) ---
  const rawScore = (styleMatch * 0.45) + (topicOverlap * 0.25) + (entitiesOverlap * 0.15) + (toneMatch * 0.15);

  // Boost curve: push scores upward so genuine matches land in the 80-95% range
  // This accounts for the inherent noise in dual-LLM-extraction comparison
  const similarityScore = Math.min(99, Math.round(rawScore * 130));

  const pctStyle = Math.min(99, Math.round(styleMatch * 115));
  const pctTopic = Math.min(99, Math.round(topicOverlap * 120));

  // --- Confidence & reasoning ---
  let confidence: 'high' | 'medium' | 'low';
  let reasoning = '';

  if (similarityScore >= 65) {
    confidence = 'high';
    reasoning = `Strong authorship indicators detected. Writing cadence (${pctStyle}% style match), thematic focus (${pctTopic}% topic alignment), and tonal patterns are consistent with the secured original. This document shows clear signs of derivation from the protected source — even with surface-level rewording, the underlying fingerprint persists.`;
  } else if (similarityScore >= 40) {
    confidence = 'medium';
    reasoning = `Partial fingerprint overlap identified. While some stylistic elements align (${pctStyle}% style match) and thematic concepts share common ground (${pctTopic}% topic alignment), there are enough structural differences to suggest possible inspiration rather than direct derivation. Further review recommended.`;
  } else {
    confidence = 'low';
    reasoning = `Minimal fingerprint correlation. The writing patterns (${pctStyle}% style match), subject matter (${pctTopic}% topic alignment), and structural choices diverge significantly from the secured original. This document is unlikely to be derived from the protected source.`;
  }

  return {
    similarityScore,
    styleMatch: pctStyle,
    topicOverlap: pctTopic,
    confidence,
    reasoning
  };
}
