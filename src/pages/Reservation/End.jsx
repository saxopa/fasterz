// src/pages/Reservation/End.jsx
import React, { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/UI/Button'

export default function End() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { pickup, destination, datetime } = state || {}

  // Si on arrive ici sans données, retour à l'accueil des réservations
  if (!pickup || !destination || !datetime) {
    return (
      <div className="reservation-end" style={{ padding: '1rem' }}>
        <p>Données de course manquantes. Retour à la page de réservation.</p>
        <Button variant="secondary" onClick={() => navigate('/reservation')}>
          Nouvelle réservation
        </Button>
      </div>
    )
  }

  // Prix simulé (entre 10 et 50 €)
  const price = useMemo(() => (Math.random() * 40 + 10).toFixed(2), [])

  // Gestion du téléchargement de la "facture"
  const handleDownloadInvoice = () => {
    const dateStr = new Date(datetime).toLocaleString()
    const content = [
      '--------- FACTURE VTC ---------',
      `Date et heure : ${dateStr}`,
      `Départ       : ${pickup}`,
      `Destination  : ${destination}`,
      `Montant (€)  : ${price}`,
      '-------------------------------',
      'Merci d’avoir utilisé notre service VTC.'
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facture_${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleNew = () => navigate('/reservation')
  const goHistory = () => navigate('/history')

  return (
    <div className="reservation-end" style={{ padding: '1rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Course terminée</h2>

      <div style={{ margin: '1rem 0' }}>
        <p><strong>Départ :</strong> {pickup}</p>
        <p><strong>Destination :</strong> {destination}</p>
        <p><strong>Date &amp; heure :</strong> {new Date(datetime).toLocaleString()}</p>
        <p><strong>Montant :</strong> {price} €</p>
      </div>

      <div className="form-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={handleDownloadInvoice}>
          Télécharger la facture
        </Button>
        <Button variant="secondary" onClick={goHistory}>
          Voir l’historique
        </Button>
        <Button variant="secondary" onClick={handleNew}>
          Nouvelle réservation
        </Button>
      </div>
    </div>
  )
}
