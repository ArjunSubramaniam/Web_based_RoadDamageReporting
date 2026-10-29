import { useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { SeverityBadge, StatusBadge } from './Badge.jsx'

const severityColor = {
  Low: '#64748b',
  Medium: '#d97706',
  High: '#ea580c',
  Critical: '#dc2626',
}

function markerIcon(severity) {
  const color = severityColor[severity] || '#163a6b'
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:${color};border:2px solid white;box-shadow:0 0 0 4px ${color}33, 0 2px 6px rgba(0,0,0,.25)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function project(lat, lng) {
  const x = ((lng - 76.2) / (80.8 - 76.2)) * 100
  const y = ((13.6 - lat) / (13.6 - 8.2)) * 100
  return { left: `${Math.min(96, Math.max(4, x))}%`, top: `${Math.min(96, Math.max(4, y))}%` }
}

export function MapView({ reports, detailBase = '/citizen/reports' }) {
  const [mode, setMode] = useState('leaflet')
  const [selected, setSelected] = useState(null)
  const withCoords = useMemo(() => reports.filter((item) => item.lat && item.lng), [reports])

  if (!withCoords.length) {
    return <p className="card p-6 text-sm text-slate-500">No mapped reports in the current filter. Add coordinates when submitting a report to see it here.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {Object.entries(severityColor).map(([label, color]) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
        <button type="button" onClick={() => setMode((value) => (value === 'leaflet' ? 'overview' : 'leaflet'))} className="btn-secondary h-9 px-3 text-xs">
          {mode === 'leaflet' ? 'Schematic overview' : 'OpenStreetMap'}
        </button>
      </div>

      {mode === 'leaflet' ? (
        <div className="h-[440px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <MapContainer center={[11.1, 78.2]} zoom={7} scrollWheelZoom className="h-full w-full">
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {withCoords.map((report) => (
              <Marker key={report.id} position={[report.lat, report.lng]} icon={markerIcon(report.severity)}>
                <Popup>
                  <ReportSummary report={report} detailBase={detailBase} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="relative h-[440px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-100 via-emerald-50 to-slate-200">
          <div className="absolute inset-6 rounded-[40%] border border-dashed border-navy-200 bg-emerald-100/70" />
          <p className="absolute left-4 top-4 text-xs font-semibold uppercase tracking-wide text-navy-800">Schematic location overview</p>
          {withCoords.map((report) => {
            const pos = project(report.lat, report.lng)
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelected(report)}
                style={pos}
                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                title={report.title}
              >
                <span className="block h-full w-full rounded-full" style={{ background: severityColor[report.severity] }} />
              </button>
            )
          })}
          {selected ? (
            <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white p-3 shadow-lg">
              <ReportSummary report={selected} detailBase={detailBase} />
            </div>
          ) : (
            <p className="absolute bottom-3 left-3 text-xs text-navy-800">Tap a marker to view the report summary.</p>
          )}
        </div>
      )}
    </div>
  )
}

function ReportSummary({ report, detailBase }) {
  return (
    <div className="max-w-xs space-y-2 text-sm">
      <p className="text-xs font-semibold text-slate-400">{report.id}</p>
      <p className="font-semibold text-navy-950">{report.title}</p>
      <p className="text-xs text-slate-500">{report.address}</p>
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={report.status} />
        <SeverityBadge severity={report.severity} />
      </div>
      <Link className="inline-flex text-sm font-semibold text-blue-700 hover:underline" to={`${detailBase}/${report.id}`}>
        Open details
      </Link>
    </div>
  )
}
