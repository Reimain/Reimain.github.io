import type { WritingStats } from '../hooks/useWritingStats'

type Props = {
  stats: WritingStats
  goal: number
  /** flashes true right after the draft is written to storage */
  savedPulse: boolean
  onCycleGoal: () => void
}

const R = 15
const C = 2 * Math.PI * R

export default function StatsBar({ stats, goal, savedPulse, onCycleGoal }: Props) {
  const pct = Math.min(1, goal > 0 ? stats.words / goal : 0)
  const done = pct >= 1

  return (
    <div className="ui-chrome flex items-center gap-2 sm:gap-3">
      {/* goal ring — tap to cycle targets */}
      <button
        type="button"
        onClick={onCycleGoal}
        title={`${stats.words.toLocaleString()} of ${goal.toLocaleString()} words — tap to change goal`}
        aria-label={`Word goal ${goal}. ${Math.round(pct * 100)} percent complete. Tap to change.`}
        className="stat-chip relative flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
      >
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2.5"
          />
          <circle
            className="goal-ring"
            cx="18"
            cy="18"
            r={R}
            fill="none"
            stroke={done ? 'var(--accent)' : 'var(--blob-d)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
          />
        </svg>
        <span className="absolute text-[10px] font-medium tabular-nums text-white/80">
          {done ? '✓' : `${Math.round(pct * 100)}`}
        </span>
      </button>

      {/* counters */}
      <div className="stat-chip flex items-center gap-3 rounded-full px-3.5 py-2 text-[11px] text-white/70">
        <span className="tabular-nums text-white/90">
          <strong className="font-semibold">{stats.words.toLocaleString()}</strong> words
        </span>
        <span className="hidden tabular-nums sm:inline">
          {stats.chars.toLocaleString()} chars
        </span>
        <span className="hidden tabular-nums md:inline">
          {stats.readMinutes > 0 ? `${stats.readMinutes} min read` : '—'}
        </span>
        <span className="hidden tabular-nums lg:inline">
          {stats.wpm > 0 ? `${stats.wpm} wpm` : 'warming up'}
        </span>

        {/* save state */}
        <span className="flex items-center gap-1.5">
          <span
            className="save-dot h-1.5 w-1.5 rounded-full"
            style={{
              background: savedPulse ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
              boxShadow: savedPulse ? '0 0 10px var(--accent)' : 'none',
            }}
          />
          <span className="hidden text-white/45 sm:inline">
            {savedPulse ? 'saved' : stats.typing ? 'writing…' : 'idle'}
          </span>
        </span>
      </div>
    </div>
  )
}
