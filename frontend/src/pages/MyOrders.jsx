import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

const ORDER_STEPS = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

function MyOrders() {
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
        `${API_URL}/api/orders/my-orders`,
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
  }, [navigate]);

  const getStepIndex = (status) => {
    return ORDER_STEPS.indexOf(status);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Confirmed":
        return "status-confirmed";
      case "Preparing":
        return "status-preparing";
      case "Out for Delivery":
        return "status-delivery";
      case "Delivered":
        return "status-delivered";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const totalSpent = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

  if (loading) {
    return (
      <div className="my-orders-page premium-orders-page">
        <div className="orders-loading">
          <div className="orders-loading-icon">
            📦
          </div>

          <h2>Loading your orders...</h2>

          <p>
            Please wait while we get your latest orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page premium-orders-page">

      {/* Header */}
      <div className="my-orders-header premium-my-orders-header">

        <Link to="/">
          <button className="back-btn">
            ← Back to Home
          </button>
        </Link>

        <div className="my-orders-title">
          <span>ORDER HISTORY</span>

          <h1>
            📦 My Orders
          </h1>

          <p>
            Track and manage all your Foodie orders
          </p>
        </div>

        {orders.length > 0 && (
          <div className="orders-header-summary">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
        )}

      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="empty-cart premium-orders-empty">

          <div className="empty-cart-icon">
            📦
          </div>

          <span className="empty-orders-label">
            NO ORDERS YET
          </span>

          <h2>
            Your order history is empty
          </h2>

          <p>
            You haven't placed an order yet.
            Discover something delicious from our menu.
          </p>

          <Link to="/menu">
            <button className="browse-menu-btn">
              🍴 Explore Menu
            </button>
          </Link>

        </div>
      ) : (

        <>
          {/* Order Overview */}
          <div className="orders-overview">

            <div className="orders-overview-card">
              <span>📦</span>
              <div>
                <small>Total Orders</small>
                <strong>{orders.length}</strong>
              </div>
            </div>

            <div className="orders-overview-card">
              <span>🚚</span>
              <div>
                <small>Active Orders</small>
                <strong>
                  {
                    orders.filter(
                      (order) =>
                        order.status !== "Delivered" &&
                        order.status !== "Cancelled"
                    ).length
                  }
                </strong>
              </div>
            </div>

            <div className="orders-overview-card">
              <span>✅</span>
              <div>
                <small>Delivered</small>
                <strong>
                  {
                    orders.filter(
                      (order) =>
                        order.status === "Delivered"
                    ).length
                  }
                </strong>
              </div>
            </div>

            <div className="orders-overview-card">
              <span>💰</span>
              <div>
                <small>Total Spent</small>
                <strong>₹{totalSpent}</strong>
              </div>
            </div>

          </div>

          {/* Orders */}
          <div className="orders-list premium-orders-list">

            {orders.map((order) => {

              const currentStep = getStepIndex(
                order.status
              );

              const isCancelled =
                order.status === "Cancelled";

              const isPaid =
                order.paymentStatus === "Paid";

              return (
                <div
                  className="order-card premium-user-order-card"
                  key={order._id}
                >

                  {/* Order Header */}
                  <div className="order-top premium-order-top">

                    <div>
                      <span className="user-order-label">
                        FOODIE ORDER
                      </span>

                      <h3>
                        Order #{order._id.slice(-6)}
                      </h3>

                      <p>
                        🕐{" "}
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="order-header-right">

                      <span
                        className={`order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <strong className="order-header-total">
                        ₹{order.totalAmount}
                      </strong>

                    </div>

                  </div>

                  {/* Tracking */}
                  {!isCancelled && (
                    <div className="order-tracking premium-order-tracking">

                      {ORDER_STEPS.map(
                        (step, index) => {

                          const completed =
                            index <= currentStep;

                          return (
                            <div
                              className={`tracking-step ${
                                completed
                                  ? "completed"
                                  : ""
                              }`}
                              key={step}
                            >

                              <div className="tracking-circle">
                                {completed
                                  ? "✓"
                                  : index + 1}
                              </div>

                              <span>
                                {step}
                              </span>

                              {index <
                                ORDER_STEPS.length - 1 && (
                                <div
                                  className={`tracking-line ${
                                    index <
                                    currentStep
                                      ? "completed"
                                      : ""
                                  }`}
                                />
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                  {/* Cancelled */}
                  {isCancelled && (
                    <div className="cancelled-order-message premium-cancelled-message">
                      <span>❌</span>

                      <div>
                        <strong>
                          Order Cancelled
                        </strong>

                        <p>
                          This order has been cancelled.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="order-items premium-order-items">

                    <div className="order-section-title">
                      <span>🍴</span>
                      <h4>Order Items</h4>
                    </div>

                    {order.items.map(
                      (item, index) => {

                        const itemTotal =
                          Number(item.price || 0) *
                          Number(item.quantity || 1);

                        return (
                          <div
                            className="order-item premium-order-item"
                            key={index}
                          >

                            <div>
                              <strong>
                                {item.name}
                              </strong>

                              <span>
                                ₹{item.price} ×{" "}
                                {item.quantity}
                              </span>
                            </div>

                            <strong>
                              ₹{itemTotal}
                            </strong>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* Details */}
                  <div className="order-details premium-order-details">

                    <div className="user-order-detail">
                      <span>💳 Payment</span>
                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </div>

                    <div className="user-order-detail">
                      <span>💰 Payment Status</span>

                      <strong
                        className={
                          isPaid
                            ? "payment-paid"
                            : "payment-pending"
                        }
                      >
                        {isPaid
                          ? "✅ Paid"
                          : "⏳ Pending"}
                      </strong>
                    </div>

                    <div className="user-order-detail">
                      <span>📱 Phone</span>
                      <strong>
                        {order.phone}
                      </strong>
                    </div>

                    {order.transactionId && (
                      <div className="user-order-detail">
                        <span>🧾 Transaction</span>
                        <strong>
                          {order.transactionId}
                        </strong>
                      </div>
                    )}

                    <div className="user-order-detail address-detail">
                      <span>📍 Delivery Address</span>
                      <strong>
                        {order.address}
                      </strong>
                    </div>

                  </div>

                  {/* Bottom Total */}
                  <div className="order-total premium-order-total">

                    <div>
                      <span>
                        Total Amount
                      </span>

                      <small>
                        Including delivery charges
                      </small>
                    </div>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                </div>
              );
            })}

          </div>
        </>
      )}

    </div>
  );
}

export default MyOrders;