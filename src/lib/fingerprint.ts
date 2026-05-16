import { getOpenAI } from './openai';
import type { Fingerprint } from '@/types';

export async function extractFingerprint(text: string): Promise<Fingerprint> {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are an expert linguistic analyst. Analyze the following text and extract its semantic fingerprint. 
Return ONLY a raw JSON object with the following exact keys, with NO markdown formatting, NO backticks, and NO additional text:
{
  "topics": string[], 
  "avgSentenceLength": number, 
  "vocabularyRichness": number (between 0 and 1), 
  "entities": string[], 
  "tone": string, 
  "transitionFreq": number (between 0 and 1)
}`
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.1,
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
      tone: data.tone || 'neutral',
      transitionFreq: data.transitionFreq || 0.5,
    };
  } catch (error) {
    console.error('Failed to parse fingerprint JSON', error);
    throw new Error('Failed to extract fingerprint');
  }
}
