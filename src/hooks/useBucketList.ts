import { useCallback, useEffect, useState } from 'react'
import {
  getBucketItems,
  addBucketItem,
  updateBucketItem,
  deleteBucketItem,
  toggleBucketItem,
} from '../lib/bucketList'
import type { BucketItem, NewBucketItem, BucketItemUpdate } from '../types/bucketItem'

interface OpResult {
  error: string | null
}

export function useBucketList(userId: string | null) {
  const [items, setItems] = useState<BucketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getBucketItems().then((result) => {
      if (cancelled) return
      if (result.error) {
        setError(result.error)
      } else {
        setItems(result.data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [userId])

  const addItem = useCallback(async (input: NewBucketItem): Promise<OpResult> => {
    setError(null)
    const result = await addBucketItem(input)
    if (result.error || !result.data) {
      setError(result.error)
      return { error: result.error }
    }
    // Newest first, matching the service layer's created_at ordering —
    // no refetch needed.
    setItems((prev) => [result.data as BucketItem, ...prev])
    return { error: null }
  }, [])

  const editItem = useCallback(
    async (id: string, updates: BucketItemUpdate): Promise<OpResult> => {
      setError(null)
      const result = await updateBucketItem(id, updates)
      if (result.error || !result.data) {
        setError(result.error)
        return { error: result.error }
      }
      const updated = result.data
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return { error: null }
    },
    []
  )

  const deleteItem = useCallback(async (id: string): Promise<OpResult> => {
    setError(null)
    const result = await deleteBucketItem(id)
    if (result.error) {
      setError(result.error)
      return { error: result.error }
    }
    setItems((prev) => prev.filter((item) => item.id !== id))
    return { error: null }
  }, [])

  const toggleItem = useCallback(
    async (id: string, completed: boolean): Promise<OpResult> => {
      setError(null)
      // Optimistic update: flip it immediately so the checkbox feels
      // instant, keep the previous snapshot in case the request fails.
      let previous: BucketItem[] = []
      setItems((prev) => {
        previous = prev
        return prev.map((item) =>
          item.id === id
            ? {
                ...item,
                completed,
                completed_at: completed ? new Date().toISOString() : null,
              }
            : item
        )
      })

      const result = await toggleBucketItem(id, completed)
      if (result.error || !result.data) {
        // Revert on failure.
        setItems(previous)
        setError(result.error)
        return { error: result.error }
      }

      // Reconcile with the server's actual completed_at value.
      const updated = result.data
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return { error: null }
    },
    []
  )

  return { items, loading, error, addItem, editItem, deleteItem, toggleItem }
}