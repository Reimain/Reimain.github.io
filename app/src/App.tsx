import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import AuroraBackground from './sections/AuroraBackground'
import GlassEditor from './sections/GlassEditor'
import Toolbar from './sections/Toolbar'
import StatsBar from './sections/StatsBar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useWritingStats } from './hooks/useWritingStats'
import { FONTS, GOALS, MOODS } from './types'

const MILESTONES: { at: number; msg: string }[] = [
  { at: 100, msg: '✦ 100 words — the ice is broken, keep pouring' },
  { at: 250, msg: '✦ 250 words — you’re finding the current' },
  { at: 500, msg: '✦ 500 words — half a page of pure flow' },
  { at: 750, msg: '✦ 750 words — morning pages, conquered' },
  { at: 1000, msg: '✦ 1,000 words — a thousand tiny decisions, made' },
  { at: 1500, msg: '✦ 1,500 words — this is becoming something real' },
  { at: 2500, msg: '✦ 2,500 words — novelist territory' },
  { at: 5000, msg: '✦ 5,000 words — absolute legend. Hydrate!' },
]

export default function App() {
  const [title, setTitle] = useLocalStorage<string>('inkflow:title', '')
  const [body, setBody, bodySaved] = useLocalStorage<string>('inkflow:body', '')
  const [fontId, setFontId] = useLocalStorage<string>('inkflow:font', 'lora')
  const [fontSize, setFontSize] = useLocalStorage<number>('inkflow:size', 1.25)
  const [moodId, setMoodId] = useLocalStorage<string>('inkflow:mood', 'aurora')
  const [goalIdx, setGoalIdx] = useLocalStorage<number>('inkflow:goal', 1)
  const [typewriter, setTypewriter] = useLocalStorage<boolean>('inkflow:typewriter', true)
  const [dropcap, setDropcap] = useLocalStorage<boolean>('inkflow:dropcap', true)

  const [focus, setFocus] = useState(false)
  const [copied, setCopied] = useState(false)
  const [boost, setBoost] = useState(false)
  const [toast, setToast] = useState<{ id: number; msg: string; leaving?: boolean } | null>(null)

  const [lastKeystroke, setLastKeystroke] = useState(Date.now())
  const stats = useWritingStats(body, lastKeystroke)
  const prevWords = useRef(stats.words)
  const boostTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mood = MOODS.find((m) => m.id === moodId) ?? MOODS[0]
  const font = FONTS.find((f) => f.id === fontId) ?? FONTS[0]
  const goal = GOALS[goalIdx % GOALS.length]

  /* keystroke → aurora brightens in response */
  const onKeystroke = useCallback(() => {
    setLastKeystroke(Date.now())
    setBoost(true)
    if (boostTimer.current) clearTimeout(boostTimer.current)
    boostTimer.current = setTimeout(() => setBoost(false), 900)
  }, [])

  /* milestone celebrations */
  useEffect(() => {
    const prev = prevWords.current
    const hit = MILESTONES.find((m) => prev < m.at && stats.words >= m.at)
    if (hit) {
      setToast({ id: Date.now(), msg: hit.msg })
    }
    prevWords.current = stats.words
  }, [stats.words])

  useEffect(() => {
    if (!toast || toast.leaving) return
    const t1 = setTimeout(() => setToast((t) => (t ? { ...t, leaving: true } : t)), 3200)
    const t2 = setTimeout(() => setToast(null), 3700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [toast])

  const markdown = useCallback(() => {
    const t = title.trim()
    return `${t ? `# ${t}\n\n` : ''}${body.trim()}\n`
  }, [title, body])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  const exportMd = () => {
    const blob = new Blob([markdown()], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.trim().replace(/[^\w\d]+/g, '-').toLowerCase() || 'inkflow-draft'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const cycleFont = () => {
    const i = FONTS.findIndex((f) => f.id === fontId)
    setFontId(FONTS[(i + 1) % FONTS.length].id)
  }

  const cssVars = {
    ...mood.vars,
    '--ink-font': font.css,
    '--ink-size': `${fontSize}rem`,
  } as CSSProperties

  return (
    <div
      className={`relative flex h-dvh flex-col overflow-hidden ${focus ? 'focus-on' : ''}`}
      style={cssVars}
    >
      <AuroraBackground boost={boost} />

      {/* header */}
      <header className="relative z-20 flex items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="ui-chrome flex items-baseline gap-2">
          <span
            className="text-lg font-semibold tracking-tight text-white sm:text-xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Inkflow
          </span>
          <span className="hidden text-[11px] italic text-white/40 sm:inline">
            where words flow like water
          </span>
        </div>
        <Toolbar
          fontId={fontId}
          fontSize={fontSize}
          typewriter={typewriter}
          focus={focus}
          dropcap={dropcap}
          moodId={moodId}
          copied={copied}
          onCycleFont={cycleFont}
          onFontSize={(d) => setFontSize(Math.min(1.75, Math.max(1, fontSize + d * 0.1)))}
          onToggleTypewriter={() => setTypewriter(!typewriter)}
          onToggleFocus={() => setFocus((v) => !v)}
          onToggleDropcap={() => setDropcap(!dropcap)}
          onMood={setMoodId}
          onCopy={copy}
          onExport={exportMd}
        />
      </header>

      {/* editor */}
      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-[52rem] flex-1 flex-col px-3 pb-3 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
        <GlassEditor
          title={title}
          initialBody={body}
          typewriter={typewriter}
          dropcap={dropcap}
          onTitle={setTitle}
          onBody={setBody}
          onKeystroke={onKeystroke}
        />
      </main>

      {/* footer */}
      <footer className="relative z-20 flex items-center justify-between gap-3 px-4 pb-4 sm:px-6 sm:pb-5">
        <StatsBar
          stats={stats}
          goal={goal}
          savedPulse={bodySaved}
          onCycleGoal={() => setGoalIdx(goalIdx + 1)}
        />
        <p className="ui-chrome hidden text-[11px] text-white/35 md:block">
          goal {goal.toLocaleString()} words · tap the ring to change ·{' '}
          {focus ? 'move the mouse to surface' : 'focus mode melts the chrome'}
        </p>
      </footer>

      {/* milestone toast */}
      {toast && (
        <div
          key={toast.id}
          className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 ${
            toast.leaving ? 'toast-leave' : 'toast-pop'
          }`}
        >
          <div className="stat-chip rounded-full px-5 py-2.5 text-sm text-white shadow-2xl">
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}
