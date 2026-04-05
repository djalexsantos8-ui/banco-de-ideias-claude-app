'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const isHome = pathname === '/home'
  const isIdeias = pathname.startsWith('/ideias') || pathname.startsWith('/ideia/')
  const isBusca = pathname.startsWith('/busca') || pathname.startsWith('/resultados')

  const itemBase = 'flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-[0.88] active:opacity-70'
  const itemActive = 'text-[#f0ede8]'
  const itemInactive = 'text-[#4a5568] hover:text-[#8a9bb0]'

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-8 pt-4 bg-[#0e1420] border-t border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.4)] z-50">
      <Link href="/home" className={`${itemBase} ${isHome ? itemActive : itemInactive}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={isHome ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="font-headline text-[10px] font-semibold uppercase tracking-[0.05em]">Início</span>
      </Link>

      <Link href="/ideias" className={`${itemBase} ${isIdeias ? itemActive : itemInactive}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={isIdeias ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.98-1.76 5.55-4.28 6.77L14 17H10l-.72-1.23C6.76 14.55 5 11.98 5 9a7 7 0 0 1 7-7z"/>
        </svg>
        <span className="font-headline text-[10px] font-semibold uppercase tracking-[0.05em]">Ideias</span>
      </Link>

      <Link href="/busca" className={`${itemBase} ${isBusca ? itemActive : itemInactive}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isBusca ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span className="font-headline text-[10px] font-semibold uppercase tracking-[0.05em]">Busca</span>
      </Link>
    </nav>
  )
}
