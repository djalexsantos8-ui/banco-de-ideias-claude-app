'use client'

import { useEffect, useState } from 'react'

type Frase = { texto: string; autor?: string }

const frases: Frase[] = [
  // Psicologia da ideia
  { texto: 'Ideias não registradas se perdem em horas.' },
  { texto: 'Você está organizando o que a maioria deixa escapar.' },
  { texto: 'O cérebro humano esquece 70% das ideias em 24 horas.' },
  { texto: 'Registrar é o primeiro ato de execução.' },
  { texto: 'Cada ideia que você salva é uma versão futura de você agradecendo.' },
  { texto: 'A mente cria. O papel preserva. O sistema executa.' },
  { texto: 'Ninguém lembra do que não anotou.' },
  { texto: 'Ideias são frágeis. Sistemas as tornam fortes.' },
  { texto: 'O momento de captura é o mais valioso do processo criativo.' },
  { texto: 'Uma ideia esquecida é uma oportunidade perdida.' },
  // Mentalidade
  { texto: 'Pensar é comum. Estruturar é raro.' },
  { texto: 'Clareza gera execução.' },
  { texto: 'Quem organiza o caos tem vantagem sobre quem só pensa.' },
  { texto: 'A diferença entre sonho e projeto é um plano.' },
  { texto: 'Sistemas batem força de vontade no longo prazo.' },
  { texto: 'Pequenas ações repetidas criam resultados impossíveis.' },
  // Citações
  { texto: '"Inovação distingue um líder de um seguidor." — Steve Jobs' },
  { texto: '"A melhor forma de ter uma ideia de startup é não tentar ter uma." — Paul Graham' },
  { texto: '"Conhecimento específico é aquele que não pode ser ensinado formalmente." — Naval Ravikant' },
  { texto: '"Preço é o que você paga. Valor é o que você recebe." — Warren Buffett' },
  { texto: '"O software está devorando o mundo." — Marc Andreessen' },
]

function getRandomFrase(excluirIndice?: number): { frase: Frase; indice: number } {
  let indice: number
  do {
    indice = Math.floor(Math.random() * frases.length)
  } while (indice === excluirIndice && frases.length > 1)
  return { frase: frases[indice], indice }
}

interface LoadingScreenProps {
  mensagem?: string
}

export default function LoadingScreen({ mensagem = 'Processando sua ideia...' }: LoadingScreenProps) {
  const [{ frase, indice }, setAtual] = useState(() => getRandomFrase())
  const [visivel, setVisivel] = useState(true)
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMontado(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setVisivel(false)
      setTimeout(() => {
        setAtual(prev => getRandomFrase(prev.indice))
        setVisivel(true)
      }, 500)
    }, 5000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080c14] flex flex-col items-center justify-center px-8"
      style={{ opacity: montado ? 1 : 0, transition: 'opacity 300ms ease-out' }}
    >
      {/* Glow decorativo */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4f7cff]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Spinner */}
      <div className="mb-10">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#4f7cff] animate-spin" />
      </div>

      {/* Mensagem principal */}
      <p className="text-[#f0ede8] text-base font-medium mb-8 tracking-wide text-center">
        {mensagem}
      </p>

      {/* Frase rotativa */}
      <div
        className="text-center max-w-sm px-4"
        style={{ opacity: visivel ? 1 : 0, transition: 'opacity 500ms ease-out' }}
      >
        <p className="text-[#8a9bb0] text-[15px] leading-relaxed italic">
          {frase.texto}
        </p>
      </div>
    </div>
  )
}
