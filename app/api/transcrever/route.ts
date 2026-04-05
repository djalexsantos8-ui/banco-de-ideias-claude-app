import { createServerSupabaseClient } from '@/lib/supabase-server'
import { openai } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const form = await request.formData()
    const audio = form.get('audio') as File
    if (!audio) return NextResponse.json({ error: 'Áudio não enviado' }, { status: 400 })

    const transcricao = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'pt',
    })

    return NextResponse.json({ texto: transcricao.text })
  } catch (error) {
    console.error('Erro ao transcrever:', error)
    return NextResponse.json({ error: 'Erro ao transcrever' }, { status: 500 })
  }
}
