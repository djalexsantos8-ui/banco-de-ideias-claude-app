export default function LoadingIdeia() {
  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col pb-32 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 max-w-[672px] mx-auto w-full">
        <div className="h-4 w-16 bg-white/5 rounded-full" />
        <div className="h-6 w-16 bg-white/5 rounded-full" />
      </div>

      <div className="flex-1 px-6 py-8 max-w-[672px] mx-auto w-full space-y-10">

        {/* Label + título */}
        <div className="space-y-4">
          <div className="h-2.5 w-32 bg-[#4f7cff]/20 rounded-full" />
          <div className="h-8 w-4/5 bg-white/8 rounded-xl" />
          <div className="h-8 w-3/5 bg-white/5 rounded-xl" />
          <div className="h-4 w-full bg-white/5 rounded-lg mt-2" />
        </div>

        {/* Score row */}
        <div className="flex justify-between border-t border-white/5 pt-6">
          <div className="space-y-2">
            <div className="h-2.5 w-14 bg-white/5 rounded-full" />
            <div className="h-10 w-12 bg-white/8 rounded-lg" />
          </div>
          <div className="space-y-2 items-center flex flex-col">
            <div className="h-2.5 w-16 bg-white/5 rounded-full" />
            <div className="h-5 w-12 bg-white/5 rounded-lg" />
          </div>
          <div className="space-y-2 items-end flex flex-col">
            <div className="h-2.5 w-10 bg-white/5 rounded-full" />
            <div className="h-5 w-12 bg-white/5 rounded-lg" />
          </div>
        </div>

        {/* Texto blocks */}
        <div className="space-y-3">
          <div className="h-2.5 w-28 bg-white/5 rounded-full" />
          <div className="bg-[#0e1420] rounded-xl p-5 space-y-2">
            <div className="h-4 w-full bg-white/5 rounded-lg" />
            <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
            <div className="h-4 w-4/6 bg-white/5 rounded-lg" />
          </div>
        </div>

        {/* Card laranja skeleton */}
        <div className="bg-[#f97316]/20 rounded-2xl p-6 space-y-3">
          <div className="h-3 w-24 bg-white/10 rounded-full" />
          <div className="h-6 w-40 bg-white/10 rounded-lg" />
          <div className="h-4 w-full bg-white/10 rounded-lg" />
          <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[#0e1420] rounded-xl p-4 space-y-2">
              <div className="h-2.5 w-16 bg-white/5 rounded-full" />
              <div className="h-3 w-full bg-white/5 rounded-lg" />
              <div className="h-3 w-4/5 bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
