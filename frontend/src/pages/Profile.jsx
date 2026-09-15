import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("foodieCurrentUser")
  );

  const isLoggedIn =
    localStorage.getItem("foodieLoggedIn") === "true";

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <div className="profile-empty-icon">👤</div>

          <h1>Please Login</h1>

          <p>
            Login to view your Foodie profile.
          </p>

          <Link
            to="/login"
            className="profile-login-btn"
          >
            Login →
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("foodieLoggedIn");
    localStorage.removeItem("foodieToken");
    localStorage.removeItem("foodieCurrentUser");

    alert("👋 Logged out successfully!");

    navigate("/");
  };

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">

        <Link
          to="/"
          className="profile-back-link"
        >
          ← Back to Home
        </Link>

        <div className="profile-heading">
          <span>ACCOUNT</span>

          <h1>My Profile</h1>

          <p>
            Manage your Foodie account and personal details.
          </p>
        </div>

      </div>

      {/* Profile Content */}
      <div className="profile-container">

        {/* Profile Card */}
        <section className="profile-main-card">

          <div className="profile-avatar">
            {currentUser.name
              ? currentUser.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="profile-main-info">

            <span className="profile-label">
              WELCOME TO FOODIE
            </span>

            <h2>
              {currentUser.name || "Foodie User"}
            </h2>

            <p>
              {currentUser.email || "No email available"}
            </p>

          </div>

          <div className="profile-account-badge">
            {currentUser.role === "admin"
              ? "👨‍💼 Admin"
              : "👤 Customer"}
          </div>

        </section>

        {/* Account Details */}
        <section className="profile-details-card">

          <div className="profile-section-heading">

            <div className="profile-section-number">
              01
            </div>

            <div>
              <span>PERSONAL INFORMATION</span>

              <h2>
                Account Details
              </h2>
            </div>

          </div>

          <div className="profile-details-grid">

            <div className="profile-detail-box">

              <span>FULL NAME</span>

              <strong>
                {currentUser.name || "Not available"}
              </strong>

            </div>

            <div className="profile-detail-box">

              <span>EMAIL ADDRESS</span>

              <strong>
                {currentUser.email || "Not available"}
              </strong>

            </div>

            <div className="profile-detail-box">

              <span>ACCOUNT TYPE</span>

              <strong>
                {currentUser.role === "admin"
                  ? "Administrator"
                  : "Customer"}
              </strong>

            </div>

            <div className="profile-detail-box">

              <span>ACCOUNT STATUS</span>

              <strong className="profile-status">
                ● Active
              </strong>

            </div>

          </div>

        </section>

        {/* Quick Actions */}
        <section className="profile-actions-card">

          <div className="profile-section-heading">

            <div className="profile-section-number">
              02
            </div>

            <div>
              <span>QUICK ACCESS</span>

              <h2>
                Account Actions
              </h2>
            </div>

          </div>

          <div className="profile-action-grid">

            <Link
              to="/my-orders"
              className="profile-action-card"
            >
              <div className="profile-action-icon">
                📦
              </div>

              <div>
                <strong>
                  My Orders
                </strong>

                <span>
                  Track your food orders
                </span>
              </div>

              <b>→</b>
            </Link>

            {currentUser.role === "admin" && (
              <Link
                to="/admin"
                className="profile-action-card"
              >
                <div className="profile-action-icon">
                  👨‍💼
                </div>

                <div>
                  <strong>
                    Admin Dashboard
                  </strong>

                  <span>
                    Manage your Foodie app
                  </span>
                </div>

                <b>→</b>
              </Link>
            )}

            <Link
              to="/menu"
              className="profile-action-card"
            >
              <div className="profile-action-icon">
                🍔
              </div>

              <div>
                <strong>
                  Browse Menu
                </strong>

                <span>
                  Discover delicious food
                </span>
              </div>

              <b>→</b>
            </Link>

          </div>

        </section>

        {/* Logout */}
        <section className="profile-logout-card">

          <div>
            <span>
              🔐 ACCOUNT SECURITY
            </span>

            <h3>
              Ready to leave?
            </h3>

            <p>
              You can safely log out of your Foodie account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="profile-logout-btn"
          >
            Logout
          </button>

        </section>

      </div>

      {/* Footer */}
      <footer className="profile-footer">

        <strong>
          🍴 Foodie
        </strong>

        <span>
          Good food. Good mood. ❤️
        </span>

      </footer>

    </div>
  );
}

export default Profile;