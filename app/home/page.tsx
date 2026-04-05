import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import BottomNav from '@/components/BottomNav'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { count } = await supabase
    .from('ideias')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <main className="min-h-screen bg-[#080c14] flex flex-col pb-32">

      {/* Decorative ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4f7cff]/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-[672px] mx-auto w-full">
        <h1 className="font-headline font-bold text-[22px] tracking-[-0.02em] text-[#f0ede8]">
          Banco de Ideias
        </h1>
        <LogoutButton />
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-[512px] mx-auto w-full">

        {/* Brand anchor */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="w-20 h-[2px] bg-[#4f7cff]/40" />
          <p className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568]">
            O Arquivo Intelectual
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-5 w-full">
          {/* PRIMARY */}
          <Link
            href="/captura"
            className="w-full py-8 bg-[#f0ede8] text-[#080c14] rounded-2xl font-headline font-extrabold text-[20px] tracking-tight text-center hover:opacity-90 active:scale-[0.95] active:shadow-none shadow-sm transition-all duration-150 ease-out flex flex-col items-center gap-1"
          >
            <span className="font-headline text-[11px] font-bold uppercase tracking-[0.1em] text-[#080c14]/50">
              Insight Imediato
            </span>
            Tive uma ideia
          </Link>

          {/* SECONDARY */}
          <Link
            href="/busca"
            className="w-full py-5 bg-[#0e1420] text-[#f0ede8] border border-white/10 rounded-2xl font-headline font-semibold text-[16px] text-center hover:border-white/20 hover:bg-[#141c2e] active:scale-[0.97] active:opacity-80 transition-all duration-150 ease-out"
          >
            Preciso de uma ideia
          </Link>

          {/* TERTIARY */}
          <Link
            href="/ideias"
            className="w-full py-4 text-[#8a9bb0] rounded-2xl font-headline font-semibold text-[14px] text-center hover:text-[#f0ede8] active:scale-[0.97] active:opacity-80 transition-all duration-150 ease-out flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            Minhas ideias {count ? `(${count})` : ''}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center max-w-[672px] mx-auto w-full px-6">
        <p className="font-headline text-[12px] text-[#4a5568] tracking-wider">
          Powered by <span className="font-semibold text-[#f0ede8]/30">Lumora Solutions</span>
        </p>
      </footer>

      <BottomNav />
    </main>
  )
}
