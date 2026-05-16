'use client';

import { useState } from 'react';
import type { SecureResponse } from '@/types';
import { supabase } from '@/lib/supabase';

export function useSecure() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SecureResponse | null>(null);

  const secure = async (letterText: string, letterId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('/api/secure', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ letterText, letterId })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to secure letter');
      }

      setResult(json);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { secure, loading, error, result };
}
