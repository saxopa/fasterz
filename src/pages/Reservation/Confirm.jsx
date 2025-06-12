// src/pages/Reservation/Confirm.jsx
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/UI/Button'
import MapRoute from './MapRoute'

export default function Confirm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { pickup, destination, datetime } = state || {}

  // Si on arrive ici sans toutes les données, on renvoie au formulaire
  if (!pickup || !destination || !datetime) {
    return (
      <div>
        <p>Données manquantes.</p>
        <Button type="button" variant="secondary" onClick={() => navigate('/reservation')}>
          Retour
        </Button>
      </div>
    )
  }

  const handleModify = () => {
    // Retour au Form en passant l'état existant
    navigate('/reservation', {
      state: { pickup, destination, datetime }
    })
  }

  const handleConfirm = () => {
    // Vers Start en passant également l'état
    navigate('/reservation/start', {
      state: { pickup, destination, datetime }
    })
  }

  return (
    <div className="confirm-page">
      <h2>Vérifiez votre trajet</h2>

      {/* Affichage de la carte et de l’itinéraire */}
      <MapRoute from={pickup} to={destination} />

      <div className="confirm-details">
        <h3>Départ</h3>
        <p>{pickup}</p>

        <h3>Arrivée</h3>
        <p>{destination}</p>

        <h3>Date et heure</h3>
        <p>{new Date(datetime).toLocaleString()}</p>
      </div>

      <div className="form-buttons">
        <Button type="button" variant="secondary" onClick={handleModify}>
          Modifier
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirm}>
          Confirmer et demander le VTC
        </Button>
      </div>
    </div>
  )
}
