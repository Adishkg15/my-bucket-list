import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Landing() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white px-6 text-center">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Your life, but make it interesting.
        </h1>
        <p className="mt-4 text-base text-neutral-500 sm:text-lg">
          Keep the things you swear you're going to do someday.
        </p>
      </div>

      <Link
        to="/login"
        className="rounded-full bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        Start your bucket list
      </Link>

      <ul className="space-y-1 font-mono text-sm text-neutral-500">
        <li>☐ See the Northern Lights</li>
        <li>☐ Go skydiving</li>
        <li>☐ Learn surfing</li>
        <li className="text-neutral-300 line-through">✓ Take a solo trip</li>
        <li>☐ Build something people actually use</li>
      </ul>
    </div>
  )
}