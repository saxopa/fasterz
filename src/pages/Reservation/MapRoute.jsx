// src/components/Reservation/MapRoute.jsx
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapRoute({ from, to }) {
  const [coords, setCoords] = useState(null)      // { from: [lat,lng], to: [lat,lng] }
  const [route, setRoute] = useState(null)        // { geometry: [...], duration: seconds }

  // Géocodage avec Nominatim
  useEffect(() => {
    async function fetchCoords() {
      const url = address =>
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      const [r1, r2] = await Promise.all([fetch(url(from)), fetch(url(to))])
      const j1 = await r1.json(), j2 = await r2.json()
      if (j1[0] && j2[0]) {
        const c1 = [+j1[0].lat, +j1[0].lon]
        const c2 = [+j2[0].lat, +j2[0].lon]
        setCoords({ from: c1, to: c2 })
      }
    }
    fetchCoords()
  }, [from, to])

  // Calcul de l’itinéraire via OSRM
  useEffect(() => {
    if (!coords) return
    const [lng1, lat1] = [coords.from[1], coords.from[0]]
    const [lng2, lat2] = [coords.to[1], coords.to[0]]
    const url = 
      `https://router.project-osrm.org/route/v1/driving/` +
      `${lng1},${lat1};${lng2},${lat2}` +
      `?overview=full&geometries=geojson`
    fetch(url)
      .then(res => res.json())
      .then(json => {
        const leg = json.routes[0]
        setRoute({
          geometry: leg.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
          duration: Math.round(leg.duration / 60)  // en minutes
        })
      })
  }, [coords])

  if (!coords || !route) return <p>Chargement de la carte…</p>

  return (
    <>
      <MapContainer center={coords.from} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords.from}>
          <Popup>Départ : {from}</Popup>
        </Marker>
        <Marker position={coords.to}>
          <Popup>Arrivée : {to}</Popup>
        </Marker>
        <Polyline positions={route.geometry} />
      </MapContainer>
      <p>Durée estimée : <strong>{route.duration} min</strong></p>
    </>
  )
}
