import type { Fingerprint, AuthorshipMatch } from '@/types';

function calculateLenientOverlap(arr1: string[], arr2: string[]): number {
  if (!arr1 || !arr2) return 0;
  if (arr1.length === 0 && arr2.length === 0) return 1;
  
  let matchCount = 0;
  const list2 = arr2.map(s => s.toLowerCase().trim());
  
  for (const item1 of arr1.map(s => s.toLowerCase().trim())) {
    const hasMatch = list2.some(item2 => item1.includes(item2) || item2.includes(item1));
    if (hasMatch) matchCount++;
  }
  
  // Return overlap coefficient (intersection / minimum set size) to boost scores
  const score = matchCount / Math.max(1, Math.min(arr1.length, arr2.length));
  return Math.min(1, score * 1.5); // Add a 1.5x multiplier to account for synonyms we miss
}

export function compareFingerprints(f1: Fingerprint, f2: Fingerprint): AuthorshipMatch {
  const topicOverlap = calculateLenientOverlap(f1.topics, f2.topics);
  const entitiesOverlap = calculateLenientOverlap(f1.entities, f2.entities);
  
  const toneMatch = f1.tone?.toLowerCase() === f2.tone?.toLowerCase() ? 1 : 0.5;

  // Max diff for avg sentence length is roughly 20 words
  const maxSentenceDiff = 20;
  const sentenceDiff = Math.abs((f1.avgSentenceLength || 15) - (f2.avgSentenceLength || 15));
  const sentenceLengthMatch = Math.max(0, 1 - (sentenceDiff / maxSentenceDiff));

  const vocabDiff = Math.abs((f1.vocabularyRichness || 0.5) - (f2.vocabularyRichness || 0.5));
  const vocabMatch = Math.max(0, 1 - vocabDiff);

  const transitionDiff = Math.abs((f1.transitionFreq || 0.5) - (f2.transitionFreq || 0.5));
  const transitionMatch = Math.max(0, 1 - transitionDiff);

  // Style match: weighted average
  // sentence length 40%, vocab richness 35%, transition freq 25%
  const styleMatch = (sentenceLengthMatch * 0.4) + (vocabMatch * 0.35) + (transitionMatch * 0.25);

  // Overall similarity: topics 35%, style 30%, entities 25%, tone 10%
  const similarityScore = (topicOverlap * 0.35) + (styleMatch * 0.3) + (entitiesOverlap * 0.25) + (toneMatch * 0.10);

  let confidence: 'high' | 'medium' | 'low';
  let reasoning = '';

  if (similarityScore > 0.8) {
    confidence = 'high';
    reasoning = `Writing style patterns strongly match. Topic clusters and key entities significantly overlap. High confidence this document is derived from the secured original.`;
  } else if (similarityScore >= 0.5) {
    confidence = 'medium';
    reasoning = `Moderate overlap in stylistic choices and subject matter. Possible derivation or shared inspiration.`;
  } else {
    confidence = 'low';
    reasoning = `Distinct writing styles and disparate topic maps. Low likelihood of shared authorship.`;
  }

  return {
    similarityScore: Math.round(similarityScore * 100),
    styleMatch: Math.round(styleMatch * 100),
    topicOverlap: Math.round(topicOverlap * 100),
    confidence,
    reasoning
  };
}
