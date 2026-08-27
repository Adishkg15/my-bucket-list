interface ProgressCardProps {
  total: number
  completed: number
}

export function ProgressCard({ total, completed }: ProgressCardProps) {
  const remaining = total - completed
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-neutral-600">
          <span>
            <span className="font-semibold text-neutral-900">{total}</span> dream
            {total === 1 ? '' : 's'}
          </span>
          <span>
            <span className="font-semibold text-neutral-900">{completed}</span> completed
          </span>
          <span>
            <span className="font-semibold text-neutral-900">{remaining}</span> left
          </span>
        </div>
        <span className="text-sm font-semibold text-neutral-900">{percent}% complete</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-neutral-900 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}