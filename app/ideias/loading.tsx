export default function LoadingIdeias() {
  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col pb-32 animate-pulse">
      {/* Header skeleton */}
      <div className="px-6 pt-6 pb-2 max-w-[672px] mx-auto w-full">
        <div className="h-3 w-24 bg-white/5 rounded-full mb-3" />
        <div className="h-7 w-48 bg-white/8 rounded-xl" />
      </div>

      {/* Search skeleton */}
      <div className="px-6 pt-4 max-w-[672px] mx-auto w-full">
        <div className="h-11 w-full bg-[#0e1420] rounded-2xl" />
      </div>

      {/* Chips skeleton */}
      <div className="flex gap-2 px-6 pt-4 pb-2 max-w-[672px] mx-auto w-full">
        {[80, 56, 64, 60].map((w, i) => (
          <div key={i} className="h-8 bg-white/5 rounded-full" style={{ width: w }} />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="flex-1 px-6 py-4 space-y-4 max-w-[672px] mx-auto w-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#0e1420] border border-white/5 rounded-xl p-6 space-y-3">
            <div className="flex justify-between">
              <div className="h-2.5 w-16 bg-white/5 rounded-full" />
              <div className="h-5 w-10 bg-white/5 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-white/8 rounded-lg" />
            <div className="h-4 w-full bg-white/5 rounded-lg" />
            <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
            <div className="flex justify-between pt-1">
              <div className="h-3 w-20 bg-white/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
