import { useNavigate } from "react-router-dom";
import "../App.css";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-main-message">
          Thank you for ordering with Foodie 🎉
        </p>

        <p className="success-sub-message">
          Your delicious food is being prepared.
          You can track your order from My Orders.
        </p>

        <div className="success-actions">

          <button
            className="track-order-btn"
            onClick={() => navigate("/my-orders")}
          >
            📦 Track My Order
          </button>

          <button
            className="browse-menu-btn"
            onClick={() => navigate("/menu")}
          >
            🍔 Order More Food
          </button>

          <button
            className="home-btn"
            onClick={() => navigate("/")}
          >
            🏠 Go to Home
          </button>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;