export default function Loading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-purple-500" />
      </div>
    </div>
  );
}
