'use client';

import Skeleton from '@/components/ui/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton variant="title" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
        <Skeleton variant="button" className="w-40" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    </div>
  );
}
