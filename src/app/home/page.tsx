import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">Banco de Ideias</h1>
        <LogoutButton />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <button className="w-full max-w-sm bg-gray-900 text-white rounded-2xl py-5 text-base font-medium">
          Tive uma ideia
        </button>
        <button className="w-full max-w-sm bg-white text-gray-900 border border-gray-200 rounded-2xl py-5 text-base font-medium">
          Preciso de uma ideia
        </button>
      </div>

      <footer className="text-center py-6">
        <button className="text-sm text-gray-400">Minhas ideias</button>
      </footer>
    </main>
  )
}
