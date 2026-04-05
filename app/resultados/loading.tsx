'use client'

import { useEffect, useState } from 'react'

const frases = [
  'Analisando padrões semânticos...',
  'Conectando conceitos relacionados...',
  'Procurando ideias similares...',
  'Interpretando sua busca...',
  'Organizando os resultados...',
]

export default function LoadingResultados() {
  const [fraseIdx, setFraseIdx] = useState(0)
  const [visivel, setVisivel] = useState(true)
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMontado(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setVisivel(false)
      setTimeout(() => {
        setFraseIdx(i => (i + 1) % frases.length)
        setVisivel(true)
      }, 400)
    }, 2500)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080c14] flex flex-col items-center justify-center px-8"
      style={{ opacity: montado ? 1 : 0, transition: 'opacity 250ms ease-out' }}
    >
      {/* Glow decorativo */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4f7cff]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Spinner */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#4f7cff] animate-spin" />
      </div>

      {/* Label */}
      <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f7cff] mb-3">
        Busca Semântica
      </span>

      {/* Frase rotativa */}
      <div
        className="text-center"
        style={{ opacity: visivel ? 1 : 0, transition: 'opacity 400ms ease-out' }}
      >
        <p className="text-[#f0ede8] text-[16px] font-medium leading-relaxed">
          {frases[fraseIdx]}
        </p>
      </div>
    </div>
  )
}
