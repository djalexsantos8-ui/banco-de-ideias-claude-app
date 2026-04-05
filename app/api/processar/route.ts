import { createServerSupabaseClient } from '@/lib/supabase-server'
import { processarIdeia, gerarEmbedding } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { conteudo, tipo_midia = 'texto', url_midia, ideia_id } = body

    if (!conteudo?.trim()) {
      return NextResponse.json({ error: 'Conteúdo vazio' }, { status: 400 })
    }

    // Processar com IA (já tem try/catch e fallback interno)
    const a = await processarIdeia(conteudo)

    // Helper: garantir array válido
    const arr = (v: unknown) =>
      Array.isArray(v) && v.length > 0 ? v : []

    // Helper: garantir string ou null
    const str = (v: unknown) =>
      typeof v === 'string' && v.trim() ? v.trim() : null

    // Helper: garantir inteiro 0-100
    const score = (v: unknown) => {
      const n = Number(v)
      if (isNaN(n)) return null
      return Math.min(100, Math.max(0, Math.round(n)))
    }

    // Gerar embedding com texto enriquecido (falha silenciosa — salva sem vetor)
    const textoEmbedding = [
      conteudo,
      str(a.resumo_curto) || '',
      str(a.visao_ideia) || '',
      arr(a.tags).join(' '),
    ].join(' ').trim()

    let embedding: number[] | null = null
    try {
      embedding = await gerarEmbedding(textoEmbedding)
    } catch (embErr) {
      console.error('[API] Embedding falhou, salvando sem vetor:', embErr)
    }

    const dados = {
      user_id: user.id,
      conteudo,
      tipo_midia,
      url_midia: url_midia || null,

      // Campos principais
      titulo:          str(a.titulo) || 'Ideia capturada',
      resumo:          str(a.resumo_curto) || str(a.resumo) || '',
      detalhamento:    str(a.visao_ideia) || str(a.detalhamento) || '',

      // Campos novos
      visao_ideia:     str(a.visao_ideia),
      como_funciona:   str(a.como_funciona),
      aplicacoes:      arr(a.aplicacoes),
      pontos_fortes:   arr(a.pontos_fortes),
      desafios:        arr(a.desafios),
      requisitos:      arr(a.requisitos),
      o_que_fazer:     str(a.o_que_fazer),
      proximos_passos: arr(a.proximos_passos),

      // Metadados
      tags:            arr(a.tags).length ? arr(a.tags) : ['ideia'],
      categoria:       str(a.categoria) || 'geral',
      potencial:       str(a.potencial) || 'médio',
      potencial_score: score(a.potencial_score),
      dificuldade:     str(a.dificuldade),
      custo_estimado:  str(a.custo),

      embedding,
      aprovada: false,
    }

    // Validação pré-insert: campos obrigatórios
    if (!dados.user_id || !dados.conteudo) {
      console.error('[API] Campos obrigatórios ausentes antes do insert')
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    if (process.env.NODE_ENV === 'development') {
      const camposPreenchidos = Object.entries(dados)
        .filter(([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0))
        .map(([k]) => k)
      console.log('[API] IA RESPONSE (processada):', JSON.stringify(a, null, 2))
      console.log('[API] PARSED para insert:', camposPreenchidos.join(', '))
      console.log('[API] Embedding gerado:', embedding ? `${embedding.length} dims` : 'nulo')
    }

    let ideia

    if (ideia_id) {
      const { data, error } = await supabase
        .from('ideias')
        .update(dados)
        .eq('id', ideia_id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      ideia = data
    } else {
      const { data, error } = await supabase
        .from('ideias')
        .insert(dados)
        .select()
        .single()

      if (error) throw error
      ideia = data
    }

    return NextResponse.json({ id: ideia.id })

  } catch (error) {
    console.error('[API] Erro ao processar ideia:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
