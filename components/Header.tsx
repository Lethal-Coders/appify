'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-black/90 dark:bg-black/95 backdrop-blur-xl rounded-[2rem] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between shadow-2xl border border-white/10">
      <div className="flex items-center gap-2">
        <Link href="/">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white cursor-pointer">Appify</h1>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
        {session ? (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition border border-white/20">Dashboard</Link>
            <button onClick={() => signOut()} className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition border border-red-600">Sign Out</button>
          </>
        ) : (
          <Link href="/auth/signin" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition border border-white/20">Sign In</Link>
        )}
        <button onClick={toggleTheme} className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition border border-white/20">
          Toggle Theme
        </button>
      </div>
    </header>
  );
}
