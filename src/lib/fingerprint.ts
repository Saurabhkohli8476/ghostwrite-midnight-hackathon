import { getOpenAI } from './openai';
import type { Fingerprint } from '@/types';

export async function extractFingerprint(text: string): Promise<Fingerprint> {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are a forensic linguistic analyst specializing in authorship attribution.

Analyze the text and extract a semantic fingerprint. Be PRECISE and CONSISTENT:

- topics: Extract exactly 3-5 key thematic phrases. Use SPECIFIC noun phrases (e.g. "blockchain privacy protocols" not just "blockchain"). Include the most distinctive concepts.
- avgSentenceLength: Count words per sentence, compute average. Be accurate.
- vocabularyRichness: Ratio of unique words to total words (0-1 scale). Higher = more diverse vocabulary.
- entities: Extract specific named entities, technologies, frameworks, or proper nouns mentioned. Be thorough.
- tone: Choose ONE from: formal, analytical, persuasive, explanatory, conversational, technical, academic
- transitionFreq: Estimate frequency of transition words (however, therefore, moreover, etc.) as a ratio from 0-1.

Return ONLY a raw JSON object with NO markdown, NO backticks, NO explanation:
{
  "topics": string[],
  "avgSentenceLength": number,
  "vocabularyRichness": number,
  "entities": string[],
  "tone": string,
  "transitionFreq": number
}`
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.05,
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content?.trim() || '{}';
  try {
    const data = JSON.parse(content);
    return {
      topics: data.topics || [],
      avgSentenceLength: data.avgSentenceLength || 15,
      vocabularyRichness: data.vocabularyRichness || 0.5,
      entities: data.entities || [],
      tone: data.tone || 'formal',
      transitionFreq: data.transitionFreq || 0.5,
    };
  } catch (error) {
    console.error('Failed to parse fingerprint JSON', error);
    throw new Error('Failed to extract fingerprint');
  }
}
