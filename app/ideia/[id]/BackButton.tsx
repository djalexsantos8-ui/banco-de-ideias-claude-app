'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="text-[#8a9bb0] hover:text-[#f0ede8] transition-all duration-200 ease-out text-sm"
    >
      ← Voltar
    </button>
  )
}
