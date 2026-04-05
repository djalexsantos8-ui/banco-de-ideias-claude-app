import { createServerSupabaseClient } from './supabase-server'

export type IdeiaSimialar = {
  id: string
  titulo: string
  resumo: string
  potencial: string
  similarity: number // 0–100 arredondado
}

/**
 * Busca ideias semanticamente similares usando a função RPC buscar_similares.
 * Retorna vazio silenciosamente em qualquer falha — nunca quebra a página.
 */
export async function buscarIdeiasSimilares(
  embedding: number[],
  userId: string,
  excluirId: string,
  limite = 3
): Promise<IdeiaSimialar[]> {
  if (!embedding || embedding.length === 0) return []

  try {
    const supabase = await createServerSupabaseClient()

    // Pede N+1 para poder excluir a própria ideia sem ficar curto
    const { data, error } = await supabase.rpc('buscar_similares', {
      query_embedding: embedding,
      user_id_param: userId,
      match_count: limite + 2,
    })

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SIMILARES] RPC error:', error.message)
      }
      return []
    }

    if (!data || !Array.isArray(data)) return []

    return (data as Array<{
      id: string
      titulo: string
      resumo: string
      potencial: string
      similarity: number
    }>)
      .filter(i => i.id !== excluirId)
      .filter(i => (i.similarity ?? 0) >= 0.40)   // threshold: só similares com ≥ 40%
      .slice(0, limite)
      .map(i => ({
        id: i.id,
        titulo: i.titulo || 'Ideia sem título',
        resumo: i.resumo || '',
        potencial: i.potencial || '',
        similarity: Math.round((i.similarity ?? 0) * 100),
      }))
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SIMILARES] Erro inesperado:', err)
    }
    return []
  }
}

/**
 * Normaliza o embedding retornado pelo Supabase.
 * pgvector pode retornar string "[0.1, 0.2, ...]" ou array já parseado.
 */
export function normalizarEmbedding(raw: unknown): number[] | null {
  if (!raw) return null
  if (Array.isArray(raw)) return raw as number[]
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as number[]
    } catch {
      return null
    }
  }
  return null
}
