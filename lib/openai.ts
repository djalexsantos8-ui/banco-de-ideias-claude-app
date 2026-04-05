import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Fallback seguro — nunca deixa a UI quebrar
function buildFallback(conteudo: string) {
  return {
    titulo: 'Ideia capturada',
    resumo_curto: conteudo.slice(0, 100),
    visao_ideia: null,
    como_funciona: null,
    aplicacoes: [],
    pontos_fortes: [],
    desafios: [],
    requisitos: [],
    o_que_fazer: null,
    proximos_passos: [],
    tags: ['ideia'],
    categoria: 'geral',
    potencial: 'médio',
    potencial_score: 50,
    dificuldade: 'médio',
    custo: 'médio',
  }
}

export async function processarIdeia(conteudo: string) {
  let rawContent = ''

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um estrategista de ideias. Analisa ideias brutas e as transforma em dossiês estruturados, claros e acionáveis. Escreve em português brasileiro com linguagem direta e sem clichês de IA.

Dado o conteúdo de uma ideia, retorne APENAS um JSON válido com exatamente esta estrutura:

{
  "titulo": "Título direto com 4-8 palavras. Sem verbos no infinitivo.",
  "resumo_curto": "Uma frase. Máximo 20 palavras. A essência da ideia.",
  "visao_ideia": "O problema que resolve ou a oportunidade que cria. 2-3 frases. Foque no impacto. Tom: direto e realista.",
  "como_funciona": "A mecânica da ideia. Como funciona na prática. 2-4 frases objetivas. Foco em processo e lógica.",
  "aplicacoes": ["Aplicação concreta 1", "Aplicação concreta 2", "Aplicação concreta 3"],
  "pontos_fortes": ["Vantagem ou diferencial real", "Por que pode dar certo"],
  "desafios": ["Obstáculo real e específico", "Risco ou limitação importante"],
  "requisitos": ["O que é necessário para executar — habilidade, recurso ou conhecimento"],
  "o_que_fazer": "Uma única ação concreta. Máximo 2 frases. O próximo movimento lógico.",
  "proximos_passos": ["Curto prazo (essa semana): ação específica", "Médio prazo (esse mês): ação específica", "Validação: como testar se a ideia funciona"],
  "tags": ["palavra1", "palavra2", "palavra3"],
  "categoria": "uma palavra em português",
  "potencial": "fraco | médio | forte",
  "potencial_score": 75,
  "dificuldade": "baixo | médio | alto",
  "custo": "baixo | médio | alto"
}

REGRAS OBRIGATÓRIAS:
- Responda APENAS com JSON válido. Sem markdown, sem texto fora do JSON.
- Arrays: mínimo 2 itens, máximo 5 itens.
- Strings: nunca vazias — use um valor curto e direto como fallback.
- potencial_score: número inteiro entre 0 e 100.
- tags: minúsculas, sem # ou caracteres especiais.
- Nunca use: "inovador", "revolucionário", "disruptivo", "transformador".
- Tom: consultor sênior, não assistente genérico.`,
        },
        {
          role: 'user',
          content: conteudo,
        },
      ],
      response_format: { type: 'json_object' },
    })

    rawContent = completion.choices[0].message.content || '{}'

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('[IA] Resposta bruta:', rawContent.slice(0, 500))
    }

    const parsed = JSON.parse(rawContent)

    // Log do JSON parseado em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('[IA] Campos retornados:', Object.keys(parsed).join(', '))
    }

    return parsed

  } catch (erro) {
    console.error('[IA] Erro ao processar ideia:', erro)

    if (rawContent) {
      console.error('[IA] Conteúdo bruto que falhou:', rawContent.slice(0, 300))
    }

    // Retorna fallback com conteúdo original — UI nunca quebra
    return buildFallback(conteudo)
  }
}

export async function gerarEmbedding(texto: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texto,
  })
  return response.data[0].embedding
}

export async function explicarResultados(
  query: string,
  ideias: { resumo: string; categoria: string }[]
) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Você explica em 1 frase curta por que cada ideia é relevante para uma busca. Responda em JSON: { "explicacoes": ["...", "...", "..."] }',
        },
        {
          role: 'user',
          content: `Busca: "${query}"\n\nIdeias encontradas:\n${ideias.map((i, n) => `${n + 1}. ${i.resumo}`).join('\n')}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0].message.content || '{}'
    const parsed = JSON.parse(raw)
    return parsed.explicacoes || ideias.map(() => 'Ideia relacionada à sua busca.')
  } catch {
    return ideias.map(() => 'Ideia relacionada à sua busca.')
  }
}
