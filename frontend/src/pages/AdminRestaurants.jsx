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

      setRestaurants(data.restaurants || []);
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
      deliveryTime: restaurant.deliveryTime || "25-35 min",
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
        <div className="admin-dashboard-loading">
          <div className="admin-loading-spinner"></div>
          <h2>Loading restaurants...</h2>
          <p>Please wait while we fetch restaurant data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-restaurant-page">

      {/* HEADER */}
      <div className="admin-restaurant-header">

        <Link
          to="/admin"
          className="admin-restaurant-back"
        >
          ← Back to Dashboard
        </Link>

        <div className="admin-restaurant-heading">
          <span>FOODIE ADMIN PANEL</span>

          <h1>Restaurant Management</h1>

          <p>
            Add, edit and manage restaurants available
            on your Foodie application.
          </p>
        </div>

      </div>


      {/* TOP ACTION */}
      <div className="admin-restaurant-toolbar">

        <div>
          <strong>
            {restaurants.length}
          </strong>

          <span>
            Restaurant
            {restaurants.length !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          className="restaurant-add-btn"
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
            : "＋ Add Restaurant"}
        </button>

      </div>


      {/* FORM */}
      {showForm && (
        <section className="admin-restaurant-form-card">

          <div className="admin-restaurant-form-header">

            <div>
              <span>
                {editingId
                  ? "EDIT RESTAURANT"
                  : "NEW RESTAURANT"}
              </span>

              <h2>
                {editingId
                  ? "Edit Restaurant"
                  : "Add New Restaurant"}
              </h2>
            </div>

            {editingId && (
              <span className="editing-badge">
                Editing
              </span>
            )}

          </div>


          <form
            className="restaurant-premium-form"
            onSubmit={handleSubmit}
          >

            <div className="restaurant-form-grid">

              <div className="restaurant-form-group">
                <label>Restaurant Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Pizza Palace"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="restaurant-form-group">
                <label>Cuisine</label>

                <input
                  type="text"
                  name="cuisine"
                  placeholder="Example: Pizza • Italian"
                  value={formData.cuisine}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="restaurant-form-group">
                <label>Delivery Time</label>

                <input
                  type="text"
                  name="deliveryTime"
                  placeholder="Example: 25-35 min"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                />
              </div>


              <div className="restaurant-form-group">
                <label>Rating</label>

                <input
                  type="number"
                  name="rating"
                  placeholder="0 - 5"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>

            </div>


            <div className="restaurant-form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Write a short restaurant description..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>


            <div className="restaurant-form-group">
              <label>Restaurant Image URL</label>

              <input
                type="text"
                name="image"
                placeholder="https://example.com/restaurant.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>


            <label className="restaurant-active-toggle">

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              <span>
                Restaurant is active
              </span>

            </label>


            <div className="restaurant-form-actions">

              <button
                type="submit"
                className="restaurant-save-btn"
              >
                {editingId
                  ? "💾 Update Restaurant"
                  : "✓ Save Restaurant"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="restaurant-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </section>
      )}


      {/* RESTAURANTS */}
      <section className="admin-restaurant-list-section">

        <div className="admin-restaurant-list-header">

          <div>
            <span>YOUR RESTAURANTS</span>

            <h2>Restaurant List</h2>
          </div>

          <p>
            {restaurants.length} total
          </p>

        </div>


        {restaurants.length === 0 ? (

          <div className="restaurant-empty-state">

            <div>🍽️</div>

            <h3>No restaurants yet</h3>

            <p>
              Add your first restaurant to get started.
            </p>

          </div>

        ) : (

          <div className="restaurant-premium-list">

            {restaurants.map((restaurant) => (

              <div
                className="restaurant-premium-card"
                key={restaurant._id}
              >

                <div className="restaurant-card-image">

                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                    />
                  ) : (
                    <span>🍽️</span>
                  )}

                </div>


                <div className="restaurant-card-info">

                  <div className="restaurant-card-title-row">

                    <div>

                      <h3>
                        {restaurant.name}
                      </h3>

                      <p className="restaurant-cuisine">
                        {restaurant.cuisine}
                      </p>

                    </div>

                    <span
                      className={
                        restaurant.isActive
                          ? "restaurant-active-badge"
                          : "restaurant-inactive-badge"
                      }
                    >
                      {restaurant.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>


                  <p className="restaurant-description">
                    {restaurant.description ||
                      "No description added"}
                  </p>


                  <div className="restaurant-meta">

                    <span>
                      ⭐ {restaurant.rating}
                    </span>

                    <span>
                      🕒 {restaurant.deliveryTime}
                    </span>

                  </div>

                </div>


                <div className="restaurant-card-actions">

                  <button
                    className="restaurant-edit-btn"
                    onClick={() =>
                      editRestaurant(restaurant)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="restaurant-delete-btn"
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

      </section>


      {/* SECURITY NOTE */}
      <div className="restaurant-admin-note">

        <span>🔐</span>

        <div>
          <strong>Protected Admin Area</strong>

          <p>
            Only authorized Foodie administrators can
            add, edit or delete restaurants.
          </p>
        </div>

      </div>

    </div>
  );
}

export default AdminRestaurants;