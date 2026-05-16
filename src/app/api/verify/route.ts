import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractFingerprint } from '@/lib/fingerprint';
import { compareFingerprints } from '@/lib/semanticCompare';

export const runtime = 'nodejs';

/**
 * Public verification endpoint — no auth required.
 * Uses service role key to bypass RLS since anyone should be able
 * to verify a hash without being logged in.
 */
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Use service role if available, otherwise fall back to anon key
  return createClient(url, serviceKey || anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const supabase = getAdminClient();
    const body = await request.json();
    const { suspiciousText, claimedHash } = body;

    if (!suspiciousText || !claimedHash) {
      return NextResponse.json({ error: 'Missing suspiciousText or claimedHash' }, { status: 400 });
    }

    // Find the original document ID via hash (bypasses RLS)
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
      return NextResponse.json({ error: 'Fingerprint missing for this document. Please re-secure the document.' }, { status: 404 });
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
