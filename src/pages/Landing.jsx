import { ClipboardCheck, MapPinned, Shield, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/Brand.jsx'

export function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbe7f5,transparent_40%),linear-gradient(#eef2f7,#f8fafc)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <BrandMark />
        <div className="flex gap-2">
          <Link to="/login" className="btn-secondary h-10 px-4 text-sm">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary h-10 px-4 text-sm">
            Register
          </Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Civic operations</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl lg:text-5xl">
            Road damage reporting and maintenance, in one place.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Citizens report hazards, administrators verify and assign crews, and maintenance teams update repair progress from a shared workspace.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary h-12 px-5">
              Submit a report
            </Link>
            <Link to="/login" className="btn-secondary h-12 px-5">
              Staff sign in
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: ClipboardCheck, title: 'Structured reporting', text: 'Capture location, severity, photos, and a unique report ID.' },
            { icon: Shield, title: 'Verification workflow', text: 'Review, verify, reject, and assign work with a recorded history.' },
            { icon: Wrench, title: 'Field updates', text: 'Crews log progress, evidence, and resolution for administrator closure.' },
            { icon: MapPinned, title: 'Mapped operations', text: 'Inspect reports that include coordinates on OpenStreetMap.' },
          ].map((item) => (
            <article key={item.title} className="card card-hover p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <item.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-semibold text-navy-950">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
