const Account = () => {
  return (
    <div className="page account-page">
      <div className="container">
        <h2>Mon Compte</h2>
        <div className="account-info">
          <div className="info-card">
            <h3>Informations personnelles</h3>
            <p><strong>Nom :</strong> John Doe</p>
            <p><strong>Email :</strong> john.doe@email.com</p>
            <p><strong>Téléphone :</strong> +33 6 12 34 56 78</p>
            <button className="btn-secondary">Modifier</button>
          </div>
          <div className="info-card">
            <h3>Adresses</h3>
            <p>123 Rue de la Paix, 75001 Paris</p>
            <button className="btn-secondary">Gérer les adresses</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
