import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/Brand.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from '../hooks/useToast.jsx'
import { validateRegister } from '../utils/validation.js'

const empty = { name: '', email: '', phone: '', city: '', password: '', confirm: '' }

export function Register() {
  const { register } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = validateRegister(form)
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      await register(form)
      push('Account created. Welcome to RoadWatch.')
      navigate('/citizen')
    } catch (error) {
      setErrors({ email: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef2f7] px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <BrandMark />
          <Link to="/" className="text-sm font-medium text-navy-700">
            Back
          </Link>
        </div>
        <form onSubmit={onSubmit} className="card space-y-3 p-6 sm:p-7">
          <h1 className="text-2xl font-semibold text-navy-950">Create a citizen account</h1>
          <p className="text-sm text-slate-600">Staff accounts are provisioned by an administrator.</p>
          {[
            ['name', 'Full name', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'tel'],
            ['city', 'City', 'text'],
            ['password', 'Password', 'password'],
            ['confirm', 'Confirm password', 'password'],
          ].map(([key, label, type]) => (
            <label key={key} className="block text-sm font-medium text-slate-700">
              {label}
              <input type={type} value={form[key]} onChange={(event) => set(key, event.target.value)} className="input mt-1" />
              {errors[key] ? <span className="text-sm font-normal text-red-700">{errors[key]}</span> : null}
            </label>
          ))}
          <button disabled={busy} className="btn-primary w-full">
            {busy ? 'Creating account…' : 'Register'}
          </button>
          <p className="text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-blue-700 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
