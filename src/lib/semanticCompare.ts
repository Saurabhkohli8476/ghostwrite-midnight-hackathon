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
  const semanticAlignment = calculateLenientOverlap(f1.topics, f2.topics);
  const conceptualReferenceMatch = calculateLenientOverlap(f1.entities, f2.entities);
  
  const toneMatch = f1.tone?.toLowerCase() === f2.tone?.toLowerCase() ? 1 : 0.2; // Dropped base tone match to 0.2 for strictness

  // Style match components
  const maxSentenceDiff = 20;
  const sentenceLengthMatch = Math.max(0, 1 - (Math.abs((f1.avgSentenceLength || 15) - (f2.avgSentenceLength || 15)) / maxSentenceDiff));
  const vocabMatch = Math.max(0, 1 - Math.abs((f1.vocabularyRichness || 0.5) - (f2.vocabularyRichness || 0.5)));
  const transitionMatch = Math.max(0, 1 - Math.abs((f1.transitionFreq || 0.5) - (f2.transitionFreq || 0.5)));
  
  // New Expanded Metrics (with safe fallbacks to 0 for old DB entries)
  const lengthVarianceMatch = Math.max(0, 1 - Math.abs((f1.sentenceLengthVariance || 0) - (f2.sentenceLengthVariance || 0)) / 20);
  const paragraphMatch = Math.max(0, 1 - Math.abs((f1.paragraphCount || 1) - (f2.paragraphCount || 1)) / 10);
  const punctuationMatch = Math.max(0, 1 - Math.abs((f1.punctuationDensity || 0) - (f2.punctuationDensity || 0)));
  const passiveVoiceMatch = Math.max(0, 1 - Math.abs((f1.passiveVoiceRatio || 0) - (f2.passiveVoiceRatio || 0)));
  const complexityMatch = Math.max(0, 1 - Math.abs((f1.averageWordComplexity || 0.5) - (f2.averageWordComplexity || 0.5)));
  const rhetoricalMatch = Math.max(0, 1 - Math.abs((f1.rhetoricalPatternScore || 0.5) - (f2.rhetoricalPatternScore || 0.5)));

  // Determine if we have the new metrics (if not, we rely on the original 3)
  const hasNewMetrics = f1.paragraphCount !== undefined && f2.paragraphCount !== undefined;
  
  let styleMatch = 0;
  if (hasNewMetrics) {
    styleMatch = (
      (sentenceLengthMatch * 0.15) +
      (vocabMatch * 0.15) +
      (transitionMatch * 0.15) +
      (lengthVarianceMatch * 0.10) +
      (paragraphMatch * 0.10) +
      (punctuationMatch * 0.10) +
      (passiveVoiceMatch * 0.10) +
      (complexityMatch * 0.10) +
      (rhetoricalMatch * 0.05)
    );
  } else {
    // Fallback if older fingerprints are compared
    styleMatch = (sentenceLengthMatch * 0.4) + (vocabMatch * 0.35) + (transitionMatch * 0.25);
  }

  // Raw semantic similarity based on new weights
  const semanticSimilarity = (styleMatch * 0.45) + (semanticAlignment * 0.25) + (conceptualReferenceMatch * 0.15) + (toneMatch * 0.15);

  let confidence: 'high' | 'medium' | 'low';
  let reasoning = '';

  // Anti-false-positive penalty logic:
  // If semantic similarity is high but style/tone is vastly different, it's a different author writing about the same topic.
  if (semanticAlignment >= 0.7 && (styleMatch < 0.5 || toneMatch < 0.5)) {
    confidence = 'medium';
    reasoning = `Although both documents discuss highly similar concepts (${Math.round(semanticAlignment*100)}% overlap), the writing rhythm, tone, and sentence structure differ significantly (${Math.round(styleMatch*100)}% match), reducing authorship confidence.`;
  } else if (semanticSimilarity > 0.8 && styleMatch >= 0.7) {
    confidence = 'high';
    reasoning = `Writing style patterns strongly match. Topic clusters and key entities significantly overlap. High confidence this document is derived from the secured original.`;
  } else if (semanticSimilarity >= 0.5) {
    confidence = 'medium';
    reasoning = `Moderate overlap in stylistic choices and subject matter. Possible derivation or shared inspiration.`;
  } else {
    confidence = 'low';
    reasoning = `Distinct writing styles and disparate topic maps. Low likelihood of shared authorship.`;
  }

  return {
    semanticSimilarity: Math.round(semanticSimilarity * 100),
    styleMatch: Math.round(styleMatch * 100),
    semanticAlignment: Math.round(semanticAlignment * 100),
    conceptualReferenceMatch: Math.round(conceptualReferenceMatch * 100),
    confidence,
    reasoning
  };
}
