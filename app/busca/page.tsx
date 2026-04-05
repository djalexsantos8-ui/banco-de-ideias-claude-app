'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

const sugestoes = [
  'ideia de vídeo',
  'algo sobre negócio',
  'insights que tive',
  'referências criativas',
]

function BuscaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      router.push(`/resultados?q=${encodeURIComponent(q)}`)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/resultados?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <main className="min-h-screen bg-[#080c14] flex flex-col pb-32">
      <header className="flex items-center gap-4 px-6 py-5 border-b border-white/5 max-w-[672px] mx-auto w-full">
        <Link href="/home" className="text-[#8a9bb0] hover:text-[#f0ede8] transition-all duration-200 ease-out">←</Link>
        <h1 className="font-headline font-bold text-[20px] tracking-[-0.02em] text-[#f0ede8]">Buscar ideia</h1>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 max-w-[672px] mx-auto w-full">

        <div className="mb-8">
          <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4f7cff] block mb-2">
            Busca Semântica
          </span>
          <p className="text-[#8a9bb0] text-[15px]">
            O que você precisa? Descreva com suas palavras.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ex: preciso de uma ideia para vídeo corporativo..."
              rows={3}
              autoFocus
              className="w-full bg-[#0e1420] border-none text-[#f0ede8] placeholder-[#4a5568] rounded-2xl px-6 py-5 text-[15px] outline-none focus:ring-2 focus:ring-[#4f7cff]/30 transition-shadow duration-200 resize-none shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (query.trim()) handleSubmit(e as unknown as React.FormEvent)
                }
              }}
            />
            <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#4f7cff]/20 to-transparent" />
          </div>
          <button
            type="submit"
            disabled={!query.trim()}
            className="w-full bg-[#f0ede8] text-[#080c14] rounded-full py-4 font-headline font-bold text-[14px] disabled:opacity-30 hover:bg-white active:scale-[0.98] transition-all duration-150 ease-out"
          >
            Buscar →
          </button>
        </form>

        <div className="mt-10 space-y-1">
          <p className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568] text-center mb-4">
            Sugestões
          </p>
          {sugestoes.map(s => (
            <button
              key={s}
              onClick={() => router.push(`/resultados?q=${encodeURIComponent(s)}`)}
              className="w-full text-left text-[#8a9bb0] hover:text-[#f0ede8] text-[15px] px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/8 transition-all duration-150 ease-out"
            >
              → {s}
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

export default function BuscaPage() {
  return (
    <Suspense>
      <BuscaContent />
    </Suspense>
  )
}
