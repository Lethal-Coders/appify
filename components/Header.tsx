'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface HeaderProps {
  user: any
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            Rehan
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            {user?.image && (
              <Image
                src={user.image}
                alt={user.name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
