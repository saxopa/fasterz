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
      <Route index      element={<Form />} />
      <Route path="confirm" element={<Confirm />} />
      <Route path="track"   element={<Track />} />
      <Route path="start"   element={<Start />} />
      <Route path="ongoing" element={<Ongoing />} />
      <Route path="end"     element={<End />} />
      <Route path="*"       element={<Navigate to="" replace />} />
    </Routes>
  )
}
