import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function Menu() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const categoryFromURL = searchParams.get("category");

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromURL || "Popular");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodieCart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ==========================================
  // FETCH MENU FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/menu`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(`❌ ${data.message}`);
          return;
        }

        setFoods(data.menuItems);
      } catch (error) {
        console.log(error);
        alert("❌ Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // ==========================================
  // FILTER MENU BY CATEGORY
  // ==========================================

  const filteredFoods =
    selectedCategory === "Popular"
      ? foods
      : foods.filter(
          (food) =>
            food.category === selectedCategory
        );

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (food) => {
    const existingItem = cart.find(
      (item) => item._id === food._id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === food._id
          ? {
              ...item,
              quantity:
                Number(item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...food,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);

    localStorage.setItem(
      "foodieCart",
      JSON.stringify(updatedCart)
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="menu-page">
        <div className="menu-header">
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>

          <div>
            <p className="section-label">
              RESTAURANT
            </p>

            <h1>Foodie Menu</h1>

            <p>Loading delicious food... 🍔</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MENU PAGE
  // ==========================================

  return (
    <div className="menu-page">
      <div className="menu-header">
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div>
          <p className="section-label">
            RESTAURANT
          </p>

          <h1>Foodie Menu</h1>

          <p>
            🍕 Delicious Food • ⭐ 4.8 • 🕐 20-40 min
          </p>
        </div>
      </div>

      {/* ==========================================
          CATEGORIES
      ========================================== */}

      <div className="menu-categories">
        <button
          className={
            selectedCategory === "Popular"
              ? "active-category"
              : ""
          }
          onClick={() =>
            setSelectedCategory("Popular")
          }
        >
          Popular
        </button>

        {[
          ...new Set(
            foods.map((food) => food.category)
          ),
        ].map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* ==========================================
          FOOD SECTION
      ========================================== */}

      <div className="food-section">
        <h2>
          {selectedCategory === "Popular"
            ? "Popular Items"
            : `${selectedCategory} Items`}
        </h2>

        {filteredFoods.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              🍽️
            </div>

            <h2>No food items found</h2>

            <p>
              No items are available in this category.
            </p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <div
                className="food-card"
                key={food._id}
              >
                <img
                  src={
                    food.image ||
                    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={food.name}
                />

                <div className="food-info">
                  <h3>{food.name}</h3>

                  <p>{food.description}</p>

                  <div className="food-bottom">
                    <strong>
                      ₹{food.price}
                    </strong>

                    <button
                      className="add-btn"
                      onClick={() =>
                        addToCart(food)
                      }
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==========================================
          FLOATING CART
      ========================================== */}

      <Link
        to="/cart"
        className="floating-cart"
      >
        🛒 View Cart (
        {cart.reduce(
          (total, item) =>
            total + Number(item.quantity || 1),
          0
        )}
        )
      </Link>
    </div>
  );
}

export default Menu;