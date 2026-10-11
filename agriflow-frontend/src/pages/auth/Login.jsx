import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const data = response.data;

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user information
      const user = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log("USER:", user);

      // Redirect according to role
      switch (data.role) {

        case "FARMER":
          navigate("/farmer");
          break;

        case "BUYER":
          navigate("/buyer");
          break;

        case "PROCESSOR":
          navigate("/processor");
          break;

        case "STORAGE":
          navigate("/storage");
          break;

        case "ADMIN":
          navigate("/admin");
          break;

        default:
          navigate("/");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;

      setError(
        backendMessage ||
        "Invalid email or password"
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

        <h2>Welcome Back</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
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
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?{" "}

          <span
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;