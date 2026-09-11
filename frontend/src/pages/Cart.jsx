import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("foodieCart");

    if (!savedCart) {
      return [];
    }

    const items = JSON.parse(savedCart);

    return items.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 1,
    }));
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const decreaseQuantity = (index) => {
    const updatedCart = cartItems
      .map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);

    localStorage.setItem(
      "foodieCart",
      JSON.stringify(updatedCart)
    );
  };

  const increaseQuantity = (index) => {
    const updatedCart = cartItems.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      "foodieCart",
      JSON.stringify(updatedCart)
    );
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      "foodieCart",
      JSON.stringify(updatedCart)
    );
  };

  return (
    <div className="cart-page">

      {/* Header */}
      <div className="cart-header">
        <Link to="/menu">
          <button className="back-btn">
            ← Back to Menu
          </button>
        </Link>

        <h1>🛒 Your Cart</h1>
        <button
          className="clear-cart-btn"
          onClick={() => {
            setCartItems([]);
            localStorage.removeItem("foodieCart");
          }}
        >
          🗑️ Clear Cart
        </button>
      </div>

      {/* Cart Content */}
      <div
        className={`cart-container ${
          cartItems.length === 0 ? "empty-cart-container" : ""
        }`}
      >

        {/* Cart Items */}
        <div className="cart-items">

          {cartItems.length === 0 ? (
            <div className="empty-cart">

              <div className="empty-cart-icon">
                🛒
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Add some delicious food to get started!
              </p>

              <Link to="/menu">
                <button className="browse-menu-btn">
                  Browse Menu
                </button>
              </Link>

            </div>
          ) : (
            cartItems.map((item, index) => (

              <div
                className="cart-item"
                key={index}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-info">

                  <h3>{item.name}</h3>

                  <p>₹{item.price}</p>

                  <div className="quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(index)
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(index)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(index)
                  }
                >
                  Remove
                </button>

              </div>

            ))
          )}

        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹40</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{total + 40}
            </strong>
          </div>

        <Link to="/checkout">
          <button className="checkout-btn">
            Place Order
          </button>
        </Link>

        </div>
        )}

      </div>
      

    </div>
  );
}

export default Cart;