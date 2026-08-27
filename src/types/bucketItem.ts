// Genres are defined once here as the single source of truth. The `id` is
// what's actually stored in the `genre` column (and matches the database
// CHECK constraint in supabase/schema.sql) — `label` and `emoji` are for
// the UI to reuse later without hardcoding genre strings everywhere.
export const GENRES = [
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'adventure', label: 'Adventure', emoji: '🧗' },
  { id: 'career', label: 'Career', emoji: '💻' },
  { id: 'money', label: 'Money', emoji: '💰' },
  { id: 'relationships', label: 'Relationships', emoji: '❤️' },
  { id: 'skills', label: 'Skills', emoji: '🧠' },
  { id: 'health', label: 'Health', emoji: '🏋️' },
  { id: 'creativity', label: 'Creativity', emoji: '🎨' },
  { id: 'random_af', label: 'Random AF', emoji: '🤪' },
] as const

export type Genre = (typeof GENRES)[number]['id']

// A bucket item exactly as it comes back from the `bucket_items` table.
export interface BucketItem {
  id: string
  user_id: string
  title: string
  description: string | null
  genre: Genre
  completed: boolean
  created_at: string
  completed_at: string | null
}

// Fields the caller supplies when creating a new item — id/user_id/completed/
// timestamps are all set by the database or the service layer.
export interface NewBucketItem {
  title: string
  description?: string | null
  genre: Genre
}

// Fields that can be changed via edit — everything optional since it's a
// partial update.
export interface BucketItemUpdate {
  title?: string
  description?: string | null
  genre?: Genre
}