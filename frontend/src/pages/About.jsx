import { Link } from "react-router-dom";
import "../App.css";

function About() {
  return (
    <div className="about-page">

      <div className="about-hero">
        <h1>About Foodie 🍔</h1>

        <p>
          Delicious food delivered straight to your doorstep.
        </p>
      </div>

      <div className="about-container">

        <div className="about-section">
          <h2>Who We Are</h2>

          <p>
            Foodie is an online food ordering platform created to
            make ordering your favorite meals simple, fast and
            convenient.
          </p>

          <p>
            Browse restaurants, choose your favorite dishes,
            add them to your cart and place your order in just
            a few clicks.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Foodie?</h2>

          <div className="about-features">

            <div className="about-feature">
              <span>🍕</span>
              <h3>Delicious Food</h3>
              <p>
                Discover tasty meals from different restaurants.
              </p>
            </div>

            <div className="about-feature">
              <span>⚡</span>
              <h3>Fast Delivery</h3>
              <p>
                Get your favorite food delivered quickly.
              </p>
            </div>

            <div className="about-feature">
              <span>💰</span>
              <h3>Affordable Prices</h3>
              <p>
                Enjoy great food at reasonable prices.
              </p>
            </div>

          </div>
        </div>

        <div className="about-cta">

          <h2>Ready to Order?</h2>

          <p>
            Explore our menu and order something delicious today!
          </p>

          <Link to="/menu">
            <button className="browse-menu-btn">
              Explore Menu
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default About;