/**
 * Full-bleed animated sky: four drifting colour blobs, a slow conic wave
 * and a grain layer. `boost` brightens everything for a beat on keystroke,
 * so the room responds to the writing.
 */
export default function AuroraBackground({ boost }: { boost: boolean }) {
  return (
    <div
      className={`aurora-stage typing-pulse ${boost ? 'pulse-boost' : ''}`}
      aria-hidden="true"
    >
      <div className="aurora-blob blob-a" />
      <div className="aurora-blob blob-b" />
      <div className="aurora-blob blob-c" />
      <div className="aurora-blob blob-d" />
      <div className="aurora-wave" />
      <div className="aurora-grain" />

      {/* displacement map used by the water pool inside the glass panel */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="liquid">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.028"
              numOctaves={2}
              seed={7}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="24s"
                values="0.012 0.028;0.018 0.020;0.012 0.028"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="26"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
