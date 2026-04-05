import { createServerSupabaseClient } from '@/lib/supabase-server'
import { gerarEmbedding, explicarResultados } from '@/lib/openai'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  if (!q) redirect('/busca')

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  let resultados: {id: string; titulo: string; conteudo: string; resumo: string; tags: string[]; categoria: string; potencial: string; similarity: number}[] = []
  let explicacoes: string[] = []
  let erro = false

  try {
    const embedding = await gerarEmbedding(q)

    const { data } = await supabase.rpc('buscar_similares', {
      query_embedding: embedding,
      user_id_param: user.id,
      match_count: 3,
    })

    resultados = data || []

    if (resultados.length > 0) {
      explicacoes = await explicarResultados(q, resultados)
    }
  } catch {
    erro = true
  }

  return (
    <main className="min-h-screen bg-[#080c14] flex flex-col pb-32">
      <header className="flex items-center gap-4 px-6 py-5 border-b border-white/5 max-w-[672px] mx-auto w-full sticky top-0 bg-[#080c14] z-40">
        <Link href="/busca" className="text-[#8a9bb0] hover:text-[#f0ede8] transition-all duration-200 ease-out">←</Link>
        <div className="flex-1 min-w-0">
          <p className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4f7cff]">
            Resultados Semânticos
          </p>
          <p className="text-[#f0ede8] text-sm font-medium truncate mt-0.5">"{q}"</p>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 space-y-8 max-w-[672px] mx-auto w-full">

        {/* Erro */}
        {erro && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-2xl px-5 py-4">
            <p className="text-red-400 text-sm">Erro ao buscar. Verifique sua conexão e tente novamente.</p>
          </div>
        )}

        {/* Empty */}
        {!erro && resultados.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#141c2e] flex items-center justify-center mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <h3 className="font-headline font-bold text-[20px] text-[#f0ede8]">Nenhuma conexão forte</h3>
            <p className="text-[#8a9bb0] text-sm leading-relaxed max-w-xs mx-auto">
              Tente buscar com outras palavras ou adicione mais ideias ao arquivo.
            </p>
            <Link href="/captura" className="inline-block mt-2 px-6 py-3 bg-[#f0ede8] text-[#080c14] font-headline font-bold text-xs uppercase tracking-widest rounded-full hover:opacity-90 transition-all active:scale-95">
              Criar Nova Ideia
            </Link>
          </div>
        )}

        {/* Resultados */}
        {resultados.map((ideia, i) => (
          <div key={ideia.id} className="group">
            <div className="flex justify-between items-start mb-2">
              <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568]">
                {Math.round(ideia.similarity * 100)}% Correspondência
              </span>
            </div>
            <Link href={`/ideia/${ideia.id}`}>
              <div className={`bg-[#0e1420] p-6 rounded-xl transition-all duration-200 hover:bg-[#141c2e] hover:scale-[1.01] active:scale-[0.99] shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${i === 0 ? 'border-l-2 border-l-[#4f7cff]' : ''}`}>
                <h3 className="font-headline font-semibold text-[18px] text-[#f0ede8] mb-3 leading-tight">
                  {ideia.titulo || ideia.resumo || ideia.conteudo}
                </h3>

                {ideia.titulo && ideia.resumo && (
                  <p className="text-[#8a9bb0] text-[14px] leading-relaxed mb-4">
                    {ideia.resumo}
                  </p>
                )}

                {explicacoes[i] && (
                  <p className="text-[#4a5568] text-[13px] leading-relaxed border-t border-white/5 pt-3 mt-3">
                    → {explicacoes[i]}
                  </p>
                )}

                {ideia.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ideia.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[#4a5568] text-xs px-2 py-0.5 bg-[#1c2028] rounded uppercase font-bold tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}

        {resultados.length > 0 && (
          <div className="text-center pt-2">
            <Link href="/busca" className="text-[#8a9bb0] text-sm hover:text-[#f0ede8] transition-all duration-200">
              Nova busca →
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
