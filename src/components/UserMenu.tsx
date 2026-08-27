import { useEffect, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email
  const avatarUrl = (user.user_metadata?.avatar_url as string) || (user.user_metadata?.picture as string)
  const initial = (name ?? '?').charAt(0).toUpperCase()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full p-1 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-neutral-100 bg-white py-1 shadow-lg"
        >
          <div className="border-b border-neutral-100 px-3.5 py-2.5">
            <p className="truncate text-sm font-medium text-neutral-900">{name}</p>
            {user.email && name !== user.email && (
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            )}
          </div>
          <button
            onClick={onLogout}
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-neutral-700 transition hover:bg-neutral-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}