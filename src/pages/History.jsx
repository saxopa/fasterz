// src/pages/History.jsx
import React, { useState, useEffect } from 'react';

// Exemple de données (à remplacer par un appel API réel)
const mockOrders = [
  { id: 'RIDE001', date: '2025-06-10', status: 'Completed', amount: 25.50, driver: 'Jean Dupont', from: 'Paris', to: 'Orly' },
  { id: 'RIDE002', date: '2025-06-11', status: 'Ongoing', amount: 12.00, driver: 'Marie Martin', from: 'Lyon', to: 'Gare Part-Dieu' },
  { id: 'RIDE003', date: '2025-06-09', status: 'Cancelled', amount: 0.00, driver: 'Paul Durand', from: 'Marseille', to: 'Saint-Charles' },
];

const STATUS_OPTIONS = ['All', 'Completed', 'Ongoing', 'Cancelled'];

const History = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // TODO: remplacer par fetch('API_URL')...
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(
    order => filter === 'All' || order.status === filter
  );

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Facture VTC', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Numéro de course: ${order.id}`, 20, 40);
    doc.text(`Date: ${order.date}`, 20, 50);
    doc.text(`De: ${order.from}`, 20, 60);
    doc.text(`À: ${order.to}`, 20, 70);
    doc.text(`Chauffeur: ${order.driver}`, 20, 80);
    doc.text(`Montant: €${order.amount.toFixed(2)}`, 20, 90);
    doc.save(`facture_${order.id}.pdf`);
  };

  return (
    <div className="history-container">
      <h2 className="history-title">Historique des courses</h2>

      <div className="filter-group">
        <label htmlFor="status-filter" className="filter-label">Statut :</label>
        <select
          id="status-filter"
          className="filter-select"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>
              {status === 'All' ? 'Tous' : status}
            </option>
          ))}
        </select>
      </div>

      <table className="history-table">
        <thead>
          <tr className="history-header-row">
            <th className="history-header-cell">ID</th>
            <th className="history-header-cell">Date</th>
            <th className="history-header-cell">Statut</th>
            <th className="history-header-cell">Montant (€)</th>
            <th className="history-header-cell">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <tr key={order.id} className="history-row">
                <td className="history-cell">{order.id}</td>
                <td className="history-cell">{order.date}</td>
                <td className="history-cell">{order.status}</td>
                <td className="history-cell">{order.amount.toFixed(2)}</td>
                <td className="history-cell">
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="btn-download"
                  >
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="history-row">
              <td className="history-cell" colSpan="5">Aucune course trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
