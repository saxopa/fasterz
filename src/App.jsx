import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Reservation from './pages/Reservation';
import Account from './pages/Account';
import History from './pages/History';
import Contact from './pages/Contact';
import './styles/index.css';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Récupère l'utilisateur courant au chargement
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    // Met à jour l'état utilisateur lors d'un changement d'auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  // Vous pouvez passer l'état user en prop si besoin
  return (
    <Router>
<<<<<<< HEAD
      <Header />
      <main>
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />

          <Route path="/reservation/*"      element={<Reservation />} />

          <Route path="/account"            element={<Account />} />
          <Route path="/history"            element={<History />} />
          <Route path="/contact"            element={<Contact />} />
        </Routes>
      </main>
      <Footer />
=======
      <div className="app">
        <Header user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reservation" element={<Reservation user={user} />} />
            <Route path="/account" element={<Account user={user} />} />
            <Route path="/history" element={<History user={user} />} />
            <Route path="/contact" element={<Contact user={user} />} />
          </Routes>
        </main>
        <Footer />
      </div>
>>>>>>> 1094dd5b5eeb2d8f556fe8be5085a5cb53530647
    </Router>
  )
}

export default App
