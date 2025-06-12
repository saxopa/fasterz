// src/pages/Reservation/Start.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/UI/Button'

export default function Start() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { pickup, destination, datetime } = state || {}

  // Si pas de données de trajet, on retourne à la confirmation
  if (!pickup || !destination) {
    return (
      <div>
        <p>Données de trajet manquantes. Revenez à la confirmation.</p>
        <Button
          variant="secondary"
          onClick={() => navigate('/reservation/confirm')}
        >
          Retour à la confirmation
        </Button>
      </div>
    )
  }

  // États
  const [status, setStatus] = useState('waiting')         // 'waiting', 'enRoute', 'arrived'
  const [etaMinutes, setEtaMinutes] = useState(null)      // pour affichage
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const [driverCode] = useState(() =>
    String(Math.floor(1000 + Math.random() * 9000))
  )
  const [codeInput, setCodeInput] = useState('')
  const [error, setError] = useState('')
  const [acceptDelaySeconds, setAcceptDelaySeconds] = useState(null) // debug

  useEffect(() => {
    // Simule l'acceptation (5 à 30 s)
    const delayMs = Math.floor(Math.random() * 26 + 5) * 1000
    setAcceptDelaySeconds(delayMs / 1000)
    const acceptTimer = setTimeout(() => {
      // Conducteur accepté, génère ETA aléatoire 2–30 minutes
      const eta = Math.floor(Math.random() * 29 + 2)

      /* ======= TEST MODE: TRAITER ETA COMME SECONDES =======
         Pour tester sans attendre, on prend 'eta' en secondes directement.
         Supprimez ce bloc (et dé-commentez ci-dessous) en production.
      */
      setEtaMinutes(eta)           // on affiche toujours 'eta' dans le même champ
      setSecondsRemaining(eta)     // pas eta * 60
      /* ======= FIN DU TEST MODE ======= */

      // === PRODUCTION MODE (dé-commentez & retirez le TEST MODE ci-dessus) ===
      // setEtaMinutes(eta)
      // setSecondsRemaining(eta * 60)
      // =========================================================================

      setStatus('enRoute')
    }, delayMs)

    return () => clearTimeout(acceptTimer)
  }, [])

  useEffect(() => {
    // Compte à rebours
    if (status !== 'enRoute' || secondsRemaining === null) return
    if (secondsRemaining <= 0) {
      setStatus('arrived')
      return
    }
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setStatus('arrived')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [status, secondsRemaining])

  const formatTime = secs => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s < 10 ? '0' : ''}${s}s`
  }

  const handleSubmitCode = e => {
    e.preventDefault()
    if (codeInput === driverCode) {
      // On transmet également les données de trajet à Ongoing
      navigate('../ongoing', {
        state: { pickup, destination, datetime }
      })
    } else {
      setError('Code invalide, veuillez réessayer.')
    }
  }

  return (
    <div className="start-ride-page">
      {status === 'waiting' && (
        <div>
          <h2>En attente du conducteur...</h2>
          <p>Veuillez patienter, un conducteur va bientôt accepter votre course.</p>

          {/* Affichage debug */}
          {acceptDelaySeconds != null && (
            <small style={{ opacity: 0.6 }}>
              Délai d’acceptation simulé : {acceptDelaySeconds}s
            </small>
          )}
          <br />
          <small style={{ opacity: 0.6 }}>
            Code conducteur (debug) : {driverCode}
          </small>
        </div>
      )}

      {status === 'enRoute' && secondsRemaining !== null && (
        <div>
          <h2>Votre conducteur arrivera dans :</h2>
          <p>{formatTime(secondsRemaining)}</p>
          <small>Code du conducteur à saisir à son arrivée.</small>
          <br />
          <small style={{ opacity: 0.6 }}>
            Code conducteur (debug) : {driverCode}
          </small>
        </div>
      )}

      {status === 'arrived' && (
        <form onSubmit={handleSubmitCode}>
          <h2>Le conducteur est arrivé !</h2>
          <p>Veuillez entrer le code à 4 chiffres que le conducteur vous a donné.</p>
          <input
            type="text"
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            maxLength={4}
            placeholder="XXXX"
          />
          {error && <p className="error">{error}</p>}
          <div className="form-buttons">
            <Button type="submit" variant="primary">
              Commencer la course
            </Button>
          </div>
          <small style={{ opacity: 0.6 }}>
            Code attendu (debug) : {driverCode}
          </small>
        </form>
      )}
    </div>
  )
}
