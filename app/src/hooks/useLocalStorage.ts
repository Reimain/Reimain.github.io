import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Persisted state with a debounced write and a short-lived "saved" pulse
 * so the UI can flash a confirmation dot without extra plumbing.
 *
 * Returns [value, setValue, savedPulse]
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (next: T) => void, boolean] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  const [saved, setSaved] = useState(false)
  const first = useRef(true)
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    /* don't announce a save for the value we just read back */
    if (first.current) {
      first.current = false
      return
    }
    if (writeTimer.current) clearTimeout(writeTimer.current)
    writeTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
        setSaved(true)
        if (pulseTimer.current) clearTimeout(pulseTimer.current)
        pulseTimer.current = setTimeout(() => setSaved(false), 1400)
      } catch {
        /* quota exceeded / private mode — keep writing in memory only */
      }
    }, 420)

    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current)
    }
  }, [key, value])

  useEffect(
    () => () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current)
    },
    [],
  )

  const set = useCallback((next: T) => setValue(next), [])

  return [value, set, saved]
}
