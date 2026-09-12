import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    cuisine: "",
    deliveryTime: "25-35 min",
    rating: 0,
    isActive: true,
  });

  const fetchRestaurants = async () => {
    const token = localStorage.getItem("foodieToken");

    try {
      const response = await fetch(
        `${API_URL}/api/restaurants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      setRestaurants(data.restaurants);
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      cuisine: "",
      deliveryTime: "25-35 min",
      rating: 0,
      isActive: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("foodieToken");

    try {
      const url = editingId
        ? `${API_URL}/api/restaurants/${editingId}`
        : `${API_URL}/api/restaurants`;

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      alert(
        editingId
          ? "✅ Restaurant updated successfully!"
          : "✅ Restaurant added successfully!"
      );

      resetForm();
      fetchRestaurants();
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  const editRestaurant = (restaurant) => {
    setEditingId(restaurant._id);

    setFormData({
      name: restaurant.name || "",
      description: restaurant.description || "",
      image: restaurant.image || "",
      cuisine: restaurant.cuisine || "",
      deliveryTime:
        restaurant.deliveryTime || "25-35 min",
      rating: restaurant.rating || 0,
      isActive: restaurant.isActive ?? true,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteRestaurant = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("foodieToken");

    try {
      const response = await fetch(
        `${API_URL}/api/restaurants/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      alert("✅ Restaurant deleted successfully!");

      fetchRestaurants();
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <h2>Loading restaurants...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <Link to="/admin">
          <button className="back-btn">
            ← Back to Dashboard
          </button>
        </Link>

        <h1>🍽️ Restaurant Management</h1>

        <p>
          Add and manage restaurants in your Foodie application
        </p>
      </div>

      <div className="admin-dashboard-actions">
        <button
          className="admin-dashboard-btn"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm
            ? "✖ Close Form"
            : "➕ Add Restaurant"}
        </button>
      </div>

      {showForm && (
        <div className="admin-recent-orders">
          <div className="admin-section-header">
            <h2>
              {editingId
                ? "✏️ Edit Restaurant"
                : "➕ Add New Restaurant"}
            </h2>
          </div>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Restaurant Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="text"
              name="image"
              placeholder="Restaurant Image URL"
              value={formData.image}
              onChange={handleChange}
            />

            <input
              type="text"
              name="cuisine"
              placeholder="Cuisine (Example: Pizza • Italian)"
              value={formData.cuisine}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="deliveryTime"
              placeholder="Delivery Time"
              value={formData.deliveryTime}
              onChange={handleChange}
            />

            <input
              type="number"
              name="rating"
              placeholder="Rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
            />

            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              {" "}Restaurant Active
            </label>

            <button
              type="submit"
              className="admin-dashboard-btn"
            >
              {editingId
                ? "💾 Update Restaurant"
                : "✅ Save Restaurant"}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-delete-btn"
                onClick={resetForm}
              >
                ✖ Cancel Edit
              </button>
            )}
          </form>
        </div>
      )}

      <div className="admin-recent-orders">
        <div className="admin-section-header">
          <h2>🏪 Restaurants</h2>

          <strong>
            {restaurants.length} Restaurant
            {restaurants.length !== 1 ? "s" : ""}
          </strong>
        </div>

        {restaurants.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🍽️</div>

            <h2>No restaurants yet</h2>

            <p>
              Add your first restaurant using the button above.
            </p>
          </div>
        ) : (
          <div className="recent-orders-list">
            {restaurants.map((restaurant) => (
              <div
                className="recent-order-card"
                key={restaurant._id}
              >
                <div>
                  <h3>{restaurant.name}</h3>

                  <p>{restaurant.cuisine}</p>

                  <p>
                    ⭐ {restaurant.rating}
                    {" • "}
                    {restaurant.deliveryTime}
                  </p>

                  <p>
                    {restaurant.description ||
                      "No description added"}
                  </p>
                </div>

                <div>
                  <span className="recent-order-status">
                    {restaurant.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                  <br />

                  <button
                    className="admin-dashboard-btn"
                    onClick={() =>
                      editRestaurant(restaurant)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <br />

                  <button
                    className="admin-delete-btn"
                    onClick={() =>
                      deleteRestaurant(restaurant._id)
                    }
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRestaurants;