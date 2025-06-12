// src/pages/Reservation/index.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Form     from './Form'
import Confirm  from './Confirm'
import Track    from './Track'
import Start    from './Start'
import Ongoing  from './Ongoing'
import End      from './End'

export default function Reservation() {
  return (
    <Routes>
      {/* formulaire de saisie */}
      <Route index      element={<Form />} />
      {/* confirmation */}
      <Route path="confirm" element={<Confirm />} />
      {/* suivi de la course */}
      <Route path="track"   element={<Track />} />
      {/* début */}
      <Route path="start"   element={<Start />} />
      {/* en cours */}
      <Route path="ongoing" element={<Ongoing />} />
      {/* fin */}
      <Route path="end"     element={<End />} />

      {/* toute autre route redirige vers /reservation */}
      <Route path="*" element={<Navigate to="/reservation" replace />} />
    </Routes>
  )
}
