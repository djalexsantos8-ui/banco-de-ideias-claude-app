'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="text-4xl">✉️</div>
          <p className="text-xl font-medium text-gray-900">Verifique seu email</p>
          <p className="text-gray-500 text-sm">Enviamos um link para <strong>{email}</strong></p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm px-6">
        <div className="text-center space-y-1 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Banco de Ideias</h1>
          <p className="text-gray-400 text-sm">Suas ideias, organizadas.</p>
        </div>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Enviando...' : 'Entrar com email'}
        </button>
      </form>
    </main>
  )
}
