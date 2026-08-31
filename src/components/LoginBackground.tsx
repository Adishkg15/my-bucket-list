import { useEffect, useState } from 'react'
import loginBg from '../assets/login-bg.png'

interface LoginBackgroundProps {
  authenticating: boolean
}

// No cursor tracking here on purpose — the login page's background stays
// blurred at all times (with a slow idle "breathe"), and deepens further
// while authenticating. The cursor itself behaves normally.
export function LoginBackground({ authenticating }: LoginBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const onChange = () => setReducedMotion(motionQuery.matches)
    motionQuery.addEventListener('change', onChange)
    return () => motionQuery.removeEventListener('change', onChange)
  }, [])

  return (
    <div
      className={`login-bg ${reducedMotion ? 'login-bg--static' : ''} ${
        authenticating ? 'login-bg--authenticating' : ''
      }`}
      aria-hidden="true"
    >
      <div className="login-bg__blurred" style={{ backgroundImage: `url(${loginBg})` }} />
      <div className="login-bg__vignette" />
    </div>
  )
}
