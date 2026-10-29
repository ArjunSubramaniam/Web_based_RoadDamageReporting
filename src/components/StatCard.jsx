export function StatCard({ label, value, icon: Icon, tone = 'navy' }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  }
  const bars = {
    navy: 'bg-navy-700',
    amber: 'bg-amber-500',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    slate: 'bg-slate-400',
  }

  return (
    <article className="card relative overflow-hidden p-4">
      <span className={`absolute inset-y-0 left-0 w-1 ${bars[tone]}`} />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-navy-950">{value}</p>
        </div>
        {Icon ? (
          <span className={`rounded-xl p-2.5 ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </article>
  )
}
