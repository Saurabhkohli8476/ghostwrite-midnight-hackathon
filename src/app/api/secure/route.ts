import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateHash } from '@/lib/hash';
import { storeHash } from '@/lib/midnight';

export async function POST(request: Request) {
  try {
    // Extract token from Authorization header if present
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const supabase = createServerSupabaseClient(token);
    
    // Authenticate user server-side
    const { data: { user }, error: authError } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { letterText, letterId } = body;

    if (!letterText || !letterId) {
      return NextResponse.json({ error: 'Missing letterText or letterId' }, { status: 400 });
    }

    // Generate SHA-256 hash of the letter text
    const hash = await generateHash(letterText);
    
    // Generate fake Midnight transaction ID
    const { txId } = await storeHash(hash);
    const timestamp = new Date().toISOString();

    // Update Supabase cover_letters row
    const { data, error } = await supabase
      .from('cover_letters')
      .update({
        midnight_hash: hash,
        midnight_tx: txId,
        is_secured: true,
        secured_at: timestamp
      })
      .eq('id', letterId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Letter not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({
      hash,
      txId,
      timestamp,
      network: 'midnight-preprod',
      verified: true
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
