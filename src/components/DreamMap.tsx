import { useEffect, useRef, useState } from 'react'
import { Plane } from 'lucide-react'
import { GENRES } from '../types/bucketItem'
import { useCursorFollow } from '../hooks/useCursorFollow'

const NODE_POSITIONS = [
  { top: '14%', left: '18%' },
  { top: '10%', left: '64%' },
  { top: '32%', left: '84%' },
  { top: '55%', left: '10%' },
  { top: '64%', left: '46%' },
  { top: '80%', left: '74%' },
  { top: '42%', left: '38%' },
]

export function DreamMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])

  const [canHover, setCanHover] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setCanHover(hoverQuery.matches)
    setReducedMotion(motionQuery.matches)

    const onHoverChange = () => setCanHover(hoverQuery.matches)
    const onMotionChange = () => setReducedMotion(motionQuery.matches)

    hoverQuery.addEventListener('change', onHoverChange)
    motionQuery.addEventListener('change', onMotionChange)
    return () => {
      hoverQuery.removeEventListener('change', onHoverChange)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  const interactive = canHover && !reducedMotion
  useCursorFollow(containerRef, planeRef, trailRefs, interactive)

  const modeClass = reducedMotion ? 'dream-map--static' : !canHover ? 'dream-map--ambient' : ''

  return (
    <div ref={containerRef} className={`dream-map ${modeClass}`}>
      <div className="dream-map__grid" />
      {interactive && <div className="dream-map__glow" />}

      {GENRES.slice(0, 7).map((genre, i) => (
        <span
          key={genre.id}
          className="dream-map__node"
          style={{
            top: NODE_POSITIONS[i].top,
            left: NODE_POSITIONS[i].left,
            animationDelay: `${i * 0.6}s`,
          }}
        >
          <span aria-hidden="true">{genre.emoji}</span> {genre.label}
        </span>
      ))}

      {interactive && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                trailRefs.current[i] = el
              }}
              className="dream-map__trail-dot"
            />
          ))}
          <div ref={planeRef} className="dream-map__plane">
            <Plane size={22} strokeWidth={1.75} />
          </div>
        </>
      )}

      {canHover && !reducedMotion && (
        <span className="dream-map__hint">hover around to explore</span>
      )}
    </div>
  )
}
