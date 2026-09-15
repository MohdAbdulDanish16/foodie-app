import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const DELIVERY_FEE = 40;

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("foodieCart") || "[]"
      );

      setCartItems(
        Array.isArray(savedCart)
          ? savedCart.map((item) => ({
              ...item,
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
            }))
          : []
      );
    } catch {
      setCartItems([]);
    }
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const grandTotal =
    cartItems.length > 0 ? subtotal + DELIVERY_FEE : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("foodieToken");

    if (!token) {
      alert("Please login before placing your order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/menu");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill all delivery details.");
      return;
    }

    if (phone.trim().length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (payment === "UPI" && !upiId.trim()) {
      alert("Please enter your UPI ID.");
      return;
    }

    if (payment === "Credit / Debit Card") {
      if (
        cardNumber.replace(/\s/g, "").length < 16 ||
        !expiry.trim() ||
        cvv.trim().length < 3
      ) {
        alert("Please enter valid card details.");
        return;
      }
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: name.trim(),
          items: cartItems.map((item) => ({
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity) || 1,
          })),
          phone: phone.trim(),
          address: address.trim(),
          paymentMethod: payment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to place order.");
        return;
      }

      localStorage.removeItem("foodieCart");

      navigate("/order-success");
    } catch (error) {
      console.error("Order error:", error);
      alert("Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page premium-checkout-page">
        <div className="premium-checkout-empty">
          <div className="checkout-empty-icon">🛒</div>

          <span className="checkout-empty-label">
            CHECKOUT
          </span>

          <h1>Your cart is empty</h1>

          <p>
            Add some delicious food to your cart before
            continuing to checkout.
          </p>

          <Link to="/menu" className="checkout-empty-btn">
            Browse Menu →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page premium-checkout-page">
      {/* HEADER */}
      <header className="checkout-header premium-checkout-header">
        <Link to="/cart" className="back-btn">
          ← Back to Cart
        </Link>

        <div className="checkout-title-area">
          <span className="checkout-eyebrow">
            SECURE CHECKOUT
          </span>

          <h1>Complete Your Order</h1>

          <p>
            Review your details and choose your preferred
            payment method.
          </p>
        </div>

        <div className="checkout-step-badge">
          <span>STEP</span>
          <strong>3 / 3</strong>
        </div>
      </header>

      {/* MAIN */}
      <div className="checkout-container premium-checkout-container">
        <form
          className="checkout-form premium-checkout-form"
          onSubmit={handleSubmit}
        >
          {/* DELIVERY DETAILS */}
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <div className="checkout-section-number">01</div>

              <div>
                <span>DELIVERY</span>
                <h2>Delivery Details</h2>
              </div>
            </div>

            <div className="checkout-form-grid">
              <div className="checkout-field">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="checkout-field">
                <label>Phone Number</label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                />
              </div>

              <div className="checkout-field full-width">
                <label>Delivery Address</label>

                <textarea
                  rows="4"
                  placeholder="Enter your complete delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* PAYMENT */}
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <div className="checkout-section-number">02</div>

              <div>
                <span>PAYMENT</span>
                <h2>Choose Payment Method</h2>
              </div>
            </div>

            <div className="payment-method-options">
              {/* COD */}
              <label
                className={`payment-method-card ${
                  payment === "Cash on Delivery"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={payment === "Cash on Delivery"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <div className="payment-method-icon">💵</div>

                <div className="payment-method-content">
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your food arrives</span>
                </div>

                <div className="payment-radio"></div>
              </label>

              {/* UPI */}
              <label
                className={`payment-method-card ${
                  payment === "UPI" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={payment === "UPI"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <div className="payment-method-icon">📱</div>

                <div className="payment-method-content">
                  <strong>UPI</strong>
                  <span>Pay securely using UPI</span>
                </div>

                <div className="payment-radio"></div>
              </label>

              {/* CARD */}
              <label
                className={`payment-method-card ${
                  payment === "Credit / Debit Card"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Credit / Debit Card"
                  checked={payment === "Credit / Debit Card"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <div className="payment-method-icon">💳</div>

                <div className="payment-method-content">
                  <strong>Credit / Debit Card</strong>
                  <span>Visa, Mastercard and more</span>
                </div>

                <div className="payment-radio"></div>
              </label>
            </div>

            {/* UPI DETAILS */}
            {payment === "UPI" && (
              <div className="payment-details-box premium-payment-box">
                <div className="payment-box-header">
                  <div>
                    <span>UPI PAYMENT</span>
                    <h3>Enter UPI Details</h3>
                  </div>

                  <span>🔒</span>
                </div>

                <div className="checkout-field">
                  <label>UPI ID</label>

                  <input
                    type="text"
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* CARD DETAILS */}
            {payment === "Credit / Debit Card" && (
              <div className="payment-details-box premium-payment-box">
                <div className="payment-box-header">
                  <div>
                    <span>CARD PAYMENT</span>
                    <h3>Enter Card Details</h3>
                  </div>

                  <span>🔒</span>
                </div>

                <div className="checkout-form-grid">
                  <div className="checkout-field full-width">
                    <label>Card Number</label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="19"
                      placeholder="Enter card number"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16)
                            .replace(/(.{4})/g, "$1 ")
                            .trim()
                        )
                      }
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Expiry Date</label>

                    <input
                      type="text"
                      maxLength="5"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4)
                            .replace(/(\d{2})(\d)/, "$1/$2")
                        )
                      }
                    />
                  </div>

                  <div className="checkout-field">
                    <label>CVV</label>

                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength="3"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 3)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECURITY */}
          <div className="checkout-security-note">
            <span>🔒</span>

            <div>
              <strong>Secure Checkout</strong>

              <p>
                Your payment and personal information are
                protected.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="checkout-btn premium-place-order-btn"
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
            {!loading && <span>→</span>}
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <aside className="checkout-summary premium-checkout-summary">
          <div className="checkout-summary-header">
            <div>
              <span>YOUR ORDER</span>
              <h2>Order Summary</h2>
            </div>

            <span className="summary-item-count">
              {totalItems} items
            </span>
          </div>

          <div className="checkout-items-list">
            {cartItems.map((item) => (
              <div
                className="checkout-item premium-checkout-item"
                key={item._id || item.id || item.name}
              >
                <div className="checkout-item-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>🍴</span>
                  )}
                </div>

                <div className="checkout-item-info">
                  <strong>{item.name}</strong>

                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>

                <strong className="checkout-item-total">
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-pricing">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <strong>₹{DELIVERY_FEE}</strong>
            </div>

            <hr />

            <div className="summary-total premium-summary-total">
              <span>Total</span>
              <strong>₹{grandTotal}</strong>
            </div>
          </div>

          <div className="checkout-trust-box">
            <span>🛡️</span>

            <div>
              <strong>Safe & Secure</strong>

              <p>
                Your order is protected by Foodie.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;