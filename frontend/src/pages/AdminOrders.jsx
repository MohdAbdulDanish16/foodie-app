import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("foodieToken");

    if (!token) {
      navigate("/login");
      return;
    }

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("foodieToken");

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      alert("✅ Order status updated!");

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <Link to="/">
          <button className="back-btn">
            ← Back to Home
          </button>
        </Link>

        <h1>👨‍💼 Admin Orders</h1>
        <p>Manage all Foodie customer orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">📦</div>
          <h2>No orders found</h2>
          <p>There are currently no customer orders.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order._id}>
              <div className="admin-order-top">
                <div>
                  <h2>
                    Order #{order._id.slice(-6)}
                  </h2>

                  <p>
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <span
  className={`admin-order-status ${
    order.status === "Pending"
      ? "admin-status-pending"
      : order.status === "Confirmed"
      ? "admin-status-confirmed"
      : order.status === "Preparing"
      ? "admin-status-preparing"
      : order.status === "Out for Delivery"
      ? "admin-status-delivery"
      : order.status === "Delivered"
      ? "admin-status-delivered"
      : order.status === "Cancelled"
      ? "admin-status-cancelled"
      : ""
  }`}
>
  {order.status}
</span>
              </div>

              <div className="admin-customer-info">
                <h3>👤 Customer</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {order.customerName || order.userId?.name || "Unknown"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.userId?.email}
                </p>
              </div>

              <div className="admin-order-items">
                <h3>🍴 Items</h3>

                {order.items.map((item, index) => (
                  <div
                    className="admin-order-item"
                    key={index}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="admin-order-details">
                <p>
                  <strong>📞 Phone:</strong>{" "}
                  {order.phone}
                </p>

                <p>
                  <strong>📍 Address:</strong>{" "}
                  {order.address}
                </p>

                <p>
                  <strong>💳 Payment:</strong>{" "}
                  {order.paymentMethod}
                </p>
              </div>

              <div className="admin-order-bottom">
                <div className="admin-order-total">
                  <span>Total</span>

                  <strong>
                    ₹{order.totalAmount}
                  </strong>
                </div>

                <div className="status-control">
                  <label>Update Status</label>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Preparing">
                      Preparing
                    </option>

                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;