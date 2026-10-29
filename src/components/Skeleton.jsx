export function SkeletonGrid({ cards = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="card h-24 animate-pulse p-4">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="mt-3 h-7 w-12 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card h-28 animate-pulse" />
      ))}
    </div>
  )
}
