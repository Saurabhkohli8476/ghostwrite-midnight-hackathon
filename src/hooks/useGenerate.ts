'use client';

import { useState } from 'react';
import type { GenerateResponse } from '@/types';
import { supabase } from '@/lib/supabase';

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerateResponse | null>(null);

  const generate = async (jobDescription: string, userExperience: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ jobDescription, userExperience })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate document');
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, data };
}
