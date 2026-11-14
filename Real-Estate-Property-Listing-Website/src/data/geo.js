// Approximate centre points for localities (used for map markers). Replace with exact coordinates per listing in the admin form.
export const GEO = {
  'New Town': [22.5764, 88.4797], 'Salt Lake': [22.5867, 88.4171], 'Salt Lake Sector V': [22.574, 88.431], Rajarhat: [22.62, 88.459],
  Behala: [22.4985, 88.315], Garia: [22.464, 88.387], Ballygunge: [22.528, 88.365], Alipore: [22.532, 88.33], 'Dum Dum': [22.623, 88.42],
  'Park Street': [22.553, 88.352], Barasat: [22.722, 88.48], 'Kalyani Expressway': [22.95, 88.44],
}
export const KOLKATA = [22.5726, 88.3639]
export function geoFor(location, seed = 1) {
  const [lat, lng] = GEO[location] || KOLKATA
  const j = (n) => ((Math.sin(seed * 12.9898 + n) * 43758.5453) % 1) * 0.006
  return { lat: +(lat + j(1)).toFixed(5), lng: +(lng + j(2)).toFixed(5) }
}
