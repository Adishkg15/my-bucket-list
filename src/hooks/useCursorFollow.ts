import { useEffect, useRef, type RefObject } from 'react'

const POS_LERP = 0.12
const TILT_LERP = 0.08
const TRAIL_LENGTH = 6
const TRAIL_LERP = 0.35
const MAX_TILT_DEG = 6

interface Point {
  x: number
  y: number
}

/**
 * Tracks the pointer over `containerRef` (in element-local coordinates) and,
 * every animation frame:
 *  - lerps `planeRef`'s position/rotation toward the cursor
 *  - lerps a short chain of trailing dots behind it
 *  - writes a subtle --tilt-x/--tilt-y (3D tilt) and --px/--py (glow
 *    position) onto the container as CSS custom properties
 * No React state is touched on pointer move — everything is a ref write.
 */
export function useCursorFollow(
  containerRef: RefObject<HTMLElement | null>,
  planeRef: RefObject<HTMLElement | null>,
  trailRefs: RefObject<(HTMLElement | null)[]>,
  enabled: boolean
) {
  const target = useRef<Point>({ x: 0, y: 0 })
  const planePos = useRef<Point>({ x: 0, y: 0 })
  const trailPositions = useRef<Point[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }))
  )
  const tiltCurrent = useRef<Point>({ x: 0, y: 0 })
  const lastAngle = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const containerEl = containerRef.current
    if (!enabled || !containerEl) return
    const container: HTMLElement = containerEl

    const startRect = container.getBoundingClientRect()
    const start = { x: startRect.width / 2, y: startRect.height / 2 }
    target.current = start
    planePos.current = { ...start }
    trailPositions.current = trailPositions.current.map(() => ({ ...start }))
    tiltCurrent.current = { x: 0, y: 0 }

    function handlePointerMove(e: PointerEvent) {
      const rect = container.getBoundingClientRect()
      target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function tick() {
      const rect = container.getBoundingClientRect()
      const prev = { ...planePos.current }

      planePos.current.x += (target.current.x - planePos.current.x) * POS_LERP
      planePos.current.y += (target.current.y - planePos.current.y) * POS_LERP

      const dx = planePos.current.x - prev.x
      const dy = planePos.current.y - prev.y
      if (Math.hypot(dx, dy) > 0.3) {
        lastAngle.current = Math.atan2(dy, dx) * (180 / Math.PI)
      }

      const plane = planeRef.current
      if (plane) {
        plane.style.transform = `translate3d(${planePos.current.x}px, ${planePos.current.y}px, 0) rotate(${lastAngle.current}deg)`
      }

      let leader = planePos.current
      trailPositions.current = trailPositions.current.map((pos, i) => {
        const next = {
          x: pos.x + (leader.x - pos.x) * TRAIL_LERP,
          y: pos.y + (leader.y - pos.y) * TRAIL_LERP,
        }
        const dot = trailRefs.current?.[i]
        if (dot) {
          dot.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`
          dot.style.opacity = `${1 - (i + 1) / (TRAIL_LENGTH + 1)}`
        }
        leader = next
        return next
      })

      const nx = rect.width ? (target.current.x / rect.width - 0.5) * 2 : 0
      const ny = rect.height ? (target.current.y / rect.height - 0.5) * 2 : 0
      tiltCurrent.current.x += (-ny * MAX_TILT_DEG - tiltCurrent.current.x) * TILT_LERP
      tiltCurrent.current.y += (nx * MAX_TILT_DEG - tiltCurrent.current.y) * TILT_LERP

      container.style.setProperty('--tilt-x', `${tiltCurrent.current.x.toFixed(2)}deg`)
      container.style.setProperty('--tilt-y', `${tiltCurrent.current.y.toFixed(2)}deg`)
      container.style.setProperty('--px', `${planePos.current.x}px`)
      container.style.setProperty('--py', `${planePos.current.y}px`)

      rafId.current = requestAnimationFrame(tick)
    }

    container.addEventListener('pointermove', handlePointerMove)
    rafId.current = requestAnimationFrame(tick)

    return () => {
      container.removeEventListener('pointermove', handlePointerMove)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [containerRef, planeRef, trailRefs, enabled])
}
