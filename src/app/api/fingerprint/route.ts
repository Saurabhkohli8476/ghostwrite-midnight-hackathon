import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { extractFingerprint } from '@/lib/fingerprint';

export const runtime = 'nodejs';

/**
 * Admin client for inserting into document_fingerprints table.
 * This table may have RLS, so we use service role to guarantee writes.
 */
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, serviceKey || anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

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

    // Verify document belongs to user (using their token for RLS)
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

    // Store using admin client to bypass RLS on document_fingerprints
    const adminClient = getAdminClient();

    // Upsert: delete any existing fingerprint for this document first, then insert
    await adminClient.from('document_fingerprints').delete().eq('document_id', documentId);
    
    const { error: insertError } = await adminClient
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
