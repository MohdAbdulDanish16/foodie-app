import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function Restaurant() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodieCart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantResponse = await fetch(
          `${API_URL}/api/restaurants/${id}`
        );

        const restaurantData =
          await restaurantResponse.json();

        if (!restaurantResponse.ok) {
          setError(
            restaurantData.message ||
              "Restaurant not found"
          );
          return;
        }

        setRestaurant(restaurantData.restaurant);

        const menuResponse = await fetch(
          `${API_URL}/api/menu`
        );

        const menuData = await menuResponse.json();

        if (!menuResponse.ok) {
          setError(
            menuData.message ||
              "Failed to load menu"
          );
          return;
        }

        const restaurantFoods =
          menuData.menuItems.filter(
            (food) =>
              food.restaurantId?._id === id
          );

        setFoods(restaurantFoods);
      } catch (error) {
        console.log(error);
        setError(
          "Cannot connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

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

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  if (loading) {
    return (
      <div className="restaurant-page">
        <div className="empty-cart">
          <h2>Loading restaurant...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="restaurant-page">
        <div className="empty-cart">
          <h2>
            {error || "Restaurant not found"}
          </h2>

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
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="restaurant-title">
          <div className="restaurant-big-emoji">
            🍽️
          </div>

          <div>
            <h1>{restaurant.name}</h1>

            <p>{restaurant.description}</p>

            <p>
              ⭐ {restaurant.rating}
              {" • "}
              {restaurant.cuisine}
              {" • "}
              🕐 {restaurant.deliveryTime}
            </p>
          </div>
        </div>
      </div>

      <div className="restaurant-menu">
        <h2>Menu</h2>

        {foods.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              🍽️
            </div>

            <h2>No menu items available</h2>

            <p>
              This restaurant does not have any
              available food items yet.
            </p>
          </div>
        ) : (
          <div className="restaurant-food-grid">
            {foods.map((food) => (
              <div
                className="restaurant-food-card"
                key={food._id}
              >
                <img
                  src={
                    food.image ||
                    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
                  }
                  alt={food.name}
                />

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
            ))}
          </div>
        )}
      </div>

      <Link
        to="/cart"
        className="floating-cart"
      >
        🛒 View Cart ({cartCount})
      </Link>
    </div>
  );
}

export default Restaurant;