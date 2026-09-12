import { useState } from "react";
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

function Home() {
    const [search, setSearch] = useState("");
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

  const restaurants = [
    {
      name: "Pizza Palace",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
      rating: "4.8",
      food: "Pizza • Italian",
      time: "25-35 min",
    },
    {
      name: "Burger House",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      rating: "4.7",
      food: "Burgers • Fast Food",
      time: "20-30 min",
    },
    {
      name: "Chicken Hub",
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
      rating: "4.6",
      food: "Chicken • Fast Food",
      time: "30-40 min",
    },
  ];
    const filteredRestaurants = restaurants.filter((restaurant) => {
  const searchText = search.toLowerCase();

  return (
    restaurant.name.toLowerCase().includes(searchText) ||
    restaurant.food.toLowerCase().includes(searchText) ||
    (searchText.includes("pizza") &&
      restaurant.name === "Pizza Palace") ||
    (searchText.includes("burger") &&
      restaurant.name === "Burger House") ||
    (searchText.includes("chicken") &&
      restaurant.name === "Chicken Hub") ||
    (searchText.includes("drink") &&
      restaurant.name === "Pizza Palace")
  );
});

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🍴 Foodie</div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#restaurants">Restaurants</a>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
  <div className="user-menu">

    {currentUser?.role === "admin" && (
  <Link to="/admin" className="admin-orders-link">
    👨‍💼 Admin
  </Link>
)}
    <Link to="/my-orders" className="my-orders-link">
      📦 My Orders
    </Link>

    <span className="user-welcome">
      👤 {currentUser?.name}
    </span>

    <button
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem("foodieLoggedIn");
        localStorage.removeItem("foodieToken");
        localStorage.removeItem("foodieCurrentUser");

        alert("👋 Logged out successfully!");

        window.location.href = "/";
      }}
    >
      Logout
    </button>
  </div>
) : (
  <Link to="/login">
    <button className="login-btn">
      Login
    </button>
  </Link>
)}

          <Link to="/cart">
            <button className="cart-btn">🛒 Cart</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">

        <div className="hero-content">
          <p className="small-title">FAST & FRESH DELIVERY</p>

          <h1>
            Delicious food,
            <br />
            <span>delivered to you.</span>
          </h1>
          {isLoggedIn && currentUser && (
  <div className="home-user-info">
    <strong>Welcome back, {currentUser.name}! 👋</strong>
    <span>{currentUser.email}</span>
  </div>
)}

          <p className="hero-text">
            Discover the best restaurants and delicious meals
            near you. Order your favorite food anytime.
          </p>

          <div className="search-box">
  <span>🔍</span>

  <input
    type="text"
    placeholder="Search for food or restaurants..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <button
  onClick={() => {
    const searchText = search.toLowerCase().trim();

    if (
      searchText.includes("pizza")
    ) {
      window.location.href = "/menu?category=Pizza";
      return;
    }

    if (
      searchText.includes("burger")
    ) {
      window.location.href = "/menu?category=Burgers";
      return;
    }

    if (
      searchText.includes("chicken")
    ) {
      window.location.href = "/menu?category=Chicken";
      return;
    }

    if (
      searchText.includes("drink") ||
      searchText.includes("coffee") ||
      searchText.includes("juice") ||
      searchText.includes("soda")
    ) {
      window.location.href = "/menu?category=Drinks";
      return;
    }

    document
      .getElementById("restaurants")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Search
</button>

</div>
        </div>

        <div className="hero-image">
          <div className="food-circle">🍔</div>
        </div>

      </section>

      {/* Categories */}
<section className="section">

  <div className="section-header">
    <div>
      <p className="section-label">EXPLORE</p>
      <h2>What are you craving?</h2>
    </div>
  </div>

  <div className="categories">

    {categories.map((category, index) => (
      <Link
        to="/menu"
        className="category-card"
        key={index}
      >

        <div className="category-icon">
          {category.split(" ")[0]}
        </div>

        <span>
          {category.substring(category.indexOf(" ") + 1)}
        </span>

      </Link>
    ))}

  </div>

</section>

      {/* Restaurants */}
<section
  className="section restaurants-section"
  id="restaurants"
>

  <div className="section-header">

    <div>
      <p className="section-label">TOP PICKS</p>
      <h2>Popular Restaurants</h2>
    </div>

    <Link to="/menu">
      <button className="view-all">
        View All →
      </button>
    </Link>

  </div>

  <div className="restaurant-grid">

    {filteredRestaurants.map((restaurant, index) => {

      const restaurantId =
        restaurant.name === "Pizza Palace"
          ? "pizza"
          : restaurant.name === "Burger House"
          ? "burger"
          : "chicken";

      return (
        <div
          className="restaurant-card"
          key={index}
        >

          <Link
            to={`/restaurant/${restaurantId}`}
            className="restaurant-link"
          >

            <div className="restaurant-image">

              <img
                src={restaurant.image}
                alt={restaurant.name}
              />

              <span className="rating">
                ⭐ {restaurant.rating}
              </span>

            </div>

            <div className="restaurant-info">

              <h3>{restaurant.name}</h3>

              <p>{restaurant.food}</p>

              <div className="restaurant-bottom">

                <span>
                  🕐 {restaurant.time}
                </span>

              </div>

            </div>

          </Link>

          <Link to={`/restaurant/${restaurantId}`}>
            <button>
              View Menu
            </button>
          </Link>

        </div>
      );
    })}

    {filteredRestaurants.length === 0 && (
  <div className="no-results">
    <div>😔</div>
    <h3>No restaurants found</h3>
    <p>Try searching for pizza, burger, or chicken.</p>
  </div>
)}

  </div>

</section>

      {/* Footer */}
<footer className="footer">
  <div className="footer-logo">🍴 Foodie</div>

  <p>Good food. Good mood. ❤️</p>

  <div className="footer-links">
    <Link to="/">Home</Link>
    <Link to="/menu">Menu</Link>
    <Link to="/about">About</Link>
    <Link to="/contact">Contact</Link>
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
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout"element={<ProtectedRoute><Checkout /></ProtectedRoute>}/>
      <Route path="/my-orders"element={<ProtectedRoute><MyOrders /></ProtectedRoute>}/>
      <Route path="/order-success"element={<OrderSuccess />}/>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/restaurant/:id"element={<Restaurant />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Dashboard */}
      <Route path="/admin"element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}/>
      {/* Admin Orders */}
      <Route path="/admin/orders"element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>}/>

      <Route path="/admin/restaurants"element={<AdminProtectedRoute><AdminRestaurants /></AdminProtectedRoute>}/>

      <Route path="/admin/menu"element={<AdminProtectedRoute><AdminMenu /></AdminProtectedRoute>}/>
    </Routes>
  );
}

export default App;