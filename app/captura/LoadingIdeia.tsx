'use client'

import { useEffect, useState } from 'react'
import { frasesLoading, type Frase } from './frasesLoading'

function getRandomFrase(excluirIndice?: number): { frase: Frase; indice: number } {
  let indice: number
  do {
    indice = Math.floor(Math.random() * frasesLoading.length)
  } while (indice === excluirIndice && frasesLoading.length > 1)
  return { frase: frasesLoading[indice], indice }
}

export default function LoadingIdeia() {
  const [{ frase, indice }, setAtual] = useState(() => getRandomFrase())
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
        setAtual(prev => getRandomFrase(prev.indice))
        setVisivel(true)
      }, 500)
    }, 5000)

    return () => clearInterval(intervalo)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080c14] flex flex-col items-center justify-center px-8"
      style={{
        opacity: montado ? 1 : 0,
        transition: 'opacity 300ms ease-out',
      }}
    >
      {/* Spinner */}
      <div className="mb-10">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
      </div>

      {/* Texto principal */}
      <p className="text-white text-base font-medium mb-8 tracking-wide">
        Processando sua ideia...
      </p>

      {/* Frase rotativa */}
      <div
        className="text-center max-w-sm px-4"
        style={{
          opacity: visivel ? 1 : 0,
          transition: 'opacity 500ms ease-out',
        }}
      >
        <p className="text-zinc-300 text-[15px] leading-relaxed italic">
          {frase.texto}
        </p>
        {frase.autor && (
          <p className="text-zinc-600 text-xs mt-2 not-italic">— {frase.autor}</p>
        )}
      </div>
    </div>
  )
}
