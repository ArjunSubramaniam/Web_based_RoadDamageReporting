import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from '../hooks/useToast.jsx'
import { resetDevelopmentData } from '../services/reportService.js'
import { validateProfile } from '../utils/validation.js'

export function Profile() {
  const { user, saveProfile, syncSession } = useAuth()
  const { push } = useToast()
  const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '', city: user.city || '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetBusy, setResetBusy] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = validateProfile(form)
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      await saveProfile(form)
      push('Profile updated.')
    } catch (error) {
      push(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const onReset = async () => {
    setResetBusy(true)
    try {
      await resetDevelopmentData()
      const session = syncSession()
      if (session) {
        setForm({ name: session.name || '', phone: session.phone || '', city: session.city || '' })
      }
      push('Development records restored to the original sample set.')
      setResetOpen(false)
    } catch (error) {
      push(error.message, 'error')
    } finally {
      setResetBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-navy-950">Profile & settings</h1>
      <form onSubmit={onSubmit} className="card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Full name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input mt-1" />
            {errors.name ? <span className="text-sm font-normal text-red-700">{errors.name}</span> : null}
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="input mt-1" />
            {errors.phone ? <span className="text-sm font-normal text-red-700">{errors.phone}</span> : null}
          </label>
          <label className="block text-sm font-medium">
            City
            <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="input mt-1" />
            {errors.city ? <span className="text-sm font-normal text-red-700">{errors.city}</span> : null}
          </label>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-2 font-medium capitalize">{user.role === 'admin' ? 'Administrator' : user.role}</p>
          </div>
          {user.teamName ? (
            <div>
              <p className="text-sm text-slate-500">Team</p>
              <p className="mt-2 font-medium">{user.teamName}</p>
            </div>
          ) : null}
        </div>
        <button disabled={busy} className="btn-primary">
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      {user.role === 'admin' ? (
        <section className="card p-5">
          <h2 className="font-semibold text-navy-900">Development data</h2>
          <p className="mt-1 text-sm text-slate-600">
            Restore the original sample reports, users, and notifications. Reports created during this session will be removed.
          </p>
          <button type="button" onClick={() => setResetOpen(true)} className="mt-4 h-11 rounded-xl border border-red-200 px-4 font-medium text-red-700">
            Reset development data
          </button>
        </section>
      ) : null}

      <ConfirmDialog
        open={resetOpen}
        title="Reset development data?"
        message="This restores the original sample records and removes reports or accounts created in this browser session."
        confirmLabel="Reset data"
        tone="danger"
        busy={resetBusy}
        onClose={() => setResetOpen(false)}
        onConfirm={onReset}
      />
    </div>
  )
}
