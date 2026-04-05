'use client'

import { useRouter } from 'next/navigation'

interface CardAcaoProps {
  texto?: string | null
}

export default function CardAcao({ texto }: CardAcaoProps) {
  const router = useRouter()

  if (!texto?.trim()) return null

  function executar() {
    router.push(`/captura?sugestao=${encodeURIComponent(texto!.trim())}`)
  }

  return (
    <div className="bg-[#f97316] rounded-2xl px-6 py-6 shadow-lg space-y-3">
      <span className="font-headline text-[11px] font-bold uppercase tracking-[0.05em] text-[#080c14] bg-black/10 px-2 py-0.5 rounded">
        Prioridade Máxima
      </span>
      <h3 className="font-headline font-extrabold text-[20px] text-[#080c14] leading-tight">
        O que fazer agora
      </h3>
      <p className="text-[15px] leading-[1.7] text-[#080c14] font-medium opacity-90">
        {texto}
      </p>
      <button
        onClick={executar}
        className="mt-1 w-full bg-[#080c14]/20 hover:bg-[#080c14]/30 active:scale-[0.95] active:opacity-80 active:shadow-none shadow-sm text-[#080c14] font-headline font-bold text-[13px] uppercase tracking-[0.08em] rounded-xl py-3 transition-all duration-150 ease-out"
      >
        Executar agora →
      </button>
    </div>
  )
}
