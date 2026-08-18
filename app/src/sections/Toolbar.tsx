import {
  Check,
  Copy,
  Download,
  Focus,
  Minus,
  PilcrowLeft,
  Plus,
  Type,
  AlignVerticalSpaceAround,
} from 'lucide-react'
import { FONTS, MOODS } from '../types'

type Props = {
  fontId: string
  fontSize: number
  typewriter: boolean
  focus: boolean
  dropcap: boolean
  moodId: string
  copied: boolean
  onCycleFont: () => void
  onFontSize: (direction: 1 | -1) => void
  onToggleTypewriter: () => void
  onToggleFocus: () => void
  onToggleDropcap: () => void
  onMood: (id: string) => void
  onCopy: () => void
  onExport: () => void
}

const pill =
  'pill-btn flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[11px] text-white/70'

export default function Toolbar({
  fontId,
  fontSize,
  typewriter,
  focus,
  dropcap,
  moodId,
  copied,
  onCycleFont,
  onFontSize,
  onToggleTypewriter,
  onToggleFocus,
  onToggleDropcap,
  onMood,
  onCopy,
  onExport,
}: Props) {
  const font = FONTS.find((f) => f.id === fontId) ?? FONTS[0]

  return (
    <div className="ui-chrome flex items-center gap-1.5 sm:gap-2">
      {/* mood swatches */}
      <div className="stat-chip hidden items-center gap-1.5 rounded-full px-2 py-1.5 sm:flex">
        {MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            title={m.name}
            aria-label={`${m.name} mood`}
            aria-pressed={m.id === moodId}
            onClick={() => onMood(m.id)}
            className={`h-4 w-4 rounded-full ring-offset-1 transition-transform duration-200 hover:scale-110 ${
              m.id === moodId ? 'scale-110 ring-2 ring-white/70' : 'ring-1 ring-white/20'
            }`}
            style={{ background: m.swatch }}
          />
        ))}
      </div>

      {/* typography */}
      <div className="stat-chip hidden items-center gap-1 rounded-full px-1.5 py-1 sm:flex">
        <button type="button" className={pill} onClick={onCycleFont} title="Cycle typeface">
          <Type className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">{font.name}</span>
        </button>
        <button
          type="button"
          className={pill}
          onClick={() => onFontSize(-1)}
          disabled={fontSize <= 1}
          title="Smaller text"
          aria-label="Smaller text"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={pill}
          onClick={() => onFontSize(1)}
          disabled={fontSize >= 1.75}
          title="Larger text"
          aria-label="Larger text"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* modes */}
      <div className="stat-chip flex items-center gap-1 rounded-full px-1.5 py-1">
        <button
          type="button"
          className={`${pill} ${typewriter ? 'active' : ''}`}
          onClick={onToggleTypewriter}
          aria-pressed={typewriter}
          title="Typewriter scrolling"
          aria-label="Typewriter scrolling"
        >
          <AlignVerticalSpaceAround className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={`${pill} ${dropcap ? 'active' : ''}`}
          onClick={onToggleDropcap}
          aria-pressed={dropcap}
          title="Drop cap"
          aria-label="Drop cap"
        >
          <PilcrowLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={`${pill} ${focus ? 'active' : ''}`}
          onClick={onToggleFocus}
          aria-pressed={focus}
          title="Focus mode"
          aria-label="Focus mode"
        >
          <Focus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* output */}
      <div className="stat-chip flex items-center gap-1 rounded-full px-1.5 py-1">
        <button
          type="button"
          className={`${pill} ${copied ? 'active' : ''}`}
          onClick={onCopy}
          title="Copy as Markdown"
          aria-label="Copy as Markdown"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="hidden lg:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <button
          type="button"
          className={pill}
          onClick={onExport}
          title="Download .md"
          aria-label="Download Markdown file"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Export</span>
        </button>
      </div>
    </div>
  )
}
