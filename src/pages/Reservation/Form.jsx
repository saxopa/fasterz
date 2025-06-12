// src/pages/Reservation/Form.jsx
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/UI/Button'

export default function Form() {
  const navigate = useNavigate()
  const { state } = useLocation()  // <-- on récupère le state éventuel

  // on initialise depuis state.pickup, state.destination, state.datetime
  const [pickup, setPickup] = useState(state?.pickup || '')
  const [destination, setDestination] = useState(state?.destination || '')
  const [datetime, setDatetime] = useState(state?.datetime || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!pickup || !destination || !datetime) {
      alert('Veuillez remplir tous les champs')
      return
    }
    // On passe les données à la page de confirmation
    navigate('confirm', {
      state: { pickup, destination, datetime }
    })
  }

  const handleCancel = () => {
    // Retour à la page d'accueil
    navigate('/home')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Lieu de départ</label>
        <input
          type="text"
          value={pickup}
          onChange={e => setPickup(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Destination</label>
        <input
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Date et heure</label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={e => setDatetime(e.target.value)}
          required
        />
      </div>
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
