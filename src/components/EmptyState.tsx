import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  variant: 'no-dreams' | 'no-results'
  onAddDream?: () => void
}

export function EmptyState({ variant, onAddDream }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 px-6 py-16 text-center"
    >
      {variant === 'no-dreams' ? (
        <>
          <p className="text-lg font-medium text-neutral-900">
            Your bucket is suspiciously empty 👀
          </p>
          <p className="text-sm text-neutral-500">Go put some chaos in it.</p>
          {onAddDream && (
            <button
              onClick={onAddDream}
              type="button"
              className="mt-3 flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <Plus size={16} />
              Add your first dream
            </button>
          )}
        </>
      ) : (
        <>
          <p className="text-lg font-medium text-neutral-900">Nothing here yet.</p>
          <p className="text-sm text-neutral-500">Try another search or genre.</p>
        </>
      )}
    </motion.div>
  )
}