import type { ReactNode } from 'react'
import { GENRES, type Genre } from '../types/bucketItem'

interface GenreFilterProps {
  selected: Genre | 'all'
  onSelect: (genre: Genre | 'all') => void
}

export function GenreFilter({ selected, onSelect }: GenreFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by genre"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      <FilterPill active={selected === 'all'} onClick={() => onSelect('all')}>
        All
      </FilterPill>
      {GENRES.map((genre) => (
        <FilterPill
          key={genre.id}
          active={selected === genre.id}
          onClick={() => onSelect(genre.id)}
        >
          <span aria-hidden="true">{genre.emoji}</span> {genre.label}
        </FilterPill>
      ))}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      type="button"
      className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
        active
          ? 'border-neutral-900 bg-neutral-900 text-white'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {children}
    </button>
  )
}