import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    
    if (!hash) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('midnight_hash', hash)
      .eq('is_secured', true)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ verified: false }, { status: 404 });
    }

    return NextResponse.json({
      verified: true,
      hash: data.midnight_hash,
      txId: data.midnight_tx || 'mock_tx_id',
      timestamp: data.secured_at || data.created_at,
      network: 'midnight-preprod',
      contentType: 'GhostWrite Document',
      creatorIdentity: 'Protected',
      securedAt: data.secured_at || data.created_at,
    });
  } catch (err: any) {
    console.error('Error verifying hash:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during verification.' },
      { status: 500 }
    );
  }
}
