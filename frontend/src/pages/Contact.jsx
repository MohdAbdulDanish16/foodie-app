import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("✅ Thank you! Your message has been sent.");

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="contact-page">

      <div className="contact-hero">
        <h1>Contact Us 📞</h1>
        <p>
          Have a question? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-container">

        <div className="contact-info">

          <h2>Get in Touch</h2>

          <div className="contact-item">
            <span>📧</span>
            <div>
              <h3>Email</h3>
              <p>support@foodie.com</p>
            </div>
          </div>

          <div className="contact-item">
            <span>📱</span>
            <div>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-item">
            <span>📍</span>
            <div>
              <h3>Location</h3>
              <p>Hyderabad, India</p>
            </div>
          </div>

        </div>

        <div className="contact-form">

          <h2>Send Us a Message</h2>

          <form onSubmit={handleSubmit}>

            <label>Your Name</label>

            <input
              type="text"
              placeholder="Enter your name"
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

            <label>Message</label>

            <textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <button
              type="submit"
              className="contact-submit-btn"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

      <div className="contact-back">
        <Link to="/">
          <button className="back-btn">
            ← Back to Home
          </button>
        </Link>
      </div>

    </div>
  );
}

export default Contact;