'use client'

import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LoadingScreen from '@/components/LoadingScreen'

function CapturaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ideia_id = searchParams.get('ajustar')
  const sugestaoInicial = searchParams.get('sugestao') || ''

  const [conteudo, setConteudo] = useState(sugestaoInicial)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [gravando, setGravando] = useState(false)
  const [transcrevendo, setTranscrevendo] = useState(false)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function enviarIdeia(texto: string, tipo: string = 'texto') {
    setLoading(true)
    setErro('')

    const timeout = setTimeout(() => {
      setLoading(false)
      setErro('A requisição demorou demais. Tente novamente.')
    }, 60_000)

    try {
      const res = await fetch('/api/processar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudo: texto, tipo_midia: tipo, ideia_id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      clearTimeout(timeout)
      router.push(`/ideia/${data.id}`)
    } catch (err) {
      clearTimeout(timeout)
      const msg = err instanceof Error ? err.message : 'Algo deu errado.'
      setErro(msg === 'Erro desconhecido' ? 'Algo deu errado. Tente novamente.' : msg)
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!conteudo.trim()) return
    await enviarIdeia(conteudo)
  }

  async function toggleGravacao() {
    if (gravando) {
      mediaRef.current?.stop()
      setGravando(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setTranscrevendo(true)

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('audio', blob, 'audio.webm')

        try {
          const res = await fetch('/api/transcrever', { method: 'POST', body: form })
          const data = await res.json()
          if (data.texto) {
            await enviarIdeia(data.texto, 'audio')
          } else {
            setErro('Não consegui transcrever o áudio.')
          }
        } catch {
          setErro('Erro ao transcrever o áudio.')
        } finally {
          setTranscrevendo(false)
        }
      }

      recorder.start()
      mediaRef.current = recorder
      setGravando(true)
    } catch {
      setErro('Não foi possível acessar o microfone.')
    }
  }

  const bloqueado = loading || transcrevendo

  return (
    <>
      {loading && <LoadingScreen mensagem="Processando sua ideia..." />}
      {transcrevendo && <LoadingScreen mensagem="Transcrevendo áudio..." />}
      <main className="min-h-screen bg-[#080c14] flex flex-col">

        {/* Gradient decorativo */}
        <div className="fixed bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#4f7cff]/5 to-transparent pointer-events-none -z-10" />
        <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4f7cff]/5 blur-[120px] rounded-full" />
        </div>

        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-[#080c14] h-20 flex items-center px-6">
          <div className="flex items-center gap-4 w-full max-w-3xl mx-auto">
            <Link
              href="/home"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-all text-[#f0ede8]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Link>
            <h1 className="font-headline font-bold text-[22px] tracking-[-0.02em] text-[#f0ede8]">
              {ideia_id ? 'Ajustar ideia' : 'Nova ideia'}
            </h1>
          </div>
        </header>

        {/* Main */}
        <div className="flex-1 flex flex-col justify-end px-6 pb-8 pt-24 max-w-3xl mx-auto w-full">

          {/* Editorial hint */}
          {!conteudo && !transcrevendo && (
            <div className="mb-auto pb-10">
              <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4f7cff] mb-2 block">
                Capture a Faísca
              </span>
              <p className="text-[#f0ede8]/30 text-[15px] leading-relaxed max-w-xs">
                O arquivo intelectual aguarda. Registre sua percepção sem filtros.
              </p>
            </div>
          )}

          {erro && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-2xl px-4 py-3 mb-4">
              <p className="text-red-400 text-sm">{erro}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={conteudo}
                onChange={e => setConteudo(e.target.value)}
                placeholder="Descreva sua nova ideia..."
                disabled={bloqueado}
                rows={4}
                className="w-full bg-[#0e1420] border-none text-[#f0ede8] placeholder-[#4a5568] rounded-2xl px-6 py-5 text-[15px] outline-none focus:ring-2 focus:ring-[#4f7cff]/30 transition-shadow duration-200 resize-none disabled:opacity-50 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (conteudo.trim() && !bloqueado) handleSubmit(e as unknown as React.FormEvent)
                  }
                }}
              />
              {/* Accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#4f7cff]/20 to-transparent" />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleGravacao}
                disabled={bloqueado}
                className={`flex items-center gap-2 px-6 py-4 rounded-full text-sm font-headline font-semibold transition-all duration-150 ease-out disabled:opacity-40 active:scale-[0.95] active:opacity-80 ${
                  gravando
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 text-[#f0ede8]'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                {gravando ? 'Parar' : 'Áudio'}
              </button>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={bloqueado || !conteudo.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#f0ede8] text-[#080c14] rounded-full py-4 font-headline font-bold text-[14px] disabled:opacity-30 hover:bg-white active:scale-[0.95] active:shadow-none shadow-sm transition-all duration-150 ease-out"
              >
                {loading ? 'Processando...' : 'Enviar ideia'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                )}
              </button>
            </div>

            <p className="text-center font-headline text-[11px] text-[#f0ede8]/20 uppercase tracking-widest pt-2">
              Pressione Enter para salvar
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function CapturaPage() {
  return (
    <Suspense>
      <CapturaContent />
    </Suspense>
  )
}
