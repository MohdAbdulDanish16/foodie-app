import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
        alert("❌ Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const orderSteps = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const getStepIndex = (status) => {
    return orderSteps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  return (
    <div className="my-orders-page">

      <div className="my-orders-header">

        <Link to="/">
          <button className="back-btn">
            ← Back to Home
          </button>
        </Link>

        <h1>📦 My Orders</h1>

        <p>
          Track and view your Foodie orders
        </p>

      </div>

      {orders.length === 0 ? (
        <div className="empty-cart">

          <div className="empty-cart-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            Order some delicious food to see it here.
          </p>

          <Link to="/menu">
            <button className="browse-menu-btn">
              Browse Menu
            </button>
          </Link>

        </div>
      ) : (

        <div className="orders-list">

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
                className="order-card"
                key={order._id}
              >

                {/* Order Header */}

                <div className="order-top">

                  <div>

                    <h3>
                      Order #{order._id.slice(-6)}
                    </h3>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <span
                    className={`order-status ${
                      order.status === "Pending"
                        ? "status-pending"
                        : order.status === "Confirmed"
                        ? "status-confirmed"
                        : order.status === "Preparing"
                        ? "status-preparing"
                        : order.status === "Out for Delivery"
                        ? "status-delivery"
                        : order.status === "Delivered"
                        ? "status-delivered"
                        : order.status === "Cancelled"
                        ? "status-cancelled"
                        : ""
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Order Tracking */}

                {!isCancelled && (

                  <div className="order-tracking">

                    {orderSteps.map(
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
                              orderSteps.length - 1 && (
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

                {/* Cancelled Message */}

                {isCancelled && (

                  <div className="cancelled-order-message">
                    ❌ This order has been cancelled.
                  </div>

                )}

                {/* Items */}

                <div className="order-items">

                  {order.items.map(
                    (item, index) => (

                      <div
                        className="order-item"
                        key={index}
                      >

                        <span>
                          {item.name} ×{" "}
                          {item.quantity}
                        </span>

                        <strong>
                          ₹
                          {item.price *
                            item.quantity}
                        </strong>

                      </div>

                    )
                  )}

                </div>

                {/* Order Details */}

                <div className="order-details">

                  <p>
                    <strong>
                      Payment:
                    </strong>{" "}
                    {order.paymentMethod}
                  </p>

                  {/* PAYMENT STATUS */}

                  <p>
                    <strong>
                      Payment Status:
                    </strong>{" "}

                    <span
                      className={
                        isPaid
                          ? "payment-paid"
                          : "payment-pending"
                      }
                    >
                      {isPaid
                        ? "✅ Paid"
                        : "⏳ Pending"}
                    </span>

                  </p>

                  {/* TRANSACTION ID */}

                  {order.transactionId && (
                    <p>
                      <strong>
                        Transaction ID:
                      </strong>{" "}
                      {order.transactionId}
                    </p>
                  )}

                  <p>
                    <strong>
                      Phone:
                    </strong>{" "}
                    {order.phone}
                  </p>

                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {order.address}
                  </p>

                </div>

                {/* Total */}

                <div className="order-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{order.totalAmount}
                  </strong>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default MyOrders;