import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LocationPicker } from '../components/LocationPicker.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from '../hooks/useToast.jsx'
import { createReport } from '../services/reportService.js'
import { CATEGORIES, MAX_IMAGE_BYTES, SEVERITIES } from '../utils/constants.js'
import { fileToDataUrl } from '../utils/images.js'
import { composeAddress, validateReport } from '../utils/validation.js'

const empty = {
  title: '',
  description: '',
  category: 'Pothole',
  severity: 'Medium',
  roadName: '',
  locality: '',
  city: '',
  postalCode: '',
  lat: '',
  lng: '',
  imageUrl: '',
}

export function NewReport() {
  const { user } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...empty, city: user.city || '' })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)
  const submitted = useRef(false)
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const goReview = () => {
    const next = validateReport(form)
    setErrors(next)
    if (Object.keys(next).length) return
    setStep(2)
  }

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      set('imageUrl', await fileToDataUrl(file, MAX_IMAGE_BYTES))
    } catch (error) {
      push(error.message, 'error')
    }
  }

  const locate = () => {
    if (!navigator.geolocation) {
      push('Geolocation is not available in this browser.', 'error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        set('lat', Number(position.coords.latitude.toFixed(5)))
        set('lng', Number(position.coords.longitude.toFixed(5)))
        push('Coordinates captured from this device.')
      },
      () => push('Location permission was denied or unavailable.', 'error'),
    )
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (submitted.current || busy) return
    const next = validateReport(form)
    setErrors(next)
    if (Object.keys(next).length) {
      setStep(1)
      return
    }
    submitted.current = true
    setBusy(true)
    try {
      const report = await createReport(form, user)
      push(`Report ${report.id} submitted successfully.`)
      navigate(`/citizen/reports/${report.id}`)
    } catch (error) {
      submitted.current = false
      push(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-navy-950">Submit a road damage report</h1>
      <p className="mt-1 text-sm text-slate-600">Step {step} of 2 · Images must be 450 KB or smaller.</p>

      {step === 1 ? (
        <div className="card mt-5 space-y-4 p-4 sm:p-6">
          <Field label="Report title" error={errors.title}>
            <input value={form.title} onChange={(event) => set('title', event.target.value)} className="input" />
          </Field>
          <Field label="Detailed description" error={errors.description}>
            <textarea value={form.description} onChange={(event) => set('description', event.target.value)} rows={4} className="input min-h-24 py-2" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select value={form.category} onChange={(event) => set('category', event.target.value)} className="input">
                {CATEGORIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Severity">
              <select value={form.severity} onChange={(event) => set('severity', event.target.value)} className="input">
                {SEVERITIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Road name" error={errors.roadName}>
              <input value={form.roadName} onChange={(event) => set('roadName', event.target.value)} className="input" />
            </Field>
            <Field label="Locality" error={errors.locality}>
              <input value={form.locality} onChange={(event) => set('locality', event.target.value)} className="input" />
            </Field>
            <Field label="City" error={errors.city}>
              <input value={form.city} onChange={(event) => set('city', event.target.value)} className="input" />
            </Field>
            <Field label="Postal code" error={errors.postalCode}>
              <input value={form.postalCode} onChange={(event) => set('postalCode', event.target.value)} className="input" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={locate} className="btn-secondary h-10 px-3 text-sm">
              Use my location
            </button>
            <p className="self-center text-xs text-slate-500">Or click the map. Coordinates are stored only if you provide them.</p>
          </div>
          <LocationPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => { set('lat', lat); set('lng', lng) }} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude" error={errors.lat}>
              <input value={form.lat} onChange={(event) => set('lat', event.target.value)} className="input" />
            </Field>
            <Field label="Longitude" error={errors.lng}>
              <input value={form.lng} onChange={(event) => set('lng', event.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Photograph">
            <input type="file" accept="image/*" onChange={onFile} className="w-full text-sm" />
          </Field>
          {form.imageUrl ? (
            <div>
              <img src={form.imageUrl} alt="Selected damage preview" className="max-h-56 rounded-xl object-cover" />
              <button type="button" onClick={() => set('imageUrl', '')} className="mt-2 text-sm text-red-700">
                Remove image
              </button>
            </div>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate('/citizen')} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={goReview} className="btn-primary">
              Review
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card mt-5 space-y-4 p-4 sm:p-6">
          <h2 className="font-semibold text-navy-900">Review before submitting</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-500">Title</dt><dd className="font-medium">{form.title}</dd></div>
            <div><dt className="text-slate-500">Category / severity</dt><dd className="font-medium">{form.category} · {form.severity}</dd></div>
            <div className="sm:col-span-2"><dt className="text-slate-500">Location</dt><dd className="font-medium">{composeAddress(form)}</dd></div>
            <div className="sm:col-span-2"><dt className="text-slate-500">Description</dt><dd>{form.description}</dd></div>
            <div><dt className="text-slate-500">Coordinates</dt><dd>{form.lat && form.lng ? `${form.lat}, ${form.lng}` : 'Not provided'}</dd></div>
          </dl>
          {form.imageUrl ? <img src={form.imageUrl} alt="Preview" className="max-h-48 rounded-xl object-cover" /> : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">
              Edit
            </button>
            <button disabled={busy} className="btn-primary">
              {busy ? 'Submitting…' : 'Submit report'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className="mt-1 block">{children}</span>
      {error ? <span className="text-sm font-normal text-red-700">{error}</span> : null}
    </label>
  )
}
