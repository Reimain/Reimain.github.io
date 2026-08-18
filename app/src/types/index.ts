import type { CSSProperties } from 'react'

/* ============================================================
   Shared vocabulary for the Inkflow editor
   ============================================================ */

export type Font = {
  id: string
  name: string
  /** value for the --ink-font custom property */
  css: string
}

export const FONTS: Font[] = [
  { id: 'lora', name: 'Lora', css: "'Lora', Georgia, serif" },
  { id: 'fraunces', name: 'Fraunces', css: "'Fraunces', Georgia, serif" },
  { id: 'grotesk', name: 'Space Grotesk', css: "'Space Grotesk', system-ui, sans-serif" },
  { id: 'mono', name: 'JetBrains Mono', css: "'JetBrains Mono', ui-monospace, monospace" },
]

/** daily word targets — tap the ring to cycle */
export const GOALS: number[] = [250, 500, 750, 1000, 1500, 2500]

export type Mood = {
  id: string
  name: string
  /** two-stop gradient used for the swatch button */
  swatch: string
  /** palette overrides applied to the root element */
  vars: CSSProperties
}

export const MOODS: Mood[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    swatch: 'linear-gradient(140deg, #4f46e5, #ec4899)',
    vars: {
      '--blob-a': '#4f46e5',
      '--blob-b': '#a855f7',
      '--blob-c': '#ec4899',
      '--blob-d': '#38bdf8',
      '--bg-deep': '#0b0618',
      '--ink-color': '#f3eefc',
      '--ink-dim': 'rgba(243, 238, 252, 0.55)',
      '--accent': '#c4b5fd',
    } as CSSProperties,
  },
  {
    id: 'ember',
    name: 'Ember',
    swatch: 'linear-gradient(140deg, #f97316, #be123c)',
    vars: {
      '--blob-a': '#b91c1c',
      '--blob-b': '#f97316',
      '--blob-c': '#be123c',
      '--blob-d': '#fbbf24',
      '--bg-deep': '#170805',
      '--ink-color': '#fdf1e7',
      '--ink-dim': 'rgba(253, 241, 231, 0.55)',
      '--accent': '#fdba74',
    } as CSSProperties,
  },
  {
    id: 'reef',
    name: 'Reef',
    swatch: 'linear-gradient(140deg, #0d9488, #22d3ee)',
    vars: {
      '--blob-a': '#0f766e',
      '--blob-b': '#22d3ee',
      '--blob-c': '#2dd4bf',
      '--blob-d': '#3b82f6',
      '--bg-deep': '#03141a',
      '--ink-color': '#e6fbfa',
      '--ink-dim': 'rgba(230, 251, 250, 0.55)',
      '--accent': '#5eead4',
    } as CSSProperties,
  },
  {
    id: 'orchard',
    name: 'Orchard',
    swatch: 'linear-gradient(140deg, #65a30d, #facc15)',
    vars: {
      '--blob-a': '#3f6212',
      '--blob-b': '#84cc16',
      '--blob-c': '#facc15',
      '--blob-d': '#14b8a6',
      '--bg-deep': '#0a1206',
      '--ink-color': '#f2fbe7',
      '--ink-dim': 'rgba(242, 251, 231, 0.55)',
      '--accent': '#bef264',
    } as CSSProperties,
  },
  {
    id: 'graphite',
    name: 'Graphite',
    swatch: 'linear-gradient(140deg, #475569, #cbd5e1)',
    vars: {
      '--blob-a': '#334155',
      '--blob-b': '#64748b',
      '--blob-c': '#94a3b8',
      '--blob-d': '#7dd3fc',
      '--bg-deep': '#08090c',
      '--ink-color': '#eef2f7',
      '--ink-dim': 'rgba(238, 242, 247, 0.5)',
      '--accent': '#cbd5e1',
    } as CSSProperties,
  },
]
