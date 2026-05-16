import { NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';
import type { GenerateResponse } from '@/types';

export const runtime = 'nodejs'; // Use nodejs as standard runtime

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobDescription, userExperience } = body;

    if (!jobDescription || !userExperience) {
      return NextResponse.json(
        { error: 'Missing jobDescription or userExperience' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            "You are a versatile writing assistant for writers, journalists, researchers, and creators. Help the user create a high-quality document based on their context and notes. Structure the content logically, maintain a professional tone, and ensure originality. If the context implies a specific format (e.g., essay, abstract, song), adapt to it. Provide ONLY the document text.",
        },
        {
          role: 'user',
          content: `Document Context/Topic:\n${jobDescription}\n\nDraft Content/Notes:\n${userExperience}\n\nWrite the document.`,
        },
      ],
      temperature: 0.7,
    });

    const letter = response.choices[0]?.message?.content?.trim();

    if (!letter) {
      throw new Error('Failed to generate document content.');
    }

    // Simple regex fallback for job title and company (now representing Document Title and Publisher)
    let jobTitle = 'Untitled Document';
    let company = '';

    // Very basic extraction logic
    const titleMatch = jobDescription.match(/(?:Title|Topic|Subject):\s*([^\n]+)/i);
    if (titleMatch && titleMatch[1]) {
      jobTitle = titleMatch[1].trim();
    } else {
      // Fallback: take first few words as title if it looks like a title
      const firstLine = jobDescription.split('\n')[0];
      if (firstLine && firstLine.length < 50) {
        jobTitle = firstLine.trim();
      }
    }

    const companyMatch = jobDescription.match(/(?:Audience|Publisher|For):\s*([^\n]+)/i);
    if (companyMatch && companyMatch[1]) {
      company = companyMatch[1].trim();
    }

    const payload: GenerateResponse = {
      letter,
      jobTitle,
      company,
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during generation.' },
      { status: 500 }
    );
  }
}
