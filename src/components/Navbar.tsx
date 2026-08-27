import type { User } from '@supabase/supabase-js'
import { UserMenu } from './UserMenu'

interface NavbarProps {
  user: User
  onLogout: () => void
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-base font-semibold tracking-tight text-neutral-900">
          Bucket List
        </span>
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  )
}