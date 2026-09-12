import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("foodieToken");

      try {
        const response = await fetch(
          `${API_URL}/api/orders/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(`❌ ${data.message}`);
          return;
        }

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
        alert("❌ Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <Link to="/">
          <button className="back-btn">
            ← Back to Home
          </button>
        </Link>

        <h1>👨‍💼 Admin Dashboard</h1>
        <p>Manage and monitor your Foodie application</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <h3>Total Orders</h3>
          <strong>{totalOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">⏳</div>
          <h3>Pending Orders</h3>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <h3>Delivered Orders</h3>
          <strong>{deliveredOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">💰</div>
          <h3>Total Revenue</h3>
          <strong>₹{totalRevenue}</strong>
        </div>
      </div>

      <div className="admin-dashboard-actions">
  <Link to="/admin/orders">
    <button className="admin-dashboard-btn">
      📦 Manage Orders
    </button>
  </Link>

  <Link to="/admin/restaurants">
    <button className="admin-dashboard-btn">
      🍽️ Manage Restaurants
    </button>
  </Link>

  <Link to="/admin/menu">
    <button className="admin-dashboard-btn">
      🍔 Manage Menu
    </button>
  </Link>
</div>

      <div className="admin-recent-orders">
        <div className="admin-section-header">
          <h2>📋 Recent Orders</h2>

          <Link to="/admin/orders">
            View All →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Customer orders will appear here.</p>
          </div>
        ) : (
          <div className="recent-orders-list">
            {orders.slice(0, 5).map((order) => (
              <div
                className="recent-order-card"
                key={order._id}
              >
                <div>
                  <h3>
                    Order #{order._id.slice(-6)}
                  </h3>

                  <p>
                    {order.userId?.name || "Customer"}
                  </p>
                </div>

                <div>
                  <strong>
                    ₹{order.totalAmount}
                  </strong>

                  <span className="recent-order-status">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;