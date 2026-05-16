import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { extractFingerprint } from '@/lib/fingerprint';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Authenticate user via their token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const supabase = createServerSupabaseClient(token);
    
    const { data: { user }, error: authError } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, documentId } = body;

    if (!text || !documentId) {
      return NextResponse.json({ error: 'Missing text or documentId' }, { status: 400 });
    }

    // Verify document belongs to user
    const { data: document, error: docError } = await supabase
      .from('cover_letters')
      .select('id')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found or unauthorized' }, { status: 404 });
    }

    // Extract fingerprint
    const fingerprint = await extractFingerprint(text);

    // Delete any old fingerprint first (upsert behavior)
    await supabase.from('document_fingerprints').delete().eq('document_id', documentId);
    
    // Store using authenticated client
    const { error: insertError } = await supabase
      .from('document_fingerprints')
      .insert({
        document_id: documentId,
        fingerprint: fingerprint
      });

    if (insertError) {
      console.error('Failed to store fingerprint', insertError);
      return NextResponse.json({ error: 'Failed to store fingerprint' }, { status: 500 });
    }

    return NextResponse.json({ success: true, fingerprint });
  } catch (error: any) {
    console.error('Fingerprint generation error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
