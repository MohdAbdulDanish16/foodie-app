import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const DELIVERY_FEE = 40;

function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("foodieCart");

    if (!savedCart) {
      return [];
    }

    try {
      const items = JSON.parse(savedCart);

      return items.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
      }));
    } catch (error) {
      console.log("Cart data error:", error);
      return [];
    }
  });

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  const grandTotal =
    cartItems.length > 0 ? subtotal + DELIVERY_FEE : 0;

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);

    if (updatedCart.length === 0) {
      localStorage.removeItem("foodieCart");
    } else {
      localStorage.setItem(
        "foodieCart",
        JSON.stringify(updatedCart)
      );
    }
  };

  const decreaseQuantity = (index) => {
    const updatedCart = cartItems
      .map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              quantity: Number(item.quantity) - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const increaseQuantity = (index) => {
    const updatedCart = cartItems.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            quantity: Number(item.quantity) + 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter(
      (_, itemIndex) => itemIndex !== index
    );

    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("foodieCart");
  };

  return (
    <div className="cart-page premium-cart-page">

      {/* Top Header */}
      <div className="cart-header premium-cart-header">

        <Link to="/menu">
          <button className="back-btn">
            ← Back to Menu
          </button>
        </Link>

        <div className="cart-title-area">
          <p className="cart-eyebrow">
            YOUR ORDER
          </p>

          <h1>
            🛒 Your Cart
          </h1>

          {cartItems.length > 0 && (
            <p>
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"} ready for checkout
            </p>
          )}
        </div>

        {cartItems.length > 0 && (
          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            🗑️ Clear Cart
          </button>
        )}

      </div>

      {/* Main Cart Area */}
      <div
        className={`cart-container premium-cart-container ${
          cartItems.length === 0
            ? "empty-cart-container"
            : ""
        }`}
      >

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="empty-cart premium-empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <span className="empty-cart-label">
              NOTHING HERE YET
            </span>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added anything delicious yet.
              Explore our menu and find something you'll love.
            </p>

            <Link to="/menu">
              <button className="browse-menu-btn">
                🍴 Explore Menu
              </button>
            </Link>

          </div>
        ) : (

          <>
            {/* Cart Items Section */}
            <div className="cart-items premium-cart-items">

              <div className="cart-section-heading">
                <div>
                  <span>YOUR SELECTION</span>
                  <h2>
                    {totalItems}{" "}
                    {totalItems === 1 ? "Item" : "Items"}
                  </h2>
                </div>
              </div>

              {cartItems.map((item, index) => {

                const itemPrice = Number(item.price || 0);
                const quantity = Number(item.quantity || 1);
                const itemTotal = itemPrice * quantity;

                return (
                  <div
                    className="cart-item premium-cart-item"
                    key={item._id || item.id || index}
                  >

                    {/* Food Image */}
                    <div className="cart-item-image-wrapper">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />

                    </div>

                    {/* Food Information */}
                    <div className="cart-item-info">

                      <span className="cart-item-category">
                        FOODIE SPECIAL
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <p className="cart-item-price">
                        ₹{itemPrice} each
                      </p>

                      {/* Quantity */}
                      <div className="quantity-control">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(index)
                          }
                          aria-label={`Decrease ${item.name}`}
                        >
                          −
                        </button>

                        <span>
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(index)
                          }
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>

                      </div>

                    </div>

                    {/* Item Total + Remove */}
                    <div className="cart-item-actions">

                      <strong className="cart-item-total">
                        ₹{itemTotal}
                      </strong>

                      <button
                        type="button"
                        className="remove-btn premium-remove-btn"
                        onClick={() =>
                          removeItem(index)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                );
              })}

              {/* Continue Shopping */}
              <Link
                to="/menu"
                className="continue-shopping-link"
              >
                ← Continue Shopping
              </Link>

            </div>

            {/* Order Summary */}
            <aside className="cart-summary premium-cart-summary">

              <div className="summary-header">
                <span>ORDER SUMMARY</span>
                <h2>
                  Your Order
                </h2>
              </div>

              <div className="summary-row">
                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal}
                </span>
              </div>

              <div className="summary-row">
                <span>
                  Delivery Fee
                </span>

                <span>
                  ₹{DELIVERY_FEE}
                </span>
              </div>

              <div className="summary-row">
                <span>
                  Taxes
                </span>

                <span>
                  Included
                </span>
              </div>

              <hr />

              <div className="summary-total">
                <div>
                  <span>
                    Total Amount
                  </span>

                  <small>
                    Including delivery
                  </small>
                </div>

                <strong>
                  ₹{grandTotal}
                </strong>
              </div>

              <Link to="/checkout">
                <button className="checkout-btn premium-checkout-btn">
                  Proceed to Checkout
                  <span>→</span>
                </button>
              </Link>

              <div className="secure-checkout-note">
                <span>🔒</span>

                <div>
                  <strong>
                    Secure Checkout
                  </strong>

                  <small>
                    Your order details are protected.
                  </small>
                </div>
              </div>

            </aside>
          </>
        )}

      </div>

    </div>
  );
}

export default Cart;