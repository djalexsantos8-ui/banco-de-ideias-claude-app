import { createServerSupabaseClient } from '@/lib/supabase-server'
import { openai } from '@/lib/openai'
import { NextResponse } from 'next/server'

const MIN_IDEIAS = 3

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar as últimas 10 ideias do usuário
    const { data: ideias } = await supabase
      .from('ideias')
      .select('titulo, resumo, tags, categoria, potencial_score, criado_em')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false })
      .limit(10)

    if (!ideias || ideias.length < MIN_IDEIAS) {
      return NextResponse.json({ insuficiente: true })
    }

    // ── Extrair contexto do histórico ──────────────────────────────────────
    // Tags mais frequentes
    const tagFreq: Record<string, number> = {}
    ideias.forEach(i => {
      ;(i.tags || []).forEach((tag: string) => {
        tagFreq[tag] = (tagFreq[tag] || 0) + 1
      })
    })
    const topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag)

    // Média de score
    const scores = ideias
      .filter(i => i.potencial_score !== null)
      .map(i => i.potencial_score as number)
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 50

    // Temas recorrentes (categorias únicas)
    const temas = [...new Set(ideias.map(i => i.categoria).filter(Boolean))]

    // Resumos das ideias para contexto
    const resumos = ideias
      .slice(0, 6)
      .map(i => i.titulo || i.resumo || '')
      .filter(Boolean)
      .join(' | ')

    // ── Prompt para GPT ───────────────────────────────────────────────────
    const contexto = [
      `Quantidade de ideias analisadas: ${ideias.length}`,
      `Temas recorrentes: ${temas.join(', ') || 'variados'}`,
      `Tags mais frequentes: ${topTags.join(', ') || 'diversas'}`,
      `Score médio das ideias: ${avgScore}/100`,
      `Exemplos de ideias recentes: ${resumos}`,
    ].join('\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um estrategista criativo. Analisa o histórico de ideias de um empreendedor e sugere UMA ideia nova, estratégica e relevante para ele — algo que ele provavelmente ainda não pensou mas que conecta com seus padrões.

Retorne APENAS JSON válido com esta estrutura:
{
  "titulo": "Nome direto da ideia (5-8 palavras)",
  "descricao": "O que é e como funciona, em 2-3 frases diretas.",
  "por_que_agora": "Por que faz sentido para este usuário agora. 1 frase.",
  "tipo": "nova ideia | combinação | otimização"
}

REGRAS:
- Nunca use "inovador", "disruptivo", "revolucionário"
- Seja específico — use os temas e tags do contexto
- Tom: consultor direto, não animador de plateia
- Responda APENAS o JSON. Nenhum texto fora.`,
        },
        {
          role: 'user',
          content: `Histórico do usuário:\n${contexto}\n\nSugira uma ideia estratégica.`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    })

    const raw = completion.choices[0].message.content || '{}'

    if (process.env.NODE_ENV === 'development') {
      console.log('[SUGESTÃO] Resposta IA:', raw)
    }

    const sugestao = JSON.parse(raw)

    // Validação mínima
    if (!sugestao.titulo || !sugestao.descricao) {
      return NextResponse.json({ error: 'Sugestão inválida' }, { status: 500 })
    }

    return NextResponse.json({
      titulo: String(sugestao.titulo),
      descricao: String(sugestao.descricao),
      por_que_agora: String(sugestao.por_que_agora || ''),
      tipo: String(sugestao.tipo || 'nova ideia'),
    })
  } catch (error) {
    console.error('[SUGESTÃO] Erro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
