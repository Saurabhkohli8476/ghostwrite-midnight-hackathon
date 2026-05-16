import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { extractFingerprint } from '@/lib/fingerprint';
import { compareFingerprints } from '@/lib/semanticCompare';

export const runtime = 'nodejs'; // Use nodejs as standard runtime

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { suspiciousText, claimedHash } = body;

    if (!suspiciousText || !claimedHash) {
      return NextResponse.json({ error: 'Missing suspiciousText or claimedHash' }, { status: 400 });
    }

    // Find the original document ID via hash
    const { data: document, error: docError } = await supabase
      .from('cover_letters')
      .select('id')
      .eq('midnight_hash', claimedHash)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'No secured document found with that hash' }, { status: 404 });
    }

    // Find the stored fingerprint
    const { data: storedFingerprint, error: fpError } = await supabase
      .from('document_fingerprints')
      .select('fingerprint')
      .eq('document_id', document.id)
      .single();

    if (fpError || !storedFingerprint) {
      return NextResponse.json({ error: 'Fingerprint missing for this document' }, { status: 404 });
    }

    // Extract fingerprint from suspicious text
    const suspiciousFingerprint = await extractFingerprint(suspiciousText);

    // Compare
    const authorshipMatch = compareFingerprints(storedFingerprint.fingerprint, suspiciousFingerprint);

    return NextResponse.json({
      verified: true,
      hash: claimedHash,
      authorshipMatch
    });
  } catch (error: any) {
    console.error('Authorship verification error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
