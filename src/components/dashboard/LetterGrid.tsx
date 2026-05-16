'use client';

import type { CoverLetter } from '@/types';
import LetterCard from '@/components/dashboard/LetterCard';

interface LetterGridProps {
  letters: CoverLetter[];
}

export default function LetterGrid({ letters }: LetterGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {letters.map((letter) => (
        <LetterCard key={letter.id} letter={letter} />
      ))}
    </div>
  );
}
