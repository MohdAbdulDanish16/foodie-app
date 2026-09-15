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

      setRestaurants(restaurantData.restaurants || []);

      const menuResponse = await fetch(
        `${API_URL}/api/menu`
      );

      const menuData = await menuResponse.json();

      if (!menuResponse.ok) {
        alert(`❌ ${menuData.message}`);
        return;
      }

      setMenuItems(menuData.menuItems || []);
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
      restaurantId:
        item.restaurantId?._id ||
        item.restaurantId ||
        "",
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
        <div className="admin-dashboard-loading">
          <div className="admin-loading-spinner"></div>

          <h2>Loading menu...</h2>

          <p>
            Please wait while we fetch your menu items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-menu-page">

      {/* HEADER */}
      <div className="admin-menu-header">

        <Link
          to="/admin"
          className="admin-menu-back"
        >
          ← Back to Dashboard
        </Link>

        <div className="admin-menu-heading">

          <span>FOODIE ADMIN PANEL</span>

          <h1>Menu Management</h1>

          <p>
            Add, edit and manage food items across
            your restaurants.
          </p>

        </div>

      </div>


      {/* TOOLBAR */}
      <div className="admin-menu-toolbar">

        <div className="admin-menu-count">

          <strong>
            {menuItems.length}
          </strong>

          <span>
            Menu Item
            {menuItems.length !== 1 ? "s" : ""}
          </span>

        </div>

        <button
          className="menu-add-btn"
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
            : "＋ Add Menu Item"}
        </button>

      </div>


      {/* FORM */}
      {showForm && (

        <section className="admin-menu-form-card">

          <div className="admin-menu-form-header">

            <div>

              <span>
                {editingId
                  ? "EDIT MENU ITEM"
                  : "NEW MENU ITEM"}
              </span>

              <h2>
                {editingId
                  ? "Edit Menu Item"
                  : "Add New Menu Item"}
              </h2>

            </div>

            {editingId && (
              <span className="menu-editing-badge">
                Editing
              </span>
            )}

          </div>


          <form
            className="menu-premium-form"
            onSubmit={handleSubmit}
          >

            <div className="menu-form-grid">

              <div className="menu-form-group">

                <label>Restaurant</label>

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

              </div>


              <div className="menu-form-group">

                <label>Food Item Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Margherita Pizza"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="menu-form-group">

                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  placeholder="Example: 299"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="menu-form-group">

                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  placeholder="Example: Pizza"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="menu-form-group">

              <label>Description</label>

              <textarea
                name="description"
                placeholder="Write a short description of the food..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />

            </div>


            <div className="menu-form-group">

              <label>Food Image URL</label>

              <input
                type="text"
                name="image"
                placeholder="https://example.com/food.jpg"
                value={formData.image}
                onChange={handleChange}
              />

            </div>


            <label className="menu-availability-toggle">

              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />

              <span>
                Item is available
              </span>

            </label>


            <div className="menu-form-actions">

              <button
                type="submit"
                className="menu-save-btn"
              >
                {editingId
                  ? "💾 Update Menu Item"
                  : "✓ Save Menu Item"}
              </button>

              {editingId && (

                <button
                  type="button"
                  className="menu-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>

              )}

            </div>

          </form>

        </section>

      )}


      {/* MENU LIST */}
      <section className="admin-menu-list-section">

        <div className="admin-menu-list-header">

          <div>

            <span>YOUR MENU</span>

            <h2>Menu Items</h2>

          </div>

          <p>
            {menuItems.length} total
          </p>

        </div>


        {menuItems.length === 0 ? (

          <div className="menu-empty-state">

            <div>🍔</div>

            <h3>No menu items yet</h3>

            <p>
              Add your first food item to get started.
            </p>

          </div>

        ) : (

          <div className="menu-premium-list">

            {menuItems.map((item) => (

              <div
                className="menu-premium-card"
                key={item._id}
              >

                <div className="menu-card-image">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  ) : (

                    <span>🍔</span>

                  )}

                </div>


                <div className="menu-card-info">

                  <div className="menu-card-title-row">

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <p className="menu-card-restaurant">
                        🏪{" "}
                        {item.restaurantId?.name ||
                          "Restaurant"}
                      </p>

                    </div>

                    <span
                      className={
                        item.isAvailable
                          ? "menu-available-badge"
                          : "menu-unavailable-badge"
                      }
                    >
                      {item.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>


                  <div className="menu-card-price-row">

                    <strong>
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                    </strong>

                    <span>
                      {item.category}
                    </span>

                  </div>


                  <p className="menu-card-description">
                    {item.description ||
                      "No description added"}
                  </p>

                </div>


                <div className="menu-card-actions">

                  <button
                    className="menu-edit-btn"
                    onClick={() =>
                      editMenuItem(item)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="menu-toggle-btn"
                    onClick={() =>
                      toggleAvailability(item)
                    }
                  >
                    {item.isAvailable
                      ? "Disable"
                      : "Enable"}
                  </button>

                  <button
                    className="menu-delete-btn"
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

      </section>


      {/* SECURITY NOTE */}
      <div className="menu-admin-note">

        <span>🔐</span>

        <div>

          <strong>
            Protected Admin Area
          </strong>

          <p>
            Only authorized Foodie administrators
            can manage menu items.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AdminMenu;