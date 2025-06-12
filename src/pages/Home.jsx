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
        <div className='course'>
          <div>
            <h2>Prenez votre course avec MVP</h2>
            <form onSubmit={handleOrder} className="order-form">
              <div className="form-group">
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Lieu de prise en charge"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="items"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="Saisissez votre destination"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Voir le prix
              </button>
            </form>
          </div>
          <img src="/pages/davys.png" alt="" />
        </div>


        <div className='history'>
          <div>
            <h3 className='space'> Blablabla activité récente</h3>
            <p className='space'>Consulte les trajets passés</p>
            <button className='logHistory'>Connectez-vous a votre compte</button>
          </div>
          <img src="image1" alt="" />
        </div>

        <div className='conducteur'>
          <img src="image1" alt="" />
          <div>
            <h3 className='space'>blablabla deviens conducteur, génere des revenus</h3>
            <p className='space'>Générez des revenus selon votre propre emploi du temps en effectuant des livraisons, des courses, ou même les deux. Vous pouvez utiliser votre propre véhicule ou choisir une voiture de location via Uber.</p>
            <button className='drive'>Commencez</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
