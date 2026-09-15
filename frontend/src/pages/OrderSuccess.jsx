import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="order-success-page">
      <div className="order-success-container">

        <div className="order-success-header">
          <div className="success-animation">
            <div className="success-circle">
              <span>✓</span>
            </div>
          </div>

          <span className="order-success-eyebrow">
            ORDER CONFIRMED
          </span>

          <h1>Your Order is Confirmed!</h1>

          <p>
            Thank you for ordering with Foodie. We're preparing
            your delicious meal.
          </p>
        </div>

        <section className="order-tracking-card">
          <div className="tracking-header">
            <div>
              <span className="tracking-label">
                ORDER TRACKING
              </span>

              <h2>What's Next?</h2>
            </div>
          </div>

          <div className="order-timeline">

            <div className="timeline-step completed">
              <div className="timeline-indicator">
                ✓
              </div>

              <div className="timeline-content">
                <strong>Order Confirmed</strong>
                <span>We've received your order</span>
              </div>
            </div>

            <div className="timeline-step current">
              <div className="timeline-indicator">
                👨‍🍳
              </div>

              <div className="timeline-content">
                <strong>Preparing</strong>
                <span>
                  Restaurant will prepare your food
                </span>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-indicator">
                🛵
              </div>

              <div className="timeline-content">
                <strong>On the Way</strong>
                <span>
                  Your food will be delivered to you
                </span>
              </div>
            </div>

          </div>
        </section>

        <div className="order-success-actions">
          <Link
            to="/my-orders"
            className="order-primary-btn"
          >
            Track My Order
            <span>→</span>
          </Link>

          <Link
            to="/menu"
            className="order-secondary-btn"
          >
            Order More Food
          </Link>

          <Link
            to="/"
            className="order-secondary-btn"
          >
            Back to Home
          </Link>
        </div>

        <div className="order-success-footer">
          <div>🔒</div>

          <div>
            <strong>
              Your order is being handled securely
            </strong>

            <p>
              Thank you for choosing Foodie. We hope you have
              a delicious experience!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;