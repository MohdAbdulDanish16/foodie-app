import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminMenu() {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    restaurantId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
  });

  const fetchData = async () => {
    const token = localStorage.getItem("foodieToken");

    try {
      const restaurantResponse = await fetch(
        `${API_URL}/api/restaurants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const restaurantData =
        await restaurantResponse.json();

      if (!restaurantResponse.ok) {
        alert(`❌ ${restaurantData.message}`);
        return;
      }

      setRestaurants(restaurantData.restaurants);

      const menuResponse = await fetch(
        `${API_URL}/api/menu`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const menuData = await menuResponse.json();

      if (!menuResponse.ok) {
        alert(`❌ ${menuData.message}`);
        return;
      }

      setMenuItems(menuData.menuItems);
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      restaurantId: "",
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      isAvailable: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("foodieToken");

    try {
      const url = editingId
        ? `${API_URL}/api/menu/${editingId}`
        : `${API_URL}/api/menu`;

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      alert(
        editingId
          ? "✅ Menu item updated successfully!"
          : "✅ Menu item added successfully!"
      );

      resetForm();
      fetchData();
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  const editMenuItem = (item) => {
    setEditingId(item._id);

    setFormData({
      restaurantId: item.restaurantId?._id || item.restaurantId || "",
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "",
      image: item.image || "",
      isAvailable: item.isAvailable ?? true,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteMenuItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("foodieToken");

    try {
      const response = await fetch(
        `${API_URL}/api/menu/${id}`,
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

      alert("✅ Menu item deleted successfully!");

      fetchData();
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  const toggleAvailability = async (item) => {
    const token = localStorage.getItem("foodieToken");

    try {
      const response = await fetch(
        `${API_URL}/api/menu/${item._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isAvailable: !item.isAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      fetchData();
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <h2>Loading menu...</h2>
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

        <h1>🍔 Menu Management</h1>

        <p>
          Add and manage food items for your restaurants
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
            : "➕ Add Menu Item"}
        </button>
      </div>

      {showForm && (
        <div className="admin-recent-orders">
          <div className="admin-section-header">
            <h2>
              {editingId
                ? "✏️ Edit Menu Item"
                : "➕ Add New Menu Item"}
            </h2>
          </div>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >
            <select
              name="restaurantId"
              value={formData.restaurantId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Restaurant
              </option>

              {restaurants.map((restaurant) => (
                <option
                  key={restaurant._id}
                  value={restaurant._id}
                >
                  {restaurant.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="name"
              placeholder="Food Item Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Food Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Food Image URL"
              value={formData.image}
              onChange={handleChange}
            />

            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />

              {" "}Available
            </label>

            <button
              type="submit"
              className="admin-dashboard-btn"
            >
              {editingId
                ? "💾 Update Menu Item"
                : "✅ Save Menu Item"}
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
          <h2>🍽️ Menu Items</h2>

          <strong>
            {menuItems.length} Item
            {menuItems.length !== 1 ? "s" : ""}
          </strong>
        </div>

        {menuItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              🍔
            </div>

            <h2>No menu items yet</h2>

            <p>
              Add your first menu item using the button above.
            </p>
          </div>
        ) : (
          <div className="recent-orders-list">
            {menuItems.map((item) => (
              <div
                className="recent-order-card"
                key={item._id}
              >
                <div>
                  <h3>{item.name}</h3>

                  <p>
                    🏪{" "}
                    {item.restaurantId?.name ||
                      "Restaurant"}
                  </p>

                  <p>
                    {item.category}
                    {" • "}
                    ₹{item.price}
                  </p>

                  <p>
                    {item.description ||
                      "No description added"}
                  </p>
                </div>

                <div>
                  <span className="recent-order-status">
                    {item.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>

                  <br />

                  <button
                    className="admin-dashboard-btn"
                    onClick={() =>
                      editMenuItem(item)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <br />

                  <button
                    className="admin-dashboard-btn"
                    onClick={() =>
                      toggleAvailability(item)
                    }
                  >
                    {item.isAvailable
                      ? "❌ Disable"
                      : "✅ Enable"}
                  </button>

                  <br />

                  <button
                    className="admin-delete-btn"
                    onClick={() =>
                      deleteMenuItem(item._id)
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

export default AdminMenu;