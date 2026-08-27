import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { GENRES, type Genre, type BucketItem, type BucketItemUpdate } from '../types/bucketItem'

interface EditDreamModalProps {
  item: BucketItem | null
  onClose: () => void
  onSubmit: (id: string, updates: BucketItemUpdate) => Promise<{ error: string | null }>
}

export function EditDreamModal({ item, onClose, onSubmit }: EditDreamModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState<Genre | null>(null)
  const [titleTouched, setTitleTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Re-seed the form whenever a different item is opened for editing.
  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setDescription(item.description ?? '')
      setGenre(item.genre)
      setTitleTouched(false)
      setError(null)
    }
  }, [item])

  function handleClose() {
    if (submitting) return
    onClose()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTitleTouched(true)

    if (!item || !title.trim() || !genre) {
      return
    }

    setSubmitting(true)
    setError(null)

    const result = await onSubmit(item.id, {
      title: title.trim(),
      description: description.trim() || null,
      genre,
    })

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onClose()
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dream-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <h2 id="edit-dream-title" className="text-lg font-semibold text-neutral-900">
                Edit this dream
              </h2>
              <button
                onClick={handleClose}
                type="button"
                aria-label="Close"
                className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="edit-dream-title-input" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  What's the dream?
                </label>
                <input
                  id="edit-dream-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setTitleTouched(true)}
                  placeholder="e.g. See the Northern Lights"
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                />
                {titleTouched && !title.trim() && (
                  <p className="mt-1 text-xs text-red-600">Every dream needs a name.</p>
                )}
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                  What's the vibe?
                </span>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGenre(g.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        genre === g.id
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      <span aria-hidden="true">{g.emoji}</span> {g.label}
                    </button>
                  ))}
                </div>
                {titleTouched && !genre && (
                  <p className="mt-1.5 text-xs text-red-600">Pick a vibe for this one.</p>
                )}
              </div>

              <div>
                <label htmlFor="edit-dream-description" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Anything else?
                </label>
                <textarea
                  id="edit-dream-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Optional details..."
                  className="w-full resize-none rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}