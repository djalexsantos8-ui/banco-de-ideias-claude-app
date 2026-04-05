import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AcoesIdeia from './AcoesIdeia'
import BackButton from './BackButton'
import TranscricaoIdeia from './TranscricaoIdeia'
import BlocoTexto from '@/components/BlocoTexto'
import BlocoLista from '@/components/BlocoLista'
import CardAcao from '@/components/CardAcao'
import IdeiasSimilares from '@/components/IdeiasSimilares'
import BottomNav from '@/components/BottomNav'
import { buscarIdeiasSimilares, normalizarEmbedding } from '@/lib/buscar-similares'
import FadeInContainer from './FadeInContainer'

function corScoreTexto(score: number | null): string {
  if (score === null) return 'text-[#4a5568]'
  if (score <= 30) return 'text-red-400'
  if (score <= 60) return 'text-yellow-400'
  return 'text-[#4f7cff]'
}

const corEscala: Record<string, string> = {
  baixo: 'text-emerald-400',
  médio: 'text-yellow-400',
  alto: 'text-red-400',
}

export default async function IdeiaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: ideia, error } = await supabase
    .from('ideias')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !ideia) redirect('/home')

  const score: number | null = ideia.potencial_score ?? null

  const embeddingAtual = normalizarEmbedding(ideia.embedding)
  const similares = embeddingAtual
    ? await buscarIdeiasSimilares(embeddingAtual, user.id, id)
    : []

  const visao = ideia.visao_ideia || ideia.detalhamento || null
  const custo = ideia.custo_estimado || null

  const temAnalise = ideia.aplicacoes?.length || ideia.pontos_fortes?.length || ideia.desafios?.length || ideia.requisitos?.length
  const temProximos = ideia.proximos_passos?.length

  return (
    <main className="min-h-screen bg-[#080c14] flex flex-col pb-32">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5 max-w-[672px] mx-auto w-full sticky top-0 bg-[#080c14] z-40">
        <BackButton />
        <span className="font-headline text-[10px] text-[#4a5568] uppercase tracking-widest bg-[#0e1420] border border-white/8 px-3 py-1 rounded-full">
          {ideia.categoria || 'geral'}
        </span>
      </header>

      <FadeInContainer className="flex-1 px-6 py-8 max-w-[672px] mx-auto w-full space-y-10">

        {/* ── SEÇÃO 1: Hero ─────────────────────────────────────── */}
        <section className="space-y-6">

          {/* Label editorial */}
          <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4f7cff] block">
            Revisão de Inteligência
          </span>

          {/* Título + menu */}
          <div className="relative pr-10">
            <AcoesIdeia id={ideia.id} aprovada={ideia.aprovada} />
            <h1 className="font-headline font-extrabold text-[28px] md:text-[36px] text-[#f0ede8] leading-tight tracking-[-0.02em]">
              {ideia.titulo || ideia.resumo || 'Ideia capturada'}
            </h1>
            {ideia.resumo && ideia.titulo && (
              <p className="text-[15px] text-[#4a5568] leading-relaxed mt-3 max-w-lg">
                {ideia.resumo}
              </p>
            )}
          </div>

          {/* Tags */}
          {ideia.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ideia.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[#f0ede8] text-xs px-3 py-1 rounded-full bg-[#141c2e]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Score + Indicadores */}
          <div className="flex justify-between items-end border-t border-white/5 pt-6">
            <div className="flex flex-col">
              <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568] mb-1">Potencial</span>
              {score !== null ? (
                <span className={`font-headline text-[40px] font-extrabold leading-none ${corScoreTexto(score)}`}>
                  {score}
                </span>
              ) : (
                <span className="text-[#4a5568] text-lg">—</span>
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568] mb-1">Execução</span>
              <span className={`text-[15px] font-semibold ${corEscala[ideia.dificuldade] || 'text-[#f0ede8]'}`}>
                {ideia.dificuldade || '—'}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568] mb-1">Custo</span>
              <span className={`text-[15px] font-semibold ${corEscala[custo || ''] || 'text-[#f0ede8]'}`}>
                {custo || '—'}
              </span>
            </div>
          </div>
        </section>

        {/* ── SEÇÃO 2: Visão / Como funciona ───────────────────── */}
        {(visao || ideia.como_funciona) && (
          <section className="space-y-4">
            <BlocoTexto label="Por que essa ideia existe" texto={visao} copiavel destaque colapsavel />
            <BlocoTexto label="Como funciona" texto={ideia.como_funciona} copiavel />
          </section>
        )}

        {/* ── SEÇÃO 3: Card de ação (laranja) ──────────────────── */}
        <CardAcao texto={ideia.o_que_fazer} />

        {/* ── SEÇÃO 4: Análise em grid 2-col ───────────────────── */}
        {temAnalise ? (
          <section>
            <h3 className="font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4a5568] mb-6">
              Análise Detalhada
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideia.aplicacoes?.length > 0 && (
                <BlocoLista label="Aplicações" itens={ideia.aplicacoes} />
              )}
              {ideia.pontos_fortes?.length > 0 && (
                <BlocoLista label="Pontos fortes" icone="✓" itens={ideia.pontos_fortes} corItem="text-emerald-400" />
              )}
              {ideia.desafios?.length > 0 && (
                <BlocoLista label="Desafios" icone="⚠" itens={ideia.desafios} corItem="text-yellow-400" />
              )}
              {ideia.requisitos?.length > 0 && (
                <BlocoLista label="Requisitos" icone="◇" itens={ideia.requisitos} />
              )}
            </div>
          </section>
        ) : null}

        {/* ── SEÇÃO 5: Próximos passos ──────────────────────────── */}
        {temProximos ? (
          <section>
            <BlocoLista label="Próximos passos" itens={ideia.proximos_passos} numerado />
          </section>
        ) : null}

        {/* ── SEÇÃO 6: Similares ───────────────────────────────── */}
        <IdeiasSimilares similares={similares} temEmbedding={!!embeddingAtual} />

        {/* ── SEÇÃO 7: Transcrição + meta ──────────────────────── */}
        <section className="border-t border-white/5 pt-8 space-y-4">
          <TranscricaoIdeia conteudo={ideia.conteudo} />

          {ideia.aprovada && (
            <p className="text-center text-emerald-500 text-sm py-1">
              ✓ Ideia aprovada
            </p>
          )}

          <p className="text-[#4a5568] text-xs text-center">
            {new Date(ideia.criado_em).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </section>

      </FadeInContainer>

      <BottomNav />
    </main>
  )
}
