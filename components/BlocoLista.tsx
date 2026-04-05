interface BlocoListaProps {
  label: string
  icone?: string
  itens?: string[] | null
  numerado?: boolean
  corItem?: string
}

export default function BlocoLista({
  label,
  icone,
  itens,
  numerado = false,
  corItem = 'text-[#f0ede8]',
}: BlocoListaProps) {
  if (!itens?.length) return null

  return (
    <div className="bg-[#0e1420]/60 border border-white/5 rounded-2xl px-6 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium mb-3">
        {icone && <span className="mr-1">{icone}</span>}
        {label}
      </p>
      <ul className="space-y-4">
        {itens.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-zinc-500 text-xs mt-0.5 shrink-0 font-mono">
              {numerado ? `${i + 1}.` : '·'}
            </span>
            <span className={`text-[14px] leading-relaxed ${corItem}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
