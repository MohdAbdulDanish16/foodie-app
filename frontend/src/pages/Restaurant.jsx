import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../App.css";

function Restaurant() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodieCart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const restaurants = {
    pizza: {
      name: "Pizza Palace",
      emoji: "🍕",
      description: "Delicious pizzas made with fresh ingredients.",
      foods: [
        {
          name: "Margherita Pizza",
          price: 299,
          emoji: "🍕",
          image:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Farmhouse Pizza",
          price: 399,
          emoji: "🍕",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Cheese Burst Pizza",
          price: 449,
          emoji: "🧀",
          image:
            "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=500&q=80",
        },
      ],
    },

    burger: {
      name: "Burger House",
      emoji: "🍔",
      description: "Juicy burgers, crispy fries and refreshing drinks.",
      foods: [
        {
          name: "Classic Burger",
          price: 199,
          emoji: "🍔",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Cheese Burger",
          price: 249,
          emoji: "🍔",
          image:
            "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Chicken Burger",
          price: 299,
          emoji: "🍔",
          image:
            "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=500&q=80",
        },
      ],
    },

    chicken: {
      name: "Chicken Hub",
      emoji: "🍗",
      description: "Crispy and delicious chicken dishes.",
      foods: [
        {
          name: "Chicken Wings",
          price: 249,
          emoji: "🍗",
          image:
            "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Chicken Biryani",
          price: 299,
          emoji: "🍛",
          image:
            "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Fried Chicken",
          price: 279,
          emoji: "🍗",
          image:
            "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80",
        },
      ],
    },
  };

  const restaurant = restaurants[id];

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

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (!restaurant) {
    return (
      <div className="restaurant-page">
        <div className="empty-cart">

          <h2>Restaurant not found</h2>

          <Link to="/">
            <button className="browse-menu-btn">
              Back to Home
            </button>
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-page">

      <div className="restaurant-header">

        <Link to="/">
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← Back 
          </button>
        </Link>

        <div className="restaurant-title">

          <div className="restaurant-big-emoji">
            {restaurant.emoji}
          </div>

          <div>
            <h1>{restaurant.name}</h1>
            <p>{restaurant.description}</p>
          </div>

        </div>

      </div>

      <div className="restaurant-menu">

        <h2>Menu</h2>

        <div className="restaurant-food-grid">

          {restaurant.foods.map((food, index) => (
            <div
              className="restaurant-food-card"
              key={index}
            >

              <div className="food-emoji">
                {food.emoji}
              </div>

              <h3>{food.name}</h3>

              <div className="food-bottom">

                <strong>
                  ₹{food.price}
                </strong>

                <button
                  className="add-btn"
                  onClick={() => addToCart(food)}
                >
                  + Add
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      <Link to="/cart" className="floating-cart">
        🛒 View Cart ({cartCount})
      </Link>

    </div>
  );
}

export default Restaurant;