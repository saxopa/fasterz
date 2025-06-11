import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [address, setAddress] = useState('');
  const [items, setItems] = useState('');
  const navigate = useNavigate();

  const handleOrder = (e) => {
    e.preventDefault();
    // Logique de commande
    navigate('/reservation');
  };

  return (
    <div className="page home-page">
      <div className="container">
        <h2>Commandez vos courses en quelques clics</h2>
        <form onSubmit={handleOrder} className="order-form">
          <div className="form-group">
            <label htmlFor="address">Adresse de livraison</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Entrez votre adresse"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="items">Liste de courses</label>
            <textarea
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="Décrivez vos courses..."
              rows="5"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Commander maintenant
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
