'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { CoverLetter } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface UseLettersResult {
  letters: CoverLetter[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLetters(): UseLettersResult {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchLetters = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedLetters: CoverLetter[] = (data || []).map((item) => ({
        id: item.id,
        userId: item.user_id,
        jobTitle: item.job_title,
        company: item.company,
        jobDescription: item.job_description,
        userExperience: item.user_experience,
        generatedLetter: item.generated_letter,
        midnightHash: item.midnight_hash,
        midnightTx: item.midnight_tx,
        isSecured: item.is_secured,
        securedAt: item.secured_at,
        createdAt: item.created_at,
      }));

      setLetters(mappedLetters);
    } catch (err: any) {
      console.error('Error fetching letters:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch cover letters'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchLetters();
      } else {
        setLetters([]);
        setLoading(false);
      }
    }
  }, [user, authLoading, fetchLetters]);

  return { letters, loading, error, refetch: fetchLetters };
}
