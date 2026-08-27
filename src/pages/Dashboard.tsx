import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useBucketList } from '../hooks/useBucketList'
import { Navbar } from '../components/Navbar'
import { ProgressCard } from '../components/ProgressCard'
import { SearchBar } from '../components/SearchBar'
import { GenreFilter } from '../components/GenreFilter'
import { BucketList } from '../components/BucketList'
import { AddDreamModal } from '../components/AddDreamModal'
import { EditDreamModal } from '../components/EditDreamModal'
import { DeleteConfirmation } from '../components/DeleteConfirmation'
import type { BucketItem, Genre } from '../types/bucketItem'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { items, loading, addItem, editItem, deleteItem, toggleItem } = useBucketList(
    user?.id ?? null
  )

  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState<Genre | 'all'>('all')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BucketItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<BucketItem | null>(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesGenre = genreFilter === 'all' || item.genre === genreFilter
      if (!matchesGenre) return false
      if (!query) return true
      return (
        item.title.toLowerCase().includes(query) ||
        (item.description ?? '').toLowerCase().includes(query)
      )
    })
  }, [items, search, genreFilter])

  const completedCount = useMemo(() => items.filter((item) => item.completed).length, [items])

  // Guaranteed by ProtectedRoute, but keep TypeScript honest.
  if (!user) return null

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    (user.user_metadata?.name as string | undefined)?.split(' ')[0] ??
    user.email?.split('@')[0] ??
    'there'

  async function handleDelete(id: string) {
    const result = await deleteItem(id)
    if (!result.error) {
      setDeletingItem(null)
    }
    return result
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <Navbar user={user} onLogout={signOut} />

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
            Hey {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-500">your life, but make it interesting.</p>
        </div>

        <ProgressCard total={items.length} completed={completedCount} />

        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} />
          <GenreFilter selected={genreFilter} onSelect={setGenreFilter} />
        </div>

        <BucketList
          items={filteredItems}
          loading={loading}
          hasAnyItems={items.length > 0}
          onToggle={toggleItem}
          onEdit={setEditingItem}
          onDeleteRequest={setDeletingItem}
          onAddFirstDream={() => setAddModalOpen(true)}
        />
      </main>

      <button
        onClick={() => setAddModalOpen(true)}
        type="button"
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3.5 text-sm font-medium text-white shadow-lg transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        <Plus size={18} />
        Add Dream
      </button>

      <AddDreamModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={addItem}
      />

      <EditDreamModal item={editingItem} onClose={() => setEditingItem(null)} onSubmit={editItem} />

      <DeleteConfirmation
        item={deletingItem}
        onCancel={() => setDeletingItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}