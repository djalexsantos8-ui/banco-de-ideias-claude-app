'use client'

import { useState } from 'react'
import CopyButton from './CopyButton'

interface ListaLinksProps {
  links?: string[] | null
}

export default function ListaLinks({ links }: ListaLinksProps) {
  const [copiadoTodos, setCopiadoTodos] = useState(false)

  if (!links?.length) return null

  async function copiarTodos() {
    try {
      await navigator.clipboard.writeText(links!.join('\n'))
      setCopiadoTodos(true)
      setTimeout(() => setCopiadoTodos(false), 1500)
    } catch {
      // fallback silencioso
    }
  }

  return (
    <div className="bg-[#0e1420]/60 border border-white/5 rounded-2xl px-6 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
          Links úteis
        </p>
        <button
          onClick={copiarTodos}
          className="relative h-[18px] flex items-center text-xs text-zinc-500 hover:text-white active:scale-[0.92] transition-all duration-150 ease-out shrink-0 overflow-hidden"
          title="Copiar todos os links"
        >
          <span
            className="text-emerald-500 font-medium whitespace-nowrap transition-all duration-200 ease-out absolute inset-0 flex items-center"
            style={{ opacity: copiadoTodos ? 1 : 0, transform: copiadoTodos ? 'translateY(0)' : 'translateY(4px)' }}
          >
            ✓ Copiados
          </span>
          <span
            className="transition-all duration-200 ease-out whitespace-nowrap"
            style={{ opacity: copiadoTodos ? 0 : 1, transform: copiadoTodos ? 'translateY(-4px)' : 'translateY(0)' }}
          >
            Copiar todos
          </span>
        </button>
      </div>

      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-zinc-500 text-xs mt-0.5 shrink-0 font-mono">{i + 1}.</span>
            <span className="flex-1 min-w-0">
              <a
                href={link.startsWith('http') ? link : `https://${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4f7cff] text-[14px] leading-relaxed break-all hover:underline"
              >
                {link}
              </a>
            </span>
            <CopyButton texto={link} />
          </li>
        ))}
      </ul>
    </div>
  )
}
