import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Restaurant from "./pages/Restaurant";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyOrders from "./pages/MyOrders";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminOrders from "./pages/AdminOrders";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminMenu from "./pages/AdminMenu";

import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] =
    useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("foodieCurrentUser")
  );

  const isLoggedIn =
    localStorage.getItem("foodieLoggedIn") === "true";

  const categories = [
    "🍕 Pizza",
    "🍔 Burgers",
    "🍗 Chicken",
    "🍜 Noodles",
    "🍣 Sushi",
    "🥗 Healthy",
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/restaurants`
        );

        const data = await response.json();

        if (!response.ok) {
          console.log(data.message);
          return;
        }

        setRestaurants(data.restaurants);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      menuOpen &&
      !event.target.closest(".more-menu-wrapper")
    ) {
      setMenuOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, [menuOpen]);

  const filteredRestaurants = restaurants.filter(
    (restaurant) => {
      const searchText = search.toLowerCase();

      return (
        restaurant.name
          .toLowerCase()
          .includes(searchText) ||
        restaurant.cuisine
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  const handleLogout = () => {
    localStorage.removeItem("foodieLoggedIn");
    localStorage.removeItem("foodieToken");
    localStorage.removeItem("foodieCurrentUser");

    setMenuOpen(false);

    alert("👋 Logged out successfully!");

    window.location.href = "/";
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          🍴 Foodie
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <a href="#restaurants">
            Restaurants
          </a>

          <Link to="/about">
            About
          </Link>

          <Link to="/contact">
            Contact
          </Link>
        </div>

        <div className="nav-actions">

          {isLoggedIn ? (
            <div className="user-menu">

              {/* Three Dot Menu */}
              <div className="more-menu-wrapper">

                <button
                  type="button"
                  className="more-menu-btn"
                  aria-label="Open menu"
                  aria-expanded={menuOpen}
                  onClick={() =>
                    setMenuOpen(!menuOpen)
                  }
                >
                  ⋮
                </button>

                {menuOpen && (
                  <div className="more-menu-dropdown">

                    {currentUser?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="more-menu-item"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                      >
                        <span>👨‍💼</span>
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      className="more-menu-item"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      <span>📦</span>
                      <span>My Orders</span>
                    </Link>

                    <div className="more-menu-user">
                      <span>👤</span>

                      <div>
                        <strong>
                          {currentUser?.name ||
                            "User"}
                        </strong>

                        <small>
                          {currentUser?.email || ""}
                        </small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="more-menu-item logout-menu-item"
                      onClick={handleLogout}
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>

                  </div>
                )}

              </div>

            </div>
          ) : (
            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>
          )}

          <Link to="/cart">
            <button className="cart-btn">
              🛒 Cart
            </button>
          </Link>

        </div>

      </nav>

      {/* Hero */}
      <section className="hero">

        <div className="hero-content">

          <p className="small-title">
            FAST & FRESH DELIVERY
          </p>

          <h1>
            Delicious food,
            <br />
            <span>
              delivered to you.
            </span>
          </h1>

          {isLoggedIn && currentUser && (
            <div className="home-user-info">

              <strong>
                Welcome back,{" "}
                {currentUser.name}! 👋
              </strong>

              <span>
                {currentUser.email}
              </span>

            </div>
          )}

          <p className="hero-text">
            Discover the best restaurants and
            delicious meals near you. Order your
            favorite food anytime.
          </p>

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search for food or restaurants..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button
              onClick={() => {
                const searchText =
                  search.toLowerCase().trim();

                if (
                  searchText.includes("pizza")
                ) {
                  window.location.href =
                    "/menu?category=Pizza";

                  return;
                }

                if (
                  searchText.includes("burger")
                ) {
                  window.location.href =
                    "/menu?category=Burgers";

                  return;
                }

                if (
                  searchText.includes("chicken")
                ) {
                  window.location.href =
                    "/menu?category=Chicken";

                  return;
                }

                if (
                  searchText.includes("drink") ||
                  searchText.includes("coffee") ||
                  searchText.includes("juice") ||
                  searchText.includes("soda")
                ) {
                  window.location.href =
                    "/menu?category=Drinks";

                  return;
                }

                document
                  .getElementById("restaurants")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Search
            </button>

          </div>

        </div>

        <div className="hero-image">
          <div className="food-circle">
            🍔
          </div>
        </div>

      </section>

      {/* Categories */}
      <section className="section">

        <div className="section-header">

          <div>
            <p className="section-label">
              EXPLORE
            </p>

            <h2>
              What are you craving?
            </h2>
          </div>

        </div>

        <div className="categories">

          {categories.map(
            (category, index) => (
              <Link
                to={`/menu?category=${category.substring(
                  category.indexOf(" ") + 1
                )}`}
                className="category-card"
                key={index}
              >

                <div className="category-icon">
                  {category.split(" ")[0]}
                </div>

                <span>
                  {category.substring(
                    category.indexOf(" ") + 1
                  )}
                </span>

              </Link>
            )
          )}

        </div>

      </section>

      {/* Restaurants */}
      <section
        className="section restaurants-section"
        id="restaurants"
      >

        <div className="section-header">

          <div>
            <p className="section-label">
              TOP PICKS
            </p>

            <h2>
              Popular Restaurants
            </h2>
          </div>

          <Link to="/menu">
            <button className="view-all">
              View All →
            </button>
          </Link>

        </div>

        {loadingRestaurants ? (
          <div className="empty-cart">

            <div className="empty-cart-icon">
              🍽️
            </div>

            <h2>
              Loading restaurants...
            </h2>

            <p>
              Please wait while we load restaurants.
            </p>

          </div>
        ) : (

          <div className="restaurant-grid">

            {filteredRestaurants.map(
              (restaurant) => (

                <div
                  className="restaurant-card"
                  key={restaurant._id}
                >

                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="restaurant-link"
                  >

                    <div className="restaurant-image">

                      <img
                        src={
                          restaurant.image ||
                          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={restaurant.name}
                      />

                      <span className="rating">
                        ⭐ {restaurant.rating}
                      </span>

                    </div>

                    <div className="restaurant-info">

                      <h3>
                        {restaurant.name}
                      </h3>

                      <p>
                        {restaurant.cuisine}
                      </p>

                      <div className="restaurant-bottom">

                        <span>
                          🕐{" "}
                          {restaurant.deliveryTime}
                        </span>

                      </div>

                    </div>

                  </Link>

                  <Link
                    to={`/restaurant/${restaurant._id}`}
                  >
                    <button>
                      View Menu
                    </button>
                  </Link>

                </div>

              )
            )}

            {filteredRestaurants.length === 0 &&
              !loadingRestaurants && (
                <div className="no-results">

                  <div>😔</div>

                  <h3>
                    No restaurants found
                  </h3>

                  <p>
                    Try searching for a restaurant
                    or cuisine.
                  </p>

                </div>
              )}

          </div>

        )}

      </section>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-logo">
          🍴 Foodie
        </div>

        <p>
          Good food. Good mood. ❤️
        </p>

        <div className="footer-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/menu">
            Menu
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/contact">
            Contact
          </Link>

        </div>

        <p className="copyright">
          © 2026 Foodie. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/menu"
        element={<Menu />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={<OrderSuccess />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/restaurant/:id"
        element={<Restaurant />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* Admin Orders */}
      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <AdminOrders />
          </AdminProtectedRoute>
        }
      />

      {/* Admin Restaurants */}
      <Route
        path="/admin/restaurants"
        element={
          <AdminProtectedRoute>
            <AdminRestaurants />
          </AdminProtectedRoute>
        }
      />

      {/* Admin Menu */}
      <Route
        path="/admin/menu"
        element={
          <AdminProtectedRoute>
            <AdminMenu />
          </AdminProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;