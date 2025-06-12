// src/pages/Reservation/Ongoing.jsx
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Button from '../../components/UI/Button'

export default function Ongoing() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { pickup, destination } = state || {}

  // 1) Si pas de données, on redirige vers la confirmation
  if (!pickup || !destination) {
    return (
      <div style={{ padding: '1rem' }}>
        <p>Données de trajet manquantes. Revenez à la confirmation.</p>
        <Button variant="secondary" onClick={() => navigate('/reservation/confirm')}>
          Retour à la confirmation
        </Button>
      </div>
    )
  }

  // 2) États
  const [pickupCoords, setPickupCoords]     = useState(null)
  const [destCoords, setDestCoords]         = useState(null)
  const [currentPos, setCurrentPos]         = useState(null)
  const [geoAllowed, setGeoAllowed]         = useState(null)  // null / true / false
  const [routeCoords, setRouteCoords]       = useState(null)
  const [routeDuration, setRouteDuration]   = useState(null)  // en secondes
  const [finishCode, setFinishCode]         = useState(null)
  const [error, setError]                   = useState(null)
  const [watcherId, setWatcherId]           = useState(null)

  // 3) Géocodage (Nominatim) de pickup et destination
  useEffect(() => {
    const geocode = async (addr, setter) => {
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`
        )
        const json = await res.json()
        if (json.length > 0) {
          setter([+json[0].lat, +json[0].lon])
        } else {
          setError(`Échec du géocodage : "${addr}"`)
        }
      } catch {
        setError(`Erreur réseau lors du géocodage de : "${addr}"`)
      }
    }
    geocode(pickup, setPickupCoords)
    geocode(destination, setDestCoords)
  }, [pickup, destination])

  // 4) Activation du suivi GPS
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoAllowed(false)
      return
    }
    const id = navigator.geolocation.watchPosition(
      pos => {
        setCurrentPos([pos.coords.latitude, pos.coords.longitude])
        setGeoAllowed(true)
      },
      () => setGeoAllowed(false),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    )
    setWatcherId(id)
  }
  useEffect(() => {
    return () => {
      if (watcherId != null) navigator.geolocation.clearWatch(watcherId)
    }
  }, [watcherId])

  // 5) Requête OSRM au fur et à mesure
  useEffect(() => {
    // origine = position live si dispo, sinon point de départ
    const origin = geoAllowed === true && currentPos
      ? currentPos
      : pickupCoords

    if (!origin || !destCoords) return

    const fetchRoute = async () => {
      try {
        const [lat1, lon1] = origin
        const [lat2, lon2] = destCoords
        const res  = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`
        )
        const json = await res.json()
        const route = json.routes?.[0]
        if (route) {
          setRouteCoords(
            route.geometry.coordinates.map(([lon, lat]) => [lat, lon])
          )
          setRouteDuration(route.duration)
        } else {
          setError('Aucun itinéraire trouvé.')
        }
      } catch {
        setError('Impossible de récupérer l’itinéraire.')
      }
    }
    fetchRoute()
  }, [currentPos, pickupCoords, destCoords, geoAllowed])

  // 6) Génération du code de fin
  const handleFinish = () => {
    setFinishCode(String(Math.floor(1000 + Math.random() * 9000)))
  }
  const simulateEnd = () => {
    navigate('/reservation/end', {
      state: { pickup, destination, datetime: new Date().toISOString() }
    })
  }

  // 7) Gestion d’erreur
  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <p>{error}</p>
        <Button variant="secondary" onClick={() => navigate('/reservation/confirm')}>
          Retour à la confirmation
        </Button>
      </div>
    )
  }

  // Si ni géocodage ni position dispo, on attend
  if (!pickupCoords) {
    return (
      <div style={{ padding: '1rem' }}>
        <p>Chargement des coordonnées de départ…</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Suivi de votre course</h2>

      {/* Bouton d’activation du suivi si nécessaire */}
      {geoAllowed !== true && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#555' }}>
            Pour un suivi en temps réel, cliquez ici pour activer la géolocalisation :
          </p>
          <Button variant="primary" onClick={requestGeolocation}>
            Activer le suivi
          </Button>
          {geoAllowed === false && (
            <p style={{ color: 'red', marginTop: '0.5rem' }}>
              Localisation non autorisée.
            </p>
          )}
        </div>
      )}

      {/* Temps estimé en minutes */}
      <h3>
        Temps estimé :{' '}
        {routeDuration != null ? `${Math.ceil(routeDuration / 60)} min` : '…'}
      </h3>

      {/* Carte */}
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          // on centre d’abord sur currentPos si dispo, sinon sur pickupCoords
          center={currentPos || pickupCoords}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {pickupCoords && (
            <Marker position={pickupCoords}>
              <Popup>Départ : {pickup}</Popup>
            </Marker>
          )}
          {destCoords && (
            <Marker position={destCoords}>
              <Popup>Arrivée : {destination}</Popup>
            </Marker>
          )}
          {currentPos && geoAllowed && (
            <Marker position={currentPos}>
              <Popup>Vous êtes ici</Popup>
            </Marker>
          )}
          {routeCoords && <Polyline positions={routeCoords} />}
        </MapContainer>
      </div>

      {/* Fin de course & simulation */}
      <div style={{ marginTop: '1rem' }}>
        <Button variant="secondary" onClick={handleFinish}>
          Générer code de fin de course
        </Button>
        {finishCode && (
          <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
            Code à transmettre au conducteur :<br/>
            <strong>{finishCode}</strong>
          </p>
        )}
        <Button
          variant="primary"
          style={{ marginTop: '1rem' }}
          onClick={simulateEnd}
        >
          Simuler validation finale → End
        </Button>
      </div>
    </div>
  )
}
