'use client'

import { useState } from 'react'

export default function TranscricaoIdeia({ conteudo }: { conteudo: string }) {
  const [aberto, setAberto] = useState(false)

  const preview = conteudo.split('\n')[0].slice(0, 80) + (conteudo.length > 80 ? '...' : '')

  return (
    <div className="bg-[#0e1420] border border-white/8 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-start justify-between px-5 py-4 text-left gap-3 hover:bg-white/[0.02] active:bg-white/[0.04] transition-all duration-200 ease-out"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-1.5">
            Transcrição da ideia
          </p>
          <p
            className="text-zinc-400 text-xs leading-relaxed truncate transition-opacity duration-200 ease-out"
            style={{ opacity: aberto ? 0 : 1, height: aberto ? 0 : 'auto', overflow: 'hidden' }}
          >
            {preview}
          </p>
        </div>
        <span className="text-zinc-400 hover:text-white text-xs shrink-0 mt-0.5 transition-all duration-200 ease-out">
          {aberto ? '▲' : '▼'}
        </span>
      </button>

      {/* Conteúdo expandido — max-height transition para abertura suave */}
      <div
        className="border-t border-white/5 overflow-hidden"
        style={{
          maxHeight: aberto ? '2000px' : '0px',
          opacity: aberto ? 1 : 0,
          transition: aberto
            ? 'max-height 350ms ease-out, opacity 250ms ease-out'
            : 'max-height 250ms ease-in, opacity 150ms ease-in',
        }}
      >
        <div className="px-5 pb-5">
          <p className="text-zinc-400 text-[14px] leading-relaxed pt-4">
            {conteudo}
          </p>
        </div>
      </div>
    </div>
  )
}
