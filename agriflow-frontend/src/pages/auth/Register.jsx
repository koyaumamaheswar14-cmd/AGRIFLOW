import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post(
        "/api/auth/register",
        formData
      );

      console.log("REGISTER RESPONSE:", response.data);

      const data = response.data;

      // Registration automatically returns JWT
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      setMessage(
        "Registration successful! Redirecting..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("REGISTER ERROR:", err);

      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;

      setError(
        backendMessage ||
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🌾
        </div>

        <h1>TechFarm</h1>

        <p className="subtitle">
          Smart Agriculture & Post-Harvest Platform
        </p>

        <h2>Create Account</h2>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <label>Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            maxLength={100}
            required
          />

          <label>Account Type</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="FARMER">
              Farmer / Producer
            </option>

            <option value="BUYER">
              Buyer
            </option>

            <option value="PROCESSOR">
              Processor
            </option>

            <option value="STORAGE">
              Storage Provider
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="register-text">
          Already have an account?{" "}

          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;