'use client'

import { useEffect, useState } from 'react'

export default function FadeInContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMontado(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className={className}
      style={{
        opacity: montado ? 1 : 0,
        transform: montado ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 250ms ease-out, transform 250ms ease-out',
      }}
    >
      {children}
    </div>
  )
}
