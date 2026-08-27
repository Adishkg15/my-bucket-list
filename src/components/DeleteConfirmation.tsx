import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { BucketItem } from '../types/bucketItem'

interface DeleteConfirmationProps {
  item: BucketItem | null
  onCancel: () => void
  onConfirm: (id: string) => Promise<{ error: string | null }>
}

export function DeleteConfirmation({ item, onCancel, onConfirm }: DeleteConfirmationProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleCancel() {
    if (deleting) return
    setError(null)
    onCancel()
  }

  async function handleConfirm() {
    if (!item) return
    setDeleting(true)
    setError(null)

    const result = await onConfirm(item.id)

    setDeleting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    // On success the parent clears `item`, which unmounts this dialog.
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dream-title"
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
          >
            <h2 id="delete-dream-title" className="text-base font-semibold text-neutral-900">
              Really letting this dream go? 👀
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500">"{item.title}"</p>

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleCancel}
                type="button"
                disabled={deleting}
                className="flex-1 rounded-full border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 disabled:opacity-60"
              >
                Keep it
              </button>
              <button
                onClick={handleConfirm}
                type="button"
                disabled={deleting}
                className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}