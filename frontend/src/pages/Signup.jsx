import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
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

      alert("✅ Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("❌ Cannot connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍴</div>

        <h1>Create Account</h1>

        <p>Sign up for your Foodie account</p>

        <form onSubmit={handleSignup}>
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="login-submit-btn"
          >
            Sign Up
          </button>
        </form>

        <p className="signup-text">
          Already have an account?
          <Link to="/login"> Login</Link>
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

export default Signup;