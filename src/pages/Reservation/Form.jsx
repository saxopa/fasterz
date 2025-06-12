// src/pages/Reservation/Form.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/UI/Button'

// Hook debounce
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

export default function Form() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // Texte + coords pour pickup
  const [pickup, setPickup] = useState(state?.pickup || '')
  const [pickupCoords, setPickupCoords] = useState(state?.pickupCoords || null)
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const pickupCache = useRef({})

  // Texte + coords pour destination
  const [destination, setDestination] = useState(state?.destination || '')
  const [destinationCoords, setDestinationCoords] = useState(
    state?.destinationCoords || null
  )
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const destinationCache = useRef({})

  // Debounced values
  const debouncedPickup = useDebounce(pickup, 300)
  const debouncedDestination = useDebounce(destination, 300)

  // Autocomplete pour pickup
  useEffect(() => {
    if (pickupCoords || debouncedPickup.length < 3) {
      setPickupSuggestions([])
      return
    }
    const q = debouncedPickup.trim().toLowerCase()
    if (pickupCache.current[q]) {
      setPickupSuggestions(pickupCache.current[q])
      return
    }
    const ctrl = new AbortController()
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
        debouncedPickup
      )}`,
      { signal: ctrl.signal }
    )
      .then(r => r.json())
      .then(data => {
        pickupCache.current[q] = data
        setPickupSuggestions(data)
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err)
      })
    return () => ctrl.abort()
  }, [debouncedPickup, pickupCoords])

  // Autocomplete pour destination
  useEffect(() => {
    if (destinationCoords || debouncedDestination.length < 3) {
      setDestinationSuggestions([])
      return
    }
    const q = debouncedDestination.trim().toLowerCase()
    if (destinationCache.current[q]) {
      setDestinationSuggestions(destinationCache.current[q])
      return
    }
    const ctrl = new AbortController()
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
        debouncedDestination
      )}`,
      { signal: ctrl.signal }
    )
      .then(r => r.json())
      .then(data => {
        destinationCache.current[q] = data
        setDestinationSuggestions(data)
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err)
      })
    return () => ctrl.abort()
  }, [debouncedDestination, destinationCoords])

  const handleSubmit = e => {
    e.preventDefault()
    if (!pickupCoords || !destinationCoords) {
      alert(
        'Merci de sélectionner vos adresses parmi les propositions (cliquer sur une ligne).'
      )
      return
    }
    const datetime = state?.datetime || new Date().toISOString()
    navigate('confirm', {
      state: {
        pickup,
        destination,
        datetime,
        pickupCoords,
        destinationCoords
      }
    })
  }

  const handleCancel = () => navigate('/home')

  // Styles inline minimal pour la liste de suggestions
  const suggestionsStyle = {
    position: 'absolute',
    zIndex: 10,
    background: '#fff',
    border: '1px solid #ccc',
    width: '100%',
    maxHeight: '150px',
    overflowY: 'auto',
    margin: 0,
    padding: 0,
    listStyle: 'none'
  }
  const suggestionItemStyle = {
    padding: '0.5rem',
    cursor: 'pointer'
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      {/* Pickup */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <label>Lieu de départ</label>
        <input
          type="text"
          value={pickup}
          onChange={e => {
            setPickup(e.target.value)
            setPickupCoords(null)
          }}
          required
        />
        {pickupSuggestions.length > 0 && (
          <ul style={suggestionsStyle}>
            {pickupSuggestions.map(s => (
              <li
                key={s.place_id}
                style={suggestionItemStyle}
                onClick={() => {
                  setPickup(s.display_name)
                  setPickupCoords([+s.lat, +s.lon])
                  setPickupSuggestions([])
                }}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destination */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <label>Destination</label>
        <input
          type="text"
          value={destination}
          onChange={e => {
            setDestination(e.target.value)
            setDestinationCoords(null)
          }}
          required
        />
        {destinationSuggestions.length > 0 && (
          <ul style={suggestionsStyle}>
            {destinationSuggestions.map(s => (
              <li
                key={s.place_id}
                style={suggestionItemStyle}
                onClick={() => {
                  setDestination(s.display_name)
                  setDestinationCoords([+s.lat, +s.lon])
                  setDestinationSuggestions([])
                }}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Heure de départ en lecture seule */}
      {state?.datetime == null && (
        <p style={{ fontSize: '0.9em', color: '#555' }}>
          Heure de départ : {new Date().toLocaleString()}
        </p>
      )}

      <div className="form-buttons">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          Valider
        </Button>
      </div>
    </form>
  )
}
