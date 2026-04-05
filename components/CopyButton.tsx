'use client'

import { useState } from 'react'

export default function CopyButton({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      // fallback silencioso
    }
  }

  return (
    <button
      onClick={copiar}
      className="relative h-[18px] flex items-center text-xs text-zinc-500 hover:text-white active:scale-[0.92] transition-all duration-150 ease-out shrink-0 overflow-hidden"
      title="Copiar"
    >
      {/* Estado: copiado */}
      <span
        className="text-emerald-500 font-medium whitespace-nowrap transition-all duration-200 ease-out absolute inset-0 flex items-center"
        style={{ opacity: copiado ? 1 : 0, transform: copiado ? 'translateY(0)' : 'translateY(4px)' }}
      >
        ✓ Copiado
      </span>

      {/* Estado: ícone */}
      <span
        className="transition-all duration-200 ease-out"
        style={{ opacity: copiado ? 0 : 1, transform: copiado ? 'translateY(-4px)' : 'translateY(0)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </span>
    </button>
  )
}
