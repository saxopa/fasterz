// src/pages/Reservation/End.jsx
import React, { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/UI/Button'
import { jsPDF } from 'jspdf'

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

  // ----- Données simulées pour la facture -----
  const invoiceNumber = useMemo(
    () => Math.floor(100000 + Math.random() * 900000), 
    []
  ) // N° à 6 chiffres
  const distanceKm = useMemo(
    () => (Math.random() * 28 + 2).toFixed(1),
    []
  ) // 2.0 – 30.0 km
  const durationMin = useMemo(
    () => Math.floor(Math.random() * 36 + 5),
    []
  ) // 5 – 40 min
  const priceTTC = useMemo(
    () => (Math.random() * 40 + 10).toFixed(2),
    []
  ) // 10 – 50 €
  const taxRate = 0.10 // 10% de TVA
  const priceHT = useMemo(
    () => (priceTTC / (1 + taxRate)).toFixed(2),
    [priceTTC]
  )
  const taxAmount = useMemo(
    () => (priceTTC - priceHT).toFixed(2),
    [priceTTC, priceHT]
  )
  const company = {
    name: 'Fasterz VTC',
    address: '123, avenue de la République – 75011 Paris',
    phone: '01 23 45 67 89',
    siret: '123 456 789 00010'
  }
  const dateStr = new Date(datetime).toLocaleString()
  const dateShort = new Date(datetime).toLocaleDateString()

  // ----- Génération et téléchargement du PDF -----
  const handleDownloadInvoice = () => {
    const doc = new jsPDF({ unit: 'pt' })
    doc.setFontSize(18)
    doc.text(company.name, 40, 40)
    doc.setFontSize(10)
    doc.text(company.address, 40, 60)
    doc.text(`Tél. ${company.phone}`, 40, 74)
    doc.text(`SIRET : ${company.siret}`, 40, 88)

    // En-tête de la facture
    doc.setFontSize(12)
    doc.text(`FACTURE N° : ${invoiceNumber}`, 420, 40)
    doc.text(`Date : ${dateShort}`, 420, 56)

    // Lignes de détails
    let y = 120
    doc.setFontSize(11)
    doc.text('Description', 40, y)
    doc.text('Quantité', 300, y)
    doc.text('Prix Unitaire', 380, y)
    doc.text('Montant', 480, y)
    y += 16
    doc.setLineWidth(0.5)
    doc.line(40, y, 550, y)
    y += 16

    // Course VTC
    doc.text('Course VTC – trajet privé', 40, y)
    doc.text('1', 310, y)
    doc.text(`${priceHT} €`, 380, y)
    doc.text(`${priceHT} €`, 480, y)
    y += 30

    // Détails kilométrage / durée
    doc.setFontSize(10)
    doc.text(`Distance parcourue : ${distanceKm} km`, 40, y)
    doc.text(`Durée du trajet : ${durationMin} min`, 40, y + 14)
    y += 40

    // Totaux
    doc.setFontSize(12)
    doc.text(`Sous-total HT : ${priceHT} €`, 380, y)
    doc.text(`TVA (${taxRate * 100} %) : ${taxAmount} €`, 380, y + 16)
    doc.setFontSize(14)
    doc.text(`TOTAL TTC : ${priceTTC} €`, 380, y + 40)

    // Pied de page
    doc.setFontSize(9)
    doc.text(
      'Merci d’avoir voyagé avec Fasterz VTC. Pour toute réclamation : contact@fasterzvtc.fr',
      40,
      780,
      { maxWidth: 520 }
    )

    doc.save(`facture_${invoiceNumber}.pdf`)
  }

  const handleNew = () => navigate('/reservation')
  const goHistory = () => navigate('/history')

  return (
    <div
      className="reservation-end"
      style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}
    >
      <h2>Course terminée</h2>

      <div style={{ margin: '1rem 0' }}>
        <p><strong>Facture N° :</strong> {invoiceNumber}</p>
        <p><strong>Date &amp; heure :</strong> {dateStr}</p>
        <p><strong>Départ :</strong> {pickup}</p>
        <p><strong>Destination :</strong> {destination}</p>
        <p><strong>Distance :</strong> {distanceKm} km</p>
        <p><strong>Durée :</strong> {durationMin} min</p>
        <p><strong>Montant HT :</strong> {priceHT} €</p>
        <p><strong>TVA ({taxRate * 100} %) :</strong> {taxAmount} €</p>
        <p><strong>Total TTC :</strong> {priceTTC} €</p>
      </div>

      <div
        className="form-buttons"
        style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
      >
        <Button variant="primary" onClick={handleDownloadInvoice}>
          Télécharger la facture (PDF)
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
