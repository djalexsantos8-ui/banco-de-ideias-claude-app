interface CardAcaoProps {
  texto?: string | null
}

export default function CardAcao({ texto }: CardAcaoProps) {
  if (!texto?.trim()) return null

  return (
    <div className="bg-[#f97316] rounded-2xl px-6 py-6 shadow-lg space-y-2">
      <span className="font-headline text-[11px] font-bold uppercase tracking-[0.05em] text-[#080c14] bg-black/10 px-2 py-0.5 rounded">
        Prioridade Máxima
      </span>
      <h3 className="font-headline font-extrabold text-[20px] text-[#080c14] leading-tight">
        O que fazer agora
      </h3>
      <p className="text-[15px] leading-[1.7] text-[#080c14] font-medium opacity-90">
        {texto}
      </p>
    </div>
  )
}
