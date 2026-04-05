'use client'

import { useState } from 'react'

export default function DetalhamentoIdeia({ texto }: { texto: string }) {
  const [expandido, setExpandido] = useState(false)
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const linhas = texto.split('\n').filter(Boolean)
  const preview = linhas.slice(0, 3).join('\n')
  const temMais = linhas.length > 3

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl px-5 py-4 space-y-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">Detalhamento</p>
        <button
          onClick={copiar}
          className="text-xs text-zinc-500 hover:text-white transition-all duration-150 ease-out"
        >
          {copiado ? <span className="text-emerald-500">✓ Copiado</span> : 'Copiar'}
        </button>
      </div>

      <div className="text-zinc-100 text-[14px] leading-relaxed whitespace-pre-line">
        {expandido ? texto : preview}
      </div>

      {temMais && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="text-xs text-zinc-400 hover:text-white active:scale-[0.97] transition-all duration-150 ease-out"
        >
          {expandido ? 'Mostrar menos ↑' : 'Mostrar mais ↓'}
        </button>
      )}
    </div>
  )
}
