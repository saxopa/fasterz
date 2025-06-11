import { useState } from 'react';

const Contact = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi du message
    alert('Message envoyé !');
    setMessage('');
  };

  return (
    <div className="page contact-page">
      <div className="container">
        <h2>Contactez-nous</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Informations de contact</h3>
            <p><strong>Email :</strong> support@fasterz.com</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Adresse :</strong> 123 Avenue des Champs, 75008 Paris</p>
          </div>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="message">Votre message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre demande..."
                rows="6"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
