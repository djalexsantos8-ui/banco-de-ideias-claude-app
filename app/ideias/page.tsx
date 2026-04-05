import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BuscaInput from './BuscaInput'
import BottomNav from '@/components/BottomNav'

function estiloCard(score: number | null): { border: string; opacity: string } {
  if (score !== null && score >= 80)
    return { border: 'border-l-4 border-l-[#4f7cff] border-y border-r border-y-white/8 border-r-white/8', opacity: '' }
  if (score !== null && score >= 60)
    return { border: 'border-l-4 border-l-[#4f7cff]/30 border-y border-r border-y-white/8 border-r-white/8', opacity: '' }
  if (score !== null && score < 40)
    return { border: 'border border-white/5', opacity: 'opacity-40 hover:opacity-60' }
  return { border: 'border border-white/8', opacity: '' }
}

function scoreBadge(score: number | null) {
  if (score === null) return null
  if (score >= 80) return { bg: 'bg-[#4f7cff]/10', text: 'text-[#4f7cff]', label: 'Alta Escala' }
  if (score >= 60) return { bg: 'bg-white/5', text: 'text-[#f0ede8]', label: 'Boa ideia' }
  return { bg: 'bg-white/5', text: 'text-[#4a5568]', label: 'Baixo Potencial' }
}

export default async function IdeiasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string; prioridade?: string }>
}) {
  const { categoria, busca, prioridade } = await searchParams
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  let query = supabase
    .from('ideias')
    .select('*')
    .eq('user_id', user.id)
    .order('potencial_score', { ascending: false, nullsFirst: false })
    .order('criado_em', { ascending: false })

  if (categoria) query = query.eq('categoria', categoria)
  if (busca) query = query.or(`titulo.ilike.%${busca}%,resumo.ilike.%${busca}%,conteudo.ilike.%${busca}%`)
  if (prioridade === 'alta') query = query.gte('potencial_score', 80)
  else if (prioridade === 'media') query = query.gte('potencial_score', 60).lt('potencial_score', 80)
  else if (prioridade === 'baixa') query = query.lt('potencial_score', 60).not('potencial_score', 'is', null)

  const { data: ideias } = await query

  const { data: todasIdeias } = await supabase
    .from('ideias')
    .select('categoria')
    .eq('user_id', user.id)

  const categorias = [...new Set(todasIdeias?.map(i => i.categoria).filter(Boolean))]

  function urlPrioridade(p: string | undefined) {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (categoria) params.set('categoria', categoria)
    if (p) params.set('prioridade', p)
    const qs = params.toString()
    return qs ? `/ideias?${qs}` : '/ideias'
  }

  function urlCategoria(cat: string | undefined) {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (prioridade) params.set('prioridade', prioridade)
    if (cat) params.set('categoria', cat)
    const qs = params.toString()
    return qs ? `/ideias?${qs}` : '/ideias'
  }

  const chipBase = 'shrink-0 text-[11px] font-headline font-semibold uppercase tracking-[0.05em] px-4 py-2 rounded-full transition-all duration-150 ease-out'
  const chipAtivo = 'bg-[#141c2e] text-[#4f7cff] border border-[#4f7cff]/30'
  const chipInativo = 'bg-white/5 text-[#f0ede8] hover:bg-white/10 border border-transparent'

  return (
    <main className="min-h-screen bg-[#080c14] flex flex-col pb-32">

      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-6 pb-2 max-w-[672px] mx-auto w-full">
        <div>
          <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4f7cff] block mb-1">
            Arquivo Pessoal
          </span>
          <h1 className="font-headline font-bold text-[26px] tracking-[-0.02em] text-[#f0ede8]">
            Minhas Ideias {ideias?.length ? `(${ideias.length})` : ''}
          </h1>
        </div>
      </header>

      {/* Search */}
      <div className="px-6 pt-4 max-w-[672px] mx-auto w-full">
        <BuscaInput />
      </div>

      {/* Filtros de prioridade */}
      <div className="flex gap-2 px-6 pt-4 pb-1 overflow-x-auto scrollbar-none max-w-[672px] mx-auto w-full">
        <Link href={urlPrioridade(undefined)} className={`${chipBase} ${!prioridade ? chipAtivo : chipInativo}`}>
          Potencial
        </Link>
        <Link href={urlPrioridade('alta')} className={`${chipBase} ${prioridade === 'alta' ? chipAtivo : chipInativo}`}>
          🔥 Alta
        </Link>
        <Link href={urlPrioridade('media')} className={`${chipBase} ${prioridade === 'media' ? chipAtivo : chipInativo}`}>
          ⚡ Média
        </Link>
        <Link href={urlPrioridade('baixa')} className={`${chipBase} ${prioridade === 'baixa' ? chipAtivo : chipInativo}`}>
          🧊 Baixa
        </Link>
      </div>

      {/* Filtros por categoria */}
      {categorias.length > 0 && (
        <div className="flex gap-2 px-6 pb-2 overflow-x-auto scrollbar-none max-w-[672px] mx-auto w-full">
          {categorias.map(cat => (
            <Link
              key={cat}
              href={urlCategoria(categoria === cat ? undefined : cat)}
              className={`${chipBase} ${categoria === cat ? chipAtivo : chipInativo}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Cards */}
      <div className="flex-1 px-6 py-4 space-y-6 max-w-[672px] mx-auto w-full">
        {!ideias?.length && (
          <div className="text-center py-16 space-y-3">
            <p className="text-[#8a9bb0] text-sm">
              {busca
                ? `Nenhuma ideia encontrada para "${busca}".`
                : prioridade
                ? 'Nenhuma ideia nessa faixa ainda.'
                : categoria
                ? `Nenhuma ideia na categoria "${categoria}".`
                : 'Nenhuma ideia ainda.'}
            </p>
            <Link href="/captura" className="inline-block text-[#f0ede8] text-sm underline hover:opacity-70 transition-opacity">
              Adicionar nova ideia →
            </Link>
          </div>
        )}

        {ideias?.map(ideia => {
          const score: number | null = ideia.potencial_score ?? null
          const estilo = estiloCard(score)
          const badge = scoreBadge(score)

          return (
            <Link key={ideia.id} href={`/ideia/${ideia.id}`} className={`block transition-opacity duration-200 ${estilo.opacity}`}>
              <div className={`bg-[#0e1420] ${estilo.border} rounded-xl p-6 space-y-3 hover:bg-[#141c2e] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out`}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568]">
                    {ideia.categoria || 'geral'}
                  </span>
                  {badge && score !== null && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 ${badge.bg} rounded-full`}>
                      <span className={`font-headline text-[12px] font-bold ${badge.text}`}>{score}</span>
                    </div>
                  )}
                </div>

                {/* Título */}
                <h3 className="font-headline font-bold text-[18px] leading-tight text-[#f0ede8]">
                  {ideia.titulo || ideia.resumo || ideia.conteudo}
                </h3>

                {/* Resumo */}
                {ideia.resumo && ideia.titulo && (
                  <p className="text-[#8a9bb0] text-[14px] leading-relaxed line-clamp-2">
                    {ideia.resumo}
                  </p>
                )}

                {/* Tags */}
                {ideia.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap pt-0.5">
                    {ideia.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[#4a5568] text-xs">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 text-[#4a5568] text-[12px]">
                  <span>{new Date(ideia.criado_em).toLocaleDateString('pt-BR')}</span>
                  {ideia.aprovada && <span className="text-emerald-500">✓ aprovada</span>}
                </div>

              </div>
            </Link>
          )
        })}
      </div>

      {/* FAB pill */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <Link
          href="/captura"
          className="bg-[#f0ede8] text-[#080c14] px-7 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 active:scale-95 transition-transform duration-150 hover:opacity-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <span className="font-headline font-bold text-[12px] uppercase tracking-[0.08em]">Nova Ideia</span>
        </Link>
      </div>

      <BottomNav />
    </main>
  )
}
