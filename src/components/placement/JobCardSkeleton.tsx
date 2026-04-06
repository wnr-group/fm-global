export function JobCardSkeleton() {
  return (
    <div className="bg-background rounded-2xl border border-border p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-secondary rounded w-3/4 mb-2" />
          <div className="h-4 bg-secondary rounded w-1/2" />
        </div>
        <div className="h-6 bg-secondary rounded-full w-16 ml-3 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="h-3.5 w-3.5 bg-secondary rounded-full flex-shrink-0" />
        <div className="h-4 bg-secondary rounded w-1/3" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3.5 bg-secondary rounded w-full" />
        <div className="h-3.5 bg-secondary rounded w-5/6" />
        <div className="h-3.5 bg-secondary rounded w-4/6" />
      </div>
      <div className="h-4 bg-secondary rounded w-24 mt-auto" />
    </div>
  );
}
