'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function BuscaInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [valor, setValor] = useState(searchParams.get('busca') || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (valor.trim()) {
      params.set('busca', valor.trim())
    } else {
      params.delete('busca')
    }
    params.delete('categoria')
    router.push(`/ideias?${params.toString()}`)
  }

  function handleClear() {
    setValor('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('busca')
    router.push(`/ideias?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={valor}
        onChange={e => setValor(e.target.value)}
        placeholder="Buscar nas suas ideias..."
        className="w-full bg-[#0e1420] border border-white/10 text-white placeholder-zinc-500 rounded-2xl px-4 py-3 text-sm outline-none focus:border-white/20 transition-all duration-200 ease-out pr-20"
      />
      {valor && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
        >
          ✕
        </button>
      )}
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-sm"
      >
        ↵
      </button>
    </form>
  )
}
