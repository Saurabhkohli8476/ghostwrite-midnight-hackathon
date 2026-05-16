import OpenAI from 'openai';

/**
 * Server-side OpenAI client.
 * Lazy-initialized to avoid crashing during build when env vars are absent.
 */
let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GROQ_API_KEY environment variable. Set it in .env.local');
    }
    _openai = new OpenAI({ 
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return _openai;
}

/** @deprecated Use getOpenAI() instead — this may throw at import time during build. */
export const openai = typeof process !== 'undefined' && process.env.GROQ_API_KEY
  ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' })
  : (null as unknown as OpenAI);
