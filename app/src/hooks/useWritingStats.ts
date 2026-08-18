import { useEffect, useMemo, useRef, useState } from 'react'

export type WritingStats = {
  words: number
  chars: number
  sentences: number
  paragraphs: number
  /** estimated reading time in minutes (rounded up, min 1 once writing starts) */
  readMinutes: number
  /** words per minute across the active part of this session */
  wpm: number
  /** true while keystrokes are still landing */
  typing: boolean
  /** seconds of active writing in this session */
  activeSeconds: number
}

const IDLE_AFTER_MS = 4000

const countWords = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

/**
 * Derives live counts from the draft. `lastKeystroke` lets the hook tell
 * "actively writing" apart from "the tab is just open", so WPM reflects
 * time spent writing rather than time spent staring.
 */
export function useWritingStats(body: string, lastKeystroke: number): WritingStats {
  const [now, setNow] = useState(() => Date.now())
  const activeSeconds = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastKeystroke < IDLE_AFTER_MS) activeSeconds.current += 1
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(id)
  }, [lastKeystroke])

  const typing = now - lastKeystroke < IDLE_AFTER_MS

  return useMemo(() => {
    const words = countWords(body)
    const chars = body.length
    const sentences = (body.match(/[^\s][^.!?]*[.!?]+/g) ?? []).length
    const paragraphs = body
      .split(/\n{2,}/)
      .filter((p) => p.trim().length > 0).length
    const readMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 220))
    const minutes = activeSeconds.current / 60
    const wpm = minutes >= 0.25 ? Math.round(words / minutes) : 0

    return {
      words,
      chars,
      sentences,
      paragraphs,
      readMinutes,
      wpm,
      typing,
      activeSeconds: activeSeconds.current,
    }
    /* `now` ticks the clock so WPM and the idle state refresh each second */
  }, [body, typing, now])
}
