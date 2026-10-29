import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useMemo } from 'react'

const icon = L.divIcon({
  className: 'bg-transparent border-0',
  html: '<span style="display:block;width:16px;height:16px;border-radius:999px;background:#1e4d8c;border:2px solid white;box-shadow:0 0 0 1px #1e4d8c"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function ClickCapture({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(Number(event.latlng.lat.toFixed(5)), Number(event.latlng.lng.toFixed(5)))
    },
  })
  return null
}

export function LocationPicker({ lat, lng, onChange }) {
  const position = useMemo(() => {
    if (lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
      return [Number(lat), Number(lng)]
    }
    return null
  }, [lat, lng])

  return (
    <div className="h-56 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <MapContainer center={position || [13.0827, 80.2707]} zoom={position ? 14 : 11} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickCapture onPick={onChange} />
        {position ? <Marker position={position} icon={icon} /> : null}
      </MapContainer>
    </div>
  )
}
