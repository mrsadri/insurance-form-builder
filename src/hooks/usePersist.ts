// useState-like hook that automatically reads from and writes to localStorage under the given key.
import { useState } from 'react'

type Updater<T> = T | ((prev: T) => T)

export function usePersist<T>(key: string, initial: T): [T, (v: Updater<T>) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initial
    } catch {
      return initial
    }
  })

  const set = (v: Updater<T>) => {
    setValue(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
      try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }

  return [value, set]
}
