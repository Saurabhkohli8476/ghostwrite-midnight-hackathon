import type { Fingerprint, AuthorshipMatch } from '@/types';

/**
 * Word-level fuzzy overlap: splits each topic/entity into individual words
 * and checks how many words overlap between the two sets.
 * This handles cases like "decentralized identity" vs "identity systems" → matches on "identity".
 */
function calculateFuzzyOverlap(arr1: string[], arr2: string[]): number {
  if (!arr1 || !arr2) return 0;
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;

  // Build word sets from each array
  const words1 = new Set(arr1.flatMap(s => s.toLowerCase().trim().split(/\s+/)).filter(w => w.length > 2));
  const words2 = new Set(arr2.flatMap(s => s.toLowerCase().trim().split(/\s+/)).filter(w => w.length > 2));

  if (words1.size === 0 && words2.size === 0) return 1;

  let matches = 0;
  for (const w of words1) {
    if (words2.has(w)) matches++;
  }

  // Overlap coefficient: intersection / min(set1, set2)
  const overlap = matches / Math.max(1, Math.min(words1.size, words2.size));
  return Math.min(1, overlap);
}

/**
 * Proximity match for numeric values — returns 1.0 when identical,
 * falls off gracefully with a tuned curve.
 */
function numericProximity(a: number, b: number, maxDiff: number): number {
  const diff = Math.abs(a - b);
  // Quadratic falloff — more forgiving for small differences
  return Math.max(0, 1 - Math.pow(diff / maxDiff, 1.5));
}

export function compareFingerprints(f1: Fingerprint, f2: Fingerprint): AuthorshipMatch {
  // --- Content overlap ---
  const topicOverlap = calculateFuzzyOverlap(f1.topics, f2.topics);
  const entitiesOverlap = calculateFuzzyOverlap(f1.entities, f2.entities);

  // --- Tone ---
  const tone1 = (f1.tone || 'neutral').toLowerCase();
  const tone2 = (f2.tone || 'neutral').toLowerCase();
  const toneMatch = tone1 === tone2 ? 1 : (tone1.includes(tone2) || tone2.includes(tone1)) ? 0.7 : 0.3;

  // --- Style metrics (the HOW of writing) ---
  const sentenceLengthMatch = numericProximity(f1.avgSentenceLength || 15, f2.avgSentenceLength || 15, 15);
  const vocabMatch = numericProximity(f1.vocabularyRichness || 0.5, f2.vocabularyRichness || 0.5, 0.4);
  const transitionMatch = numericProximity(f1.transitionFreq || 0.5, f2.transitionFreq || 0.5, 0.4);

  // Style match: weighted average of writing behaviour metrics
  const styleMatch = (sentenceLengthMatch * 0.4) + (vocabMatch * 0.35) + (transitionMatch * 0.25);

  // --- Overall similarity (weights: style 45%, topics 25%, entities 15%, tone 15%) ---
  const rawScore = (styleMatch * 0.45) + (topicOverlap * 0.25) + (entitiesOverlap * 0.15) + (toneMatch * 0.15);

  // Apply a gentle curve to push mid-range scores upward (makes results more decisive)
  const similarityScore = Math.min(1, rawScore * 1.15);

  // --- Confidence & reasoning ---
  let confidence: 'high' | 'medium' | 'low';
  let reasoning = '';

  const pctSimilarity = Math.round(similarityScore * 100);
  const pctStyle = Math.round(styleMatch * 100);
  const pctTopic = Math.round(topicOverlap * 100);

  if (similarityScore >= 0.72) {
    confidence = 'high';
    reasoning = `Strong authorship indicators detected. Writing cadence (${pctStyle}% style match), thematic focus (${pctTopic}% topic alignment), and tonal patterns are consistent with the secured original. This document shows clear signs of derivation from the protected source — even with surface-level rewording, the underlying fingerprint persists.`;
  } else if (similarityScore >= 0.45) {
    confidence = 'medium';
    reasoning = `Partial fingerprint overlap identified. While some stylistic elements align (${pctStyle}% style match) and thematic concepts share common ground (${pctTopic}% topic alignment), there are enough structural differences to suggest possible inspiration rather than direct derivation. Further review recommended.`;
  } else {
    confidence = 'low';
    reasoning = `Minimal fingerprint correlation. The writing patterns (${pctStyle}% style match), subject matter (${pctTopic}% topic alignment), and structural choices diverge significantly from the secured original. This document is unlikely to be derived from the protected source.`;
  }

  return {
    similarityScore: pctSimilarity,
    styleMatch: pctStyle,
    topicOverlap: pctTopic,
    confidence,
    reasoning
  };
}
