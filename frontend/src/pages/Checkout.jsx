import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems] = useState(() => {
    const savedCart = localStorage.getItem("foodieCart");

    if (!savedCart) {
      return [];
    }

    return JSON.parse(savedCart);
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [placingOrder, setPlacingOrder] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.price * (Number(item.quantity) || 1),
    0
  );

  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/menu");
      return;
    }

    if (phone.length < 10) {
      alert("❌ Please enter a valid phone number.");
      return;
    }

    const token = localStorage.getItem("foodieToken");

    if (!token) {
      alert("❌ Please login before placing an order.");
      navigate("/login");
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerName: name,
            items: cartItems.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: Number(item.quantity) || 1,
            })),
            totalAmount: total,
            phone,
            address,
            paymentMethod: payment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        setPlacingOrder(false);
        return;
      }

      localStorage.removeItem("foodieCart");

      navigate("/order-success");
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>Add some food before checking out.</p>

          <Link to="/menu">
            <button className="browse-menu-btn">
              Browse Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/cart">
          <button className="back-btn">
            ← Back to Cart
          </button>
        </Link>

        <h1>💳 Checkout</h1>

        <p>Complete your details and place your order</p>
      </div>

      <div className="checkout-container">

        {/* DELIVERY FORM */}
        <div className="checkout-form">
          <h2>📍 Delivery Details</h2>

          <form onSubmit={handlePlaceOrder}>

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter your 10-digit phone number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              required
            />

            <label>Delivery Address</label>

            <textarea
              placeholder="Enter your complete delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>

            <label>Payment Method</label>

            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option>Cash on Delivery</option>
              <option>UPI</option>
              <option>Credit / Debit Card</option>
            </select>

            <button
              type="submit"
              className="checkout-btn"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : `Place Order • ₹${total}`}
            </button>

          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>🛒 Order Summary</h2>

          {cartItems.map((item, index) => {
            const quantity = Number(item.quantity) || 1;

            return (
              <div
                className="checkout-item"
                key={index}
              >
                <span>
                  {item.name} × {quantity}
                </span>

                <strong>
                  ₹{item.price * quantity}
                </strong>
              </div>
            );
          })}

          <hr />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{total}
            </strong>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;