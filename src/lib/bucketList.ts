import { supabase } from './supabase'
import type { BucketItem, NewBucketItem, BucketItemUpdate } from '../types/bucketItem'

export interface ServiceResult<T> {
  data: T | null
  error: string | null
}

// Every mutation needs to know who's asking. We always ask Supabase for the
// authenticated user rather than accepting one from the caller — the RLS
// policies enforce this server-side too, but resolving it here means we
// never even attempt a request with a user_id we can't back up, and we can
// fail with a clear message before hitting the network for the real query.
async function getCurrentUserId(): Promise<{ userId: string | null; error: string | null }> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return { userId: null, error: 'You need to be signed in to do that.' }
  }
  return { userId: data.user.id, error: null }
}

// Supabase errors carry codes/details useful for logs but not for a user
// to read. Log the raw error, return something human-readable.
function toServiceError(context: string, error: { message: string } | null): string {
  if (error) {
    console.error(`[bucketList] ${context}:`, error)
  }
  return `Something went wrong ${context}. Try again.`
}

export async function getBucketItems(): Promise<ServiceResult<BucketItem[]>> {
  const { userId, error: authError } = await getCurrentUserId()
  if (!userId) return { data: null, error: authError }

  // RLS already restricts rows to this user, but filtering explicitly keeps
  // the query's intent clear and avoids depending on RLS alone for
  // correctness (only for security, which is RLS's job).
  const { data, error } = await supabase
    .from('bucket_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: toServiceError('loading your dreams', error) }
  }
  return { data: data as BucketItem[], error: null }
}

export async function addBucketItem(
  item: NewBucketItem
): Promise<ServiceResult<BucketItem>> {
  const { userId, error: authError } = await getCurrentUserId()
  if (!userId) return { data: null, error: authError }

  const { data, error } = await supabase
    .from('bucket_items')
    .insert({
      user_id: userId,
      title: item.title,
      description: item.description ?? null,
      genre: item.genre,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: toServiceError('saving that dream', error) }
  }
  return { data: data as BucketItem, error: null }
}

export async function updateBucketItem(
  id: string,
  updates: BucketItemUpdate
): Promise<ServiceResult<BucketItem>> {
  const { userId, error: authError } = await getCurrentUserId()
  if (!userId) return { data: null, error: authError }

  // .eq('user_id', userId) here is belt-and-braces — RLS's `using` clause
  // already blocks updates to rows this user doesn't own — but it means a
  // mistaken id never even matches a row to attempt.
  const { data, error } = await supabase
    .from('bucket_items')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return { data: null, error: toServiceError('updating that dream', error) }
  }
  return { data: data as BucketItem, error: null }
}

export async function deleteBucketItem(id: string): Promise<ServiceResult<null>> {
  const { userId, error: authError } = await getCurrentUserId()
  if (!userId) return { data: null, error: authError }

  const { error } = await supabase
    .from('bucket_items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return { data: null, error: toServiceError('deleting that dream', error) }
  }
  return { data: null, error: null }
}

export async function toggleBucketItem(
  id: string,
  completed: boolean
): Promise<ServiceResult<BucketItem>> {
  const { userId, error: authError } = await getCurrentUserId()
  if (!userId) return { data: null, error: authError }

  const { data, error } = await supabase
    .from('bucket_items')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return { data: null, error: toServiceError('updating that dream', error) }
  }
  return { data: data as BucketItem, error: null }
}