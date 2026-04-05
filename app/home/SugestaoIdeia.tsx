'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Sugestao = {
  titulo: string
  descricao: string
  por_que_agora: string
  tipo: string
}

const CACHE_KEY = 'sugestao_cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24h

function lerCache(): Sugestao | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { sugestao, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY)
      return null
    }
    return sugestao
  } catch {
    return null
  }
}

function salvarCache(sugestao: Sugestao) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ sugestao, timestamp: Date.now() }))
  } catch {
    // sessionStorage pode estar indisponível — silencia
  }
}

const tipoCor: Record<string, string> = {
  'nova ideia': 'text-emerald-500',
  'combinação': 'text-blue-400',
  'otimização': 'text-yellow-400',
}

export default function SugestaoIdeia() {
  const router = useRouter()
  const [sugestao, setSugestao] = useState<Sugestao | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [insuficiente, setInsuficiente] = useState(false)

  useEffect(() => {
    // 1. Tenta cache primeiro — sem chamada de rede
    const cached = lerCache()
    if (cached) {
      setSugestao(cached)
      setCarregando(false)
      return
    }

    // 2. Busca da API
    let cancelado = false
    fetch('/api/sugerir-ideia')
      .then(r => r.json())
      .then(data => {
        if (cancelado) return
        if (data.insuficiente) {
          setInsuficiente(true)
        } else if (data.titulo) {
          salvarCache(data)
          setSugestao(data)
        }
      })
      .catch(() => {
        // Falha silenciosa — não bloqueia a home
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [])

  function explorar() {
    if (!sugestao) return
    const texto = `${sugestao.titulo}\n\n${sugestao.descricao}`
    router.push(`/captura?sugestao=${encodeURIComponent(texto)}`)
  }

  // Nada a mostrar — insuficiente ou erro
  if (!carregando && !sugestao && !insuficiente) return null

  return (
    <div className="w-full max-w-sm">
      {/* Skeleton de carregamento */}
      {carregando && (
        <div className="border border-white/10 rounded-2xl px-5 py-4 space-y-3 animate-pulse">
          <div className="h-3 w-24 bg-white/5 rounded-full" />
          <div className="h-4 w-3/4 bg-white/5 rounded-full" />
          <div className="h-3 w-full bg-white/5 rounded-full" />
          <div className="h-3 w-2/3 bg-white/5 rounded-full" />
        </div>
      )}

      {/* Fallback: poucas ideias */}
      {!carregando && insuficiente && (
        <div className="border border-white/10 rounded-2xl px-5 py-4 text-center space-y-1">
          <p className="text-zinc-500 text-xs uppercase tracking-widest">💡 Sugestão para você</p>
          <p className="text-zinc-500 text-sm">
            Adicione mais ideias para receber sugestões inteligentes
          </p>
        </div>
      )}

      {/* Sugestão real */}
      {!carregando && sugestao && (
        <div className="border border-white/10 bg-[#090e18] rounded-2xl px-5 py-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">💡 Sugestão para você</span>
            <span className={`text-[10px] font-semibold ${tipoCor[sugestao.tipo] || 'text-zinc-500'}`}>
              {sugestao.tipo}
            </span>
          </div>

          {/* Título */}
          <p className="text-white text-sm font-semibold leading-snug">
            {sugestao.titulo}
          </p>

          {/* Descrição */}
          <p className="text-zinc-400 text-xs leading-relaxed">
            {sugestao.descricao}
          </p>

          {/* Por que agora */}
          {sugestao.por_que_agora && (
            <p className="text-zinc-500 text-xs italic leading-relaxed border-t border-white/10 pt-2">
              {sugestao.por_que_agora}
            </p>
          )}

          {/* CTA */}
          <button
            onClick={explorar}
            className="w-full text-xs font-medium text-black bg-white rounded-xl py-2.5 hover:bg-zinc-100 transition-all duration-200 ease-out"
          >
            Explorar ideia →
          </button>
        </div>
      )}
    </div>
  )
}
