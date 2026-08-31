import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { DreamMap } from '../components/DreamMap'

export function Landing() {
  const { user, loading } = useAuth()

  // Already signed in — skip straight to the dashboard.
  if (!loading && user) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:gap-16">
      <div className="max-w-md text-center lg:text-left">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Your life, but make it interesting.
        </h1>
        <p className="mt-4 text-base text-neutral-500 sm:text-lg">
          Keep the things you swear you're going to do someday.
        </p>

        <Link
          to="/login"
          className="mt-8 inline-block rounded-full bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Start your bucket list
        </Link>
      </div>

      <DreamMap />
    </div>
  )
}
