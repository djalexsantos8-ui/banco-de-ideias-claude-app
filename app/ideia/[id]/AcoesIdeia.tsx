'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AcoesIdeia({ id, aprovada }: { id: string; aprovada: boolean }) {
  const [loadingAprovar, setLoadingAprovar] = useState(false)
  const [loadingDeletar, setLoadingDeletar] = useState(false)
  const [confirmarDelete, setConfirmarDelete] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  async function aprovar() {
    setLoadingAprovar(true)
    setErro('')
    try {
      const res = await fetch('/api/aprovar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Erro ao aprovar')
      router.push('/home')
    } catch {
      setLoadingAprovar(false)
      setErro('Não foi possível aprovar. Tente novamente.')
    }
  }

  async function deletar() {
    setLoadingDeletar(true)
    setErro('')
    try {
      const res = await fetch('/api/deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Erro ao deletar')
      router.push('/ideias')
    } catch {
      setLoadingDeletar(false)
      setConfirmarDelete(false)
      setErro('Não foi possível excluir. Tente novamente.')
    }
  }

  return (
    <>
      {/* Menu ··· */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="absolute top-0 right-0 text-zinc-400 hover:text-white p-2 transition-all duration-200 ease-out text-lg leading-none"
          aria-label="Opções"
        >
          ···
        </button>

        {menuAberto && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuAberto(false)}
            />
            <div className="absolute right-0 top-8 z-20 bg-[#0e1420] border border-white/10 rounded-2xl overflow-hidden shadow-xl min-w-[160px]">
              <Link
                href={`/captura?ajustar=${id}`}
                className="block px-4 py-3 text-sm text-white hover:bg-white/5 transition-all duration-200 ease-out"
                onClick={() => setMenuAberto(false)}
              >
                Ajustar ideia
              </Link>
              <button
                onClick={() => { setMenuAberto(false); setConfirmarDelete(true) }}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-all duration-200 ease-out"
              >
                Excluir ideia
              </button>
            </div>
          </>
        )}
      </div>

      {/* Erro */}
      {erro && (
        <div className="mt-2 bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-2">
          <p className="text-red-400 text-xs">{erro}</p>
        </div>
      )}

      {/* Botões de ação (aprovação) */}
      {!aprovada && (
        <div className="flex gap-3 pt-2">
          <Link
            href={`/captura?ajustar=${id}`}
            className="flex-1 bg-[#0e1420] text-white border border-white/10 rounded-2xl py-3 text-sm font-medium text-center hover:border-white/20 transition-all duration-200 ease-out"
          >
            Ajustar
          </Link>
          <button
            onClick={aprovar}
            disabled={loadingAprovar}
            className="flex-1 bg-white text-black rounded-2xl py-3 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all duration-200 ease-out"
          >
            {loadingAprovar ? 'Salvando...' : 'Aprovar'}
          </button>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmarDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-6 pb-10">
          <div className="bg-[#0e1420] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <p className="text-white font-semibold text-center">Excluir esta ideia?</p>
            <p className="text-zinc-400 text-sm text-center">Essa ação não pode ser desfeita.</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmarDelete(false)}
                className="flex-1 bg-white/8 text-white border border-white/10 rounded-2xl py-3 text-sm font-medium hover:bg-white/12 transition-all duration-200 ease-out"
              >
                Cancelar
              </button>
              <button
                onClick={deletar}
                disabled={loadingDeletar}
                className="flex-1 bg-red-600 text-white rounded-2xl py-3 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all duration-200 ease-out"
              >
                {loadingDeletar ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
