import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/Brand.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from '../hooks/useToast.jsx'

const DEMO_ACCOUNTS = [
  { role: 'Citizen', email: 'arjun.kumar@roadwatch.app', password: 'Watch#2026' },
  { role: 'Citizen', email: 'priya.venkatesh@roadwatch.app', password: 'Watch#2026' },
  { role: 'Citizen', email: 'karthik.selvam@roadwatch.app', password: 'Watch#2026' },
  { role: 'Administrator', email: 'meena.raj@roadwatch.app', password: 'Watch#2026' },
  { role: 'Maintenance', email: 'suresh.balan@roadwatch.app', password: 'Watch#2026' },
  { role: 'Maintenance', email: 'lakshmi.devi@roadwatch.app', password: 'Watch#2026' },
]

export function Login() {
  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const goHome = (role) => {
    navigate(role === 'admin' ? '/admin' : role === 'maintenance' ? '/maintenance' : '/citizen')
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const session = await login(email, password)
      push(`Signed in as ${session.name}.`)
      goHome(session.role)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-navy-900 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <BrandMark inverted />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Civic operations</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight">Report, verify, and track road repairs in one workspace.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-navy-200">
            Citizens submit hazards, administrators assign crews, and maintenance teams close the loop with progress evidence.
          </p>
        </div>
        <p className="text-xs text-navy-300">RoadWatch · Road damage reporting and maintenance</p>
      </aside>

      <div className="flex min-h-screen items-center bg-[#eef2f7] px-4 py-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <BrandMark />
            <Link to="/" className="text-sm font-medium text-navy-700">
              Back
            </Link>
          </div>
          <Link to="/" className="mb-4 hidden text-sm font-medium text-navy-700 lg:inline-block">
            ← Back to home
          </Link>
          <div className="card p-6 sm:p-7">
            <h1 className="text-2xl font-semibold text-navy-950">Sign in</h1>
            <p className="mt-1 text-sm text-slate-600">Use your citizen or staff credentials, or pick a demo account below.</p>
            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-1" required />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-1" required />
              </label>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <button disabled={busy} className="btn-primary w-full">
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex items-center gap-2 text-navy-900">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-semibold">Demo Login</h2>
              </div>
              <p className="mt-1 text-xs text-slate-600">Select an account to fill email and password, then click Sign in.</p>
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                {DEMO_ACCOUNTS.map((account) => {
                  const selected = email === account.email
                  return (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => {
                        setEmail(account.email)
                        setPassword(account.password)
                        setError('')
                      }}
                      className={`flex w-full flex-col rounded-xl border px-3 py-2.5 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${
                        selected ? 'border-blue-500 bg-white ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:border-navy-300'
                      }`}
                    >
                      <span className="text-sm font-medium text-navy-900">{account.role}</span>
                      <span className="min-w-0 text-xs text-slate-600 sm:text-right">
                        <span className="block truncate">{account.email}</span>
                        <span className="font-mono">{account.password}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              New citizen?{' '}
              <Link to="/register" className="font-medium text-blue-700 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
