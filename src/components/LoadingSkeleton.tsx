export function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading your dreams">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50"
        />
      ))}
    </div>
  )
}