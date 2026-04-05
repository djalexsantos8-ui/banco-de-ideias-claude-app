'use client'

import { useState } from 'react'
import CopyButton from './CopyButton'

interface BlocoTextoProps {
  label: string
  texto?: string | null
  copiavel?: boolean
  destaque?: boolean
  colapsavel?: boolean
}

const LIMITE_CHARS = 280

export default function BlocoTexto({
  label,
  texto,
  copiavel = false,
  destaque = false,
  colapsavel = false,
}: BlocoTextoProps) {
  const [expandido, setExpandido] = useState(false)

  if (!texto?.trim()) return null

  const longo = colapsavel && texto.length > LIMITE_CHARS
  const textoExibido = longo && !expandido
    ? texto.slice(0, LIMITE_CHARS).trimEnd() + '…'
    : texto

  return (
    <div className={`rounded-2xl px-6 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ${
      destaque
        ? 'bg-[#0e1420] border border-white/8 border-l-2 border-l-[#4f7cff]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
        : 'bg-[#0e1420]/60 border border-white/5'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
          {label}
        </p>
        {copiavel && <CopyButton texto={texto} />}
      </div>

      <p className="text-[15px] leading-relaxed text-[#f0ede8]">
        {textoExibido}
      </p>

      {longo && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="text-xs text-zinc-400 hover:text-white active:scale-[0.97] transition-all duration-150 ease-out mt-3 block"
        >
          {expandido ? 'Ver menos ↑' : 'Ver mais ↓'}
        </button>
      )}
    </div>
  )
}
