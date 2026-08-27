import { motion } from 'framer-motion'
import { Check, Pencil, Trash2 } from 'lucide-react'
import type { BucketItem as BucketItemType } from '../types/bucketItem'
import { GENRES } from '../types/bucketItem'

interface BucketItemProps {
  item: BucketItemType
  onToggle: (id: string, completed: boolean) => void
  onEdit: (item: BucketItemType) => void
  onDeleteRequest: (item: BucketItemType) => void
}

export function BucketItem({ item, onToggle, onEdit, onDeleteRequest }: BucketItemProps) {
  const genre = GENRES.find((g) => g.id === item.genre)

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition ${
        item.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => onToggle(item.id, !item.completed)}
        type="button"
        aria-label={item.completed ? 'Mark as not completed' : 'Mark as completed'}
        aria-pressed={item.completed}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          item.completed
            ? 'border-neutral-900 bg-neutral-900 text-white'
            : 'border-neutral-300 text-transparent hover:border-neutral-400'
        }`}
      >
        <motion.span
          initial={false}
          animate={{ scale: item.completed ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <Check size={14} strokeWidth={3} />
        </motion.span>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`break-words text-sm font-medium text-neutral-900 sm:text-base ${
            item.completed ? 'text-neutral-400 line-through' : ''
          }`}
        >
          {item.title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {genre && (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
              <span aria-hidden="true">{genre.emoji}</span>
              {genre.label}
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-1.5 break-words text-xs text-neutral-500 sm:text-sm">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEdit(item)}
          type="button"
          aria-label="Edit dream"
          className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDeleteRequest(item)}
          type="button"
          aria-label="Delete dream"
          className="rounded-full p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.li>
  )
}