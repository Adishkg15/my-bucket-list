import { AnimatePresence, motion } from 'framer-motion'
import type { BucketItem as BucketItemType } from '../types/bucketItem'
import { BucketItem } from './BucketItem'
import { EmptyState } from './EmptyState'
import { LoadingSkeleton } from './LoadingSkeleton'

interface BucketListProps {
  items: BucketItemType[]
  loading: boolean
  hasAnyItems: boolean
  onToggle: (id: string, completed: boolean) => void
  onEdit: (item: BucketItemType) => void
  onDeleteRequest: (item: BucketItemType) => void
  onAddFirstDream: () => void
}

export function BucketList({
  items,
  loading,
  hasAnyItems,
  onToggle,
  onEdit,
  onDeleteRequest,
  onAddFirstDream,
}: BucketListProps) {
  if (loading) {
    return <LoadingSkeleton />
  }

  if (items.length === 0) {
    return hasAnyItems ? (
      <EmptyState variant="no-results" />
    ) : (
      <EmptyState variant="no-dreams" onAddDream={onAddFirstDream} />
    )
  }

  return (
    <motion.ul layout className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <BucketItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onEdit={onEdit}
            onDeleteRequest={onDeleteRequest}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}