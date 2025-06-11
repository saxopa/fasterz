const History = () => {
  const orders = [
    { id: 1, date: '2025-06-09', total: '45.50€', status: 'Livré' },
    { id: 2, date: '2025-06-07', total: '32.80€', status: 'Livré' },
    { id: 3, date: '2025-06-05', total: '28.90€', status: 'Livré' }
  ];

  return (
    <div className="page history-page">
      <div className="container">
        <h2>Historique des commandes</h2>
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>Commande #{order.id}</h3>
              <p><strong>Date :</strong> {order.date}</p>
              <p><strong>Total :</strong> {order.total}</p>
              <p><strong>Statut :</strong> {order.status}</p>
              <button className="btn-secondary">Voir détails</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
