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

        setOrders(data.orders || []);
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
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  ).length;

  const getStatusClass = (status) => {
    if (status === "Delivered") return "status-delivered";
    if (status === "Cancelled") return "status-cancelled";
    if (status === "Preparing") return "status-preparing";
    if (status === "Out for Delivery") return "status-delivery";
    if (status === "Confirmed") return "status-confirmed";

    return "status-pending";
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-loading">
          <div className="admin-loading-spinner"></div>
          <h2>Loading dashboard...</h2>
          <p>Please wait while we fetch your latest orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      {/* HEADER */}
      <div className="admin-dashboard-top">

        <Link to="/" className="admin-back-link">
          ← Back to Home
        </Link>

        <div className="admin-dashboard-heading">
          <span className="admin-dashboard-eyebrow">
            FOODIE ADMIN PANEL
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Manage your food ordering application and monitor
            customer orders.
          </p>
        </div>

      </div>


      {/* STATS */}
      <div className="admin-dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              📦
            </div>

            <span className="dashboard-stat-small">
              ALL TIME
            </span>
          </div>

          <p>Total Orders</p>

          <h2>{totalOrders}</h2>

          <span className="dashboard-stat-description">
            Orders received
          </span>
        </div>


        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              ⏳
            </div>

            <span className="dashboard-stat-small">
              ATTENTION
            </span>
          </div>

          <p>Pending Orders</p>

          <h2>{pendingOrders}</h2>

          <span className="dashboard-stat-description">
            Waiting for confirmation
          </span>
        </div>


        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              🚚
            </div>

            <span className="dashboard-stat-small">
              ACTIVE
            </span>
          </div>

          <p>Active Orders</p>

          <h2>{activeOrders}</h2>

          <span className="dashboard-stat-description">
            Currently processing
          </span>
        </div>


        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              💰
            </div>

            <span className="dashboard-stat-small">
              REVENUE
            </span>
          </div>

          <p>Total Revenue</p>

          <h2>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>

          <span className="dashboard-stat-description">
            From all orders
          </span>
        </div>

      </div>


      {/* QUICK ACTIONS */}
      <section className="admin-quick-section">

        <div className="admin-section-title">
          <span>MANAGEMENT</span>
          <h2>Quick Actions</h2>
          <p>
            Access the main areas of your Foodie admin panel.
          </p>
        </div>


        <div className="admin-quick-grid">

          <Link
            to="/admin/orders"
            className="admin-quick-card"
          >
            <div className="admin-quick-icon">
              📦
            </div>

            <div className="admin-quick-content">
              <h3>Manage Orders</h3>

              <p>
                View, update and manage customer orders.
              </p>

              <span>
                Open Orders →
              </span>
            </div>
          </Link>


          <Link
            to="/admin/restaurants"
            className="admin-quick-card"
          >
            <div className="admin-quick-icon">
              🍽️
            </div>

            <div className="admin-quick-content">
              <h3>Manage Restaurants</h3>

              <p>
                Add, edit and manage restaurant information.
              </p>

              <span>
                Open Restaurants →
              </span>
            </div>
          </Link>


          <Link
            to="/admin/menu"
            className="admin-quick-card"
          >
            <div className="admin-quick-icon">
              🍔
            </div>

            <div className="admin-quick-content">
              <h3>Manage Menu</h3>

              <p>
                Add and update food items and availability.
              </p>

              <span>
                Open Menu →
              </span>
            </div>
          </Link>

        </div>

      </section>


      {/* RECENT ORDERS */}
      <section className="admin-recent-section">

        <div className="admin-section-title admin-recent-heading">

          <div>
            <span>ACTIVITY</span>

            <h2>Recent Orders</h2>

            <p>
              Latest customer orders from your Foodie application.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="admin-view-all-btn"
          >
            View All Orders →
          </Link>

        </div>


        {orders.length === 0 ? (

          <div className="admin-dashboard-empty">

            <div className="admin-empty-icon">
              📦
            </div>

            <h3>No orders yet</h3>

            <p>
              Customer orders will appear here once they
              place an order.
            </p>

          </div>

        ) : (

          <div className="admin-recent-orders">

            {orders.slice(0, 5).map((order) => (

              <div
                className="admin-recent-order"
                key={order._id}
              >

                <div className="recent-order-main">

                  <div className="recent-order-icon">
                    📦
                  </div>

                  <div>

                    <h3>
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>

                    <p>
                      {order.userId?.name || "Customer"}
                    </p>

                  </div>

                </div>


                <div className="recent-order-middle">

                  <span>
                    {order.items?.length || 0} item
                    {(order.items?.length || 0) !== 1
                      ? "s"
                      : ""}
                  </span>

                  <small>
                    {order.paymentMethod || "Payment"}
                  </small>

                </div>


                <div className="recent-order-right">

                  <strong>
                    ₹{Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                  <span
                    className={`admin-order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* FOOTER NOTE */}
      <div className="admin-dashboard-note">

        <span>🔐</span>

        <div>
          <strong>Admin Area</strong>

          <p>
            This dashboard is protected and only accessible
            to authorized Foodie administrators.
          </p>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;