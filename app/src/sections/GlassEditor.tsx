import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { CSSProperties, FormEvent, KeyboardEvent } from 'react'

type Props = {
  title: string
  /** seeded once — the editors stay uncontrolled so the caret never jumps */
  initialBody: string
  typewriter: boolean
  dropcap: boolean
  onTitle: (v: string) => void
  onBody: (v: string) => void
  onKeystroke: () => void
}

const BUBBLES = 9

export default function GlassEditor({
  title,
  initialBody,
  typewriter,
  dropcap,
  onTitle,
  onBody,
  onKeystroke,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const seeded = useRef(false)

  /* seed from storage exactly once */
  useLayoutEffect(() => {
    if (seeded.current) return
    seeded.current = true
    if (titleRef.current) titleRef.current.textContent = title
    if (bodyRef.current) bodyRef.current.textContent = initialBody
  }, [title, initialBody])

  /* typewriter mode — hold the caret near the vertical middle */
  const centerCaret = () => {
    const scroller = scrollRef.current
    if (!typewriter || !scroller) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return

    const range = sel.getRangeAt(0).cloneRange()
    range.collapse(true)
    let rect = range.getClientRects()[0]
    if (!rect) {
      const probe = document.createElement('span')
      probe.textContent = '​'
      range.insertNode(probe)
      rect = probe.getBoundingClientRect()
      probe.remove()
    }
    if (!rect) return

    const box = scroller.getBoundingClientRect()
    const delta = rect.top - (box.top + box.height * 0.42)
    if (Math.abs(delta) > 4) scroller.scrollTop += delta
  }

  const handleBody = (e: FormEvent<HTMLDivElement>) => {
    onBody(e.currentTarget.textContent ?? '')
    onKeystroke()
    centerCaret()
  }

  const handleTitle = (e: FormEvent<HTMLHeadingElement>) => {
    onTitle(e.currentTarget.textContent ?? '')
    onKeystroke()
  }

  /* Enter in the title drops into the body instead of making a new line */
  const titleKeys = (e: KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      bodyRef.current?.focus()
    }
  }

  /* paste as plain text so the page keeps its own typography */
  useEffect(() => {
    const nodes = [titleRef.current, bodyRef.current]
    const onPaste = (e: Event) => {
      const ev = e as ClipboardEvent
      ev.preventDefault()
      const text = ev.clipboardData?.getData('text/plain') ?? ''
      document.execCommand('insertText', false, text)
    }
    nodes.forEach((n) => n?.addEventListener('paste', onPaste))
    return () => nodes.forEach((n) => n?.removeEventListener('paste', onPaste))
  }, [])

  useEffect(() => {
    if (typewriter) centerCaret()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typewriter])

  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLES }, (_, i) => {
        const size = 6 + ((i * 7) % 16)
        return {
          key: i,
          style: {
            left: `${6 + ((i * 11) % 88)}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${14 + ((i * 5) % 13)}s`,
            animationDelay: `${(i * 1.7) % 12}s`,
          } as CSSProperties,
        }
      }),
    [],
  )

  return (
    <section className="glass-panel flex min-h-0 flex-1 flex-col">
      {/* liquid layer behind the words */}
      <div className="water-layer" aria-hidden="true">
        <div className="water-pool" />
        {bubbles.map((b) => (
          <span key={b.key} className="bubble" style={b.style} />
        ))}
      </div>

      <div
        ref={scrollRef}
        className={`ink-scroll relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-8 sm:px-12 sm:pb-14 sm:pt-12 ${
          dropcap ? 'dropcap' : ''
        }`}
        onClick={() => bodyRef.current?.focus()}
      >
        <div className="mx-auto w-full" style={{ maxWidth: 'var(--ink-measure)' }}>
          <h1
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Title"
            spellCheck
            className="ink-title mb-5 text-3xl font-semibold sm:mb-7 sm:text-5xl"
            onInput={handleTitle}
            onKeyDown={titleKeys}
            onClick={(e) => e.stopPropagation()}
          />

          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Draft"
            spellCheck
            data-placeholder="Start anywhere. The first sentence is allowed to be bad…"
            className="ink-editor min-h-[40vh]"
            onInput={handleBody}
            onKeyUp={centerCaret}
            onClick={(e) => e.stopPropagation()}
          />

          {/* runway so the caret can stay centred at the end of the draft */}
          {typewriter && <div className="h-[38vh]" aria-hidden="true" />}
        </div>
      </div>
    </section>
  )
}
