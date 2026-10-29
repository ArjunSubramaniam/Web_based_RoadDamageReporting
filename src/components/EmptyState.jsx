export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="card border-dashed px-6 py-12 text-center">
      {Icon ? (
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400">
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
      <h3 className="mt-3 text-base font-semibold text-navy-950">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="card flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-200 border-t-navy-700" />
        {label}
      </div>
    </div>
  )
}
