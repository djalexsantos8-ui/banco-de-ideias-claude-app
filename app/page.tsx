'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  required = true,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-2">
      <label className="block font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#f0ede8]/40 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          minLength={6}
          className="w-full bg-[#0e1420] border-none text-[#f0ede8] placeholder-[#4a5568] rounded-xl py-4 px-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#4f7cff] transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a5568] hover:text-[#f0ede8] active:scale-[0.85] active:opacity-70 transition-all duration-150"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  )
}

function TextInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block font-headline text-[11px] font-semibold uppercase tracking-[0.05em] text-[#f0ede8]/40 ml-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="w-full bg-[#0e1420] border-none text-[#f0ede8] placeholder-[#4a5568] rounded-xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-[#4f7cff] transition-all duration-200"
      />
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<'entrar' | 'criar'>('entrar')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function switchMode(m: 'entrar' | 'criar') {
    setMode(m)
    setError('')
    setPassword('')
    setConfirm('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (mode === 'criar') {
      if (!nome.trim()) return setError('Informe seu nome.')
      if (password !== confirm) return setError('As senhas não coincidem.')
    }

    setLoading(true)
    const supabase = createClient()

    if (mode === 'criar') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome } },
      })
      if (error) {
        setError('Erro ao criar conta. Tente novamente.')
      } else {
        router.push('/home')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email ou senha incorretos.')
      } else {
        router.push('/home')
      }
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#080c14] flex items-center justify-center px-6 py-10">

      {/* Gradient blobs decorativos */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#4f7cff]/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#f97316]/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <header className="mb-10 text-center">
          <h1 className="font-headline font-bold text-[32px] tracking-[-0.03em] text-[#f0ede8]">
            Banco de Ideias
          </h1>
        </header>

        {/* Toggle pill */}
        <div className="flex p-1 bg-[#0e1420] rounded-full w-full mb-8">
          <button
            type="button"
            onClick={() => switchMode('entrar')}
            className={`flex-1 py-2.5 text-sm font-headline font-semibold rounded-full transition-all duration-150 ease-out active:scale-[0.97] active:opacity-80 ${
              mode === 'entrar' ? 'bg-white text-[#080c14] shadow-sm' : 'text-[#f0ede8]/40 hover:text-[#f0ede8]/60'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => switchMode('criar')}
            className={`flex-1 py-2.5 text-sm font-headline font-semibold rounded-full transition-all duration-150 ease-out active:scale-[0.97] active:opacity-80 ${
              mode === 'criar' ? 'bg-white text-[#080c14] shadow-sm' : 'text-[#f0ede8]/40 hover:text-[#f0ede8]/60'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {mode === 'criar' && (
            <TextInput label="Nome" placeholder="Seu nome" value={nome} onChange={setNome} />
          )}

          <TextInput label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={setEmail} />

          <PasswordInput label="Senha" placeholder="••••••••" value={password} onChange={setPassword} />

          {mode === 'criar' && (
            <PasswordInput label="Confirmar senha" placeholder="••••••••" value={confirm} onChange={setConfirm} />
          )}

          {mode === 'entrar' && (
            <div className="flex justify-end">
              <a href="#" className="text-[13px] text-[#4f7cff] hover:opacity-80 transition-opacity">
                Esqueceu a senha?
              </a>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f0ede8] text-[#080c14] rounded-xl py-4 font-headline font-bold text-sm disabled:opacity-40 hover:opacity-95 active:scale-[0.95] active:shadow-none shadow-xl shadow-black/20 transition-all duration-150 ease-out"
          >
            {loading
              ? 'Aguarde...'
              : mode === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {mode === 'criar' && (
          <p className="text-[#4a5568] text-xs text-center mt-4">
            Senha mínima de 6 caracteres.
          </p>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="font-headline text-[11px] font-medium text-[#4a5568] tracking-wider uppercase">
            Powered by Lumora Solutions
          </p>
        </footer>
      </div>
    </main>
  )
}
