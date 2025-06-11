const Reservation = () => {
  return (
    <div className="page reservation-page">
      <div className="container">
        <h2>Réservation en cours</h2>
        <div className="reservation-status">
          <div className="status-card">
            <h3>Commande #12345</h3>
            <p><strong>Statut :</strong> En préparation</p>
            <p><strong>Coursier :</strong> Marie Dupont</p>
            <p><strong>Temps estimé :</strong> 25 minutes</p>
            <div className="progress-bar">
              <div className="progress" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
