import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingOrder, setUpdatingOrder] = useState(null);

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

      setOrders(data.orders || []);
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

    setUpdatingOrder(orderId);

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

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "admin-status-pending";

      case "Confirmed":
        return "admin-status-confirmed";

      case "Preparing":
        return "admin-status-preparing";

      case "Out for Delivery":
        return "admin-status-delivery";

      case "Delivered":
        return "admin-status-delivered";

      case "Cancelled":
        return "admin-status-cancelled";

      default:
        return "";
    }
  };

  const getPaymentClass = (status) => {
    return status === "Paid"
      ? "payment-paid"
      : "payment-pending";
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const customerName =
      order.customerName ||
      order.userId?.name ||
      "";

    const email =
      order.userId?.email ||
      "";

    const orderId =
      order._id ||
      "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchText) ||
      email.toLowerCase().includes(searchText) ||
      orderId.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-loading">
          <div className="admin-loading-icon">📦</div>
          <h2>Loading orders...</h2>
          <p>Please wait while we load customer orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      {/* HEADER */}
      <div className="admin-orders-header">

        <div className="admin-orders-heading">

          <Link to="/admin">
            <button className="back-btn">
              ← Admin Dashboard
            </button>
          </Link>

          <div>
            <p className="admin-page-label">
              ORDER MANAGEMENT
            </p>

            <h1>📦 Manage Orders</h1>

            <p>
              View, track and manage all Foodie customer orders.
            </p>
          </div>

        </div>

        <button
          className="admin-refresh-btn"
          onClick={fetchOrders}
        >
          🔄 Refresh
        </button>

      </div>

      {/* STATS */}
      <div className="admin-order-stats">

        <div className="admin-order-stat-card">

          <div className="admin-order-stat-icon">
            📦
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{totalOrders}</strong>
          </div>

        </div>

        <div className="admin-order-stat-card">

          <div className="admin-order-stat-icon">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
          </div>

        </div>

        <div className="admin-order-stat-card">

          <div className="admin-order-stat-icon">
            ✅
          </div>

          <div>
            <span>Delivered</span>
            <strong>{deliveredOrders}</strong>
          </div>

        </div>

        <div className="admin-order-stat-card">

          <div className="admin-order-stat-icon">
            ❌
          </div>

          <div>
            <span>Cancelled</span>
            <strong>{cancelledOrders}</strong>
          </div>

        </div>

        <div className="admin-order-stat-card">

          <div className="admin-order-stat-icon">
            💰
          </div>

          <div>
            <span>Revenue</span>
            <strong>₹{totalRevenue}</strong>
          </div>

        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div className="admin-order-toolbar">

        <div className="admin-order-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search by customer, email or order ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="admin-order-filter">

          <label>Status</label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Orders
            </option>

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

      {/* ORDER COUNT */}
      <div className="admin-order-results">

        Showing{" "}
        <strong>{filteredOrders.length}</strong>{" "}
        of{" "}
        <strong>{orders.length}</strong>{" "}
        orders

      </div>

      {/* EMPTY STATE */}
      {filteredOrders.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            {orders.length === 0 ? "📦" : "🔍"}
          </div>

          <h2>
            {orders.length === 0
              ? "No orders found"
              : "No matching orders"}
          </h2>

          <p>
            {orders.length === 0
              ? "There are currently no customer orders."
              : "Try changing your search or status filter."}
          </p>

        </div>

      ) : (

        <div className="admin-orders-list">

          {filteredOrders.map((order) => {

            const customerName =
              order.customerName ||
              order.userId?.name ||
              "Unknown Customer";

            const email =
              order.userId?.email ||
              "No email available";

            const isPaid =
              order.paymentStatus === "Paid";

            const isCancelled =
              order.status === "Cancelled";

            return (

              <div
                className="admin-order-card premium-order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}
                <div className="admin-order-top">

                  <div>

                    <div className="order-number-row">

                      <h2>
                        Order #{order._id.slice(-6)}
                      </h2>

                      <span
                        className={`admin-order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    <p className="order-date">
                      🕐{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="admin-order-price">
                    ₹{order.totalAmount}
                  </div>

                </div>

                {/* CUSTOMER */}
                <div className="admin-customer-info">

                  <h3>
                    👤 Customer Details
                  </h3>

                  <div className="customer-info-grid">

                    <p>
                      <strong>Name</strong>
                      <span>{customerName}</span>
                    </p>

                    <p>
                      <strong>Email</strong>
                      <span>{email}</span>
                    </p>

                    <p>
                      <strong>Phone</strong>
                      <span>{order.phone}</span>
                    </p>

                  </div>

                </div>

                {/* ITEMS */}
                <div className="admin-order-items">

                  <h3>
                    🍴 Order Items
                  </h3>

                  <div className="admin-items-list">

                    {order.items.map(
                      (item, index) => (

                        <div
                          className="admin-order-item"
                          key={index}
                        >

                          <div>
                            <span>
                              {item.name}
                            </span>

                            <small>
                              ₹{item.price} ×{" "}
                              {item.quantity}
                            </small>
                          </div>

                          <strong>
                            ₹
                            {Number(item.price) *
                              Number(item.quantity)}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* DELIVERY + PAYMENT */}
                <div className="admin-order-details">

                  <div className="admin-detail-box">

                    <span>
                      📍 Delivery Address
                    </span>

                    <strong>
                      {order.address}
                    </strong>

                  </div>

                  <div className="admin-detail-box">

                    <span>
                      💳 Payment
                    </span>

                    <strong>
                      {order.paymentMethod}
                    </strong>

                    <small
                      className={getPaymentClass(
                        order.paymentStatus
                      )}
                    >
                      {isPaid
                        ? "✅ Paid"
                        : "⏳ Pending"}
                    </small>

                  </div>

                  {order.transactionId && (

                    <div className="admin-detail-box">

                      <span>
                        🧾 Transaction ID
                      </span>

                      <strong>
                        {order.transactionId}
                      </strong>

                    </div>

                  )}

                </div>

                {/* FOOTER */}
                <div className="admin-order-bottom">

                  <div className="admin-order-total">

                    <span>
                      Order Total
                    </span>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                  <div className="status-control">

                    <label>
                      Update Order Status
                    </label>

                    <select
                      value={order.status}
                      disabled={
                        updatingOrder === order._id
                      }
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

                    {updatingOrder === order._id && (
                      <small className="status-updating">
                        Updating...
                      </small>
                    )}

                  </div>

                </div>

                {isCancelled && (

                  <div className="cancelled-order-message">
                    ❌ This order has been cancelled.
                  </div>

                )}

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default AdminOrders;