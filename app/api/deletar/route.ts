import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ideias')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro ao deletar ideia:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
