import React from 'react'
import Button from '../../components/UI/Button'
import { useNavigate } from 'react-router-dom'

export default function Track() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('start')
  }

  return (
    <div className="reservation-track">
      <h2>Suivi de course</h2>
      <p>Votre chauffeur est en route. Suivez son arrivée en temps réel.</p>
      <Button onClick={handleStart}>Démarrer la course</Button>
    </div>
  )
}
