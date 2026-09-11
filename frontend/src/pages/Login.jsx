import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      localStorage.setItem("foodieLoggedIn", "true");

      localStorage.setItem(
        "foodieToken",
        data.token
      );

      localStorage.setItem(
        "foodieCurrentUser",
        JSON.stringify(data.user)
      );

      alert("✅ Login successful!");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍴</div>

        <h1>Welcome Back!</h1>

        <p>Login to your Foodie account</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="login-submit-btn"
          >
            Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>

        <Link to="/">
          <button className="back-home-btn">
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;