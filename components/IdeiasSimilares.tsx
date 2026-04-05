import Link from 'next/link'
import type { IdeiaSimialar } from '@/lib/buscar-similares'

const corPotencial: Record<string, string> = {
  forte: 'text-emerald-400',
  médio: 'text-yellow-400',
  fraco: 'text-red-400',
}

function BadgeSimilaridade({ valor }: { valor: number }) {
  const cor = valor >= 80
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : valor >= 60
    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    : 'bg-white/5 text-zinc-500 border-white/10'

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cor}`}>
      {valor}%
    </span>
  )
}

type Props = {
  similares: IdeiaSimialar[]
  temEmbedding?: boolean
}

export default function IdeiasSimilares({ similares, temEmbedding }: Props) {
  // Sem embedding — não há como calcular similaridade, não mostrar nada
  if (!temEmbedding) return null

  // Tem embedding mas nenhuma ideia passou o threshold de 40%
  if (similares.length === 0) {
    return (
      <div className="pt-2">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
          💡 Ideias parecidas com essa
        </p>
        <p className="text-zinc-600 text-xs text-center py-3">
          Nenhuma ideia realmente similar encontrada.
        </p>
      </div>
    )
  }

  return (
    <div className="pt-2">
      <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
        💡 Ideias parecidas com essa
      </p>
      <div className="space-y-2">
        {similares.map(ideia => (
          <Link
            key={ideia.id}
            href={`/ideia/${ideia.id}`}
            className="flex items-start justify-between gap-3 bg-[#0e1420] border border-white/10 rounded-2xl px-4 py-3 hover:border-white/20 hover:bg-[#141c2e] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-snug truncate">
                {ideia.titulo}
              </p>
              {ideia.resumo && (
                <p className="text-zinc-400 text-xs mt-0.5 line-clamp-1">
                  {ideia.resumo}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <BadgeSimilaridade valor={ideia.similarity} />
              {ideia.potencial && (
                <span className={`text-[10px] ${corPotencial[ideia.potencial] || 'text-zinc-500'}`}>
                  {ideia.potencial}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
