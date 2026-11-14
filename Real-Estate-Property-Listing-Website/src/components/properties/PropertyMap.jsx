import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import { formatPrice } from '../../utils/format'
import { KOLKATA } from '../../data/geo'

// Price pill markers (a divIcon avoids bundler problems with Leaflet's default image icons).
const pill = (p) => L.divIcon({ className: '', iconSize: [0, 0], html: `<span style="display:inline-block;transform:translate(-50%,-100%);background:rgb(var(--c-primary));color:#fff;font:600 12px Inter,sans-serif;padding:4px 9px;border-radius:999px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);white-space:nowrap">${formatPrice(p.price, p.purpose)}</span>` })

export default function PropertyMap({ properties, height = 'h-[560px]' }) {
  const pts = useMemo(() => properties.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)), [properties])
  const center = pts.length ? [pts.reduce((s, p) => s + p.lat, 0) / pts.length, pts.reduce((s, p) => s + p.lng, 0) / pts.length] : KOLKATA
  return (
    <div className={`overflow-hidden rounded-2xl border border-line ${height}`}>
      <MapContainer key={pts.length} center={center} zoom={pts.length > 1 ? 11 : 14} scrollWheelZoom={false} className="h-full w-full" aria-label="Map of properties">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pts.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pill(p)}>
            <Popup><div className="w-44"><img src={p.images[0]} alt="" className="h-24 w-full rounded-lg object-cover" /><p className="mt-2 text-sm font-semibold">{p.title}</p><p className="text-xs text-slate-500">{p.location}</p><Link to={`/properties/${p.id}`} className="mt-1 inline-block text-xs font-semibold text-accent">View details</Link></div></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
