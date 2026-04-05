import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { id } = await request.json()

    const { error } = await supabase
      .from('ideias')
      .update({ aprovada: true })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
