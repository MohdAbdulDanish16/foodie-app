import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";

function Menu() {
  const navigate = useNavigate();

    const [searchParams] = useSearchParams();

      const categoryFromURL = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromURL || "Popular");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodieCart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // =========================
  // FOOD ITEMS
  // =========================

  const foods = [
    // ---------- PIZZA ----------
    {
      name: "Margherita Pizza",
      description: "Fresh tomato, mozzarella and basil",
      price: 299,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Farmhouse Pizza",
      description: "Loaded with fresh vegetables and cheese",
      price: 399,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Cheese Burst Pizza",
      description: "Extra cheesy pizza with a delicious crust",
      price: 449,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80",
    },

    // ---------- BURGERS ----------
    {
      name: "Classic Burger",
      description: "Juicy chicken patty with fresh vegetables",
      price: 199,
      category: "Burgers",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Cheese Burger",
      description: "Juicy burger topped with melted cheese",
      price: 249,
      category: "Burgers",
      image:
        "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Chicken Burger",
      description: "Crispy chicken burger with fresh lettuce",
      price: 299,
      category: "Burgers",
      image:
        "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80",
    },

    // ---------- CHICKEN ----------
    {
      name: "Chicken Wings",
      description: "Crispy spicy chicken wings",
      price: 249,
      category: "Chicken",
      image:
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Fried Chicken",
      description: "Crispy golden fried chicken",
      price: 279,
      category: "Chicken",
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Chicken Biryani",
      description: "Aromatic basmati rice with tender chicken",
      price: 299,
      category: "Chicken",
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=600&q=80",
    },

    // ---------- POPULAR ----------
    {
      name: "French Fries",
      description: "Crispy golden french fries",
      price: 129,
      category: "Popular",
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    },

    // ---------- DRINKS ----------
    {
      name: "Fresh Lime Soda",
      description: "Refreshing chilled lime soda",
      price: 99,
      category: "Drinks",
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Cold Coffee",
      description: "Creamy chilled coffee",
      price: 149,
      category: "Drinks",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    },

    {
      name: "Fresh Orange Juice",
      description: "Freshly prepared orange juice",
      price: 129,
      category: "Drinks",
      image:
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80",
    },
  ];

  // =========================
  // FILTER FOOD
  // =========================

  const filteredFoods =
    selectedCategory === "Popular"
      ? foods
      : foods.filter(
          (food) => food.category === selectedCategory
        );

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (food) => {
    const existingItem = cart.find(
      (item) => item.name === food.name
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.name === food.name
          ? {
              ...item,
              quantity: item.quantity + 1,
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

  // =========================
  // PAGE
  // =========================

  return (
    <div className="menu-page">

      {/* HEADER */}
      <div className="menu-header">
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div>
          <p className="section-label">RESTAURANT</p>

          <h1>Foodie Menu</h1>

          <p>
            🍕 Delicious Food • ⭐ 4.8 • 🕐 20-40 min
          </p>
        </div>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="menu-categories">

        {[
          "Popular",
          "Pizza",
          "Burgers",
          "Chicken",
          "Drinks",
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

      {/* FOOD SECTION */}
      <div className="food-section">

        <h2>
          {selectedCategory === "Popular"
            ? "Popular Items"
            : `${selectedCategory} Items`}
        </h2>

        <div className="food-grid">

          {filteredFoods.map((food) => (
            <div
              className="food-card"
              key={food.name}
            >

              <img
                src={food.image}
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

      </div>

      {/* CART */}
      <Link
        to="/cart"
        className="floating-cart"
      >
        🛒 View Cart (
        {cart.reduce(
          (total, item) =>
            total + item.quantity,
          0
        )}
        )
      </Link>

    </div>
  );
}

export default Menu;