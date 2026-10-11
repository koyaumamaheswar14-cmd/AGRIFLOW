import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function BuyerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const buyerId = user.userId;

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequirements();
  }, []);

  // =========================
  // LOAD BUYER REQUIREMENTS
  // =========================
  const loadRequirements = async () => {
    if (!buyerId) {
      setError("Buyer information not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/buyers/user/${buyerId}`
      );

      console.log("BUYER REQUIREMENTS:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setRequirements(data);
    } catch (err) {
      console.error("BUYER DASHBOARD ERROR:", err);
      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to load buyer requirements."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // STATISTICS
  // =========================
  const availableRequirements = requirements.filter(
    (item) => item.availability === "AVAILABLE"
  );

  const cropCount = new Set(
    requirements
      .map((item) => item.cropName)
      .filter(Boolean)
  ).size;

  const activeBuying =
    availableRequirements.length > 0;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="buyer-dashboard">
        <div className="dashboard-container">
          <p className="loading">
            Loading buyer dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-dashboard">

      {/* =========================
          NAVBAR
          ========================= */}
      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          🛒 <span>DigitalKisan</span>
        </div>

        <div className="navbar-right">

          <span className="welcome-user">
            👤 {user.name || "Buyer"}
          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>

      <main className="dashboard-container">

        {/* =========================
            WELCOME SECTION
            ========================= */}
        <section className="welcome-section">

          <div>
            <h1>
              Welcome, {user.name || "Buyer"}! 👋
            </h1>

            <p>
              Manage your produce requirements and connect
              with farmers.
            </p>
          </div>

          <button
            className="primary-action"
            onClick={() =>
              navigate("/buyer/post-requirement")
            }
          >
            + Post Requirement
          </button>

        </section>

        {/* =========================
            ERROR
            ========================= */}
        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* =========================
            STATISTICS
            ========================= */}
        <section className="stats-grid">

          {/* My Requirements */}
          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>
              <span>
                My Requirements
              </span>

              <strong>
                {requirements.length}
              </strong>
            </div>

          </div>

          {/* Available Requirements */}
          <div className="stat-card">

            <div className="stat-icon">
              🟢
            </div>

            <div>
              <span>
                Available Requirements
              </span>

              <strong>
                {availableRequirements.length}
              </strong>
            </div>

          </div>

          {/* Crop Requirements */}
          <div className="stat-card">

            <div className="stat-icon">
              🌾
            </div>

            <div>
              <span>
                Crop Requirements
              </span>

              <strong>
                {cropCount}
              </strong>
            </div>

          </div>

          {/* Active Buying */}
          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>
              <span>
                Active Buying
              </span>

              <strong>
                {activeBuying ? "YES" : "NO"}
              </strong>
            </div>

          </div>

        </section>

        {/* =========================
            QUICK ACTIONS
            ========================= */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your buying activities.
              </p>
            </div>

          </div>

          <div className="quick-actions">

            {/* Post Requirement */}
            <button
              onClick={() =>
                navigate("/buyer/post-requirement")
              }
            >
              📝
              <span>
                Post Requirement
              </span>
            </button>

            {/* My Requirements */}
            <button
              onClick={() => {
                document
                  .getElementById("my-requirements")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              📋
              <span>
                My Requirements
              </span>
            </button>

            {/* Available Produce */}
            <button
              onClick={() =>
                navigate("/buyer/produce")
              }
            >
              🌾
              <span>
                Available Produce
              </span>
            </button>

          </div>

        </section>

        {/* =========================
            MY REQUIREMENTS
            ========================= */}
        <section
          className="dashboard-section"
          id="my-requirements"
        >

          <div className="section-header">

            <div>
              <h2>
                My Buying Requirements
              </h2>

              <p>
                Your recently posted produce
                requirements.
              </p>
            </div>

            <button
              className="view-button"
              onClick={() => {
                document
                  .getElementById("my-requirements")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              View All →
            </button>

          </div>

          {/* No Requirements */}
          {requirements.length === 0 ? (

            <div className="empty-state">

              <h3>
                No requirements posted yet
              </h3>

              <p>
                Post a requirement to let farmers
                know what produce you need.
              </p>

              <button
                className="primary-action"
                onClick={() =>
                  navigate("/buyer/post-requirement")
                }
              >
                + Post Requirement
              </button>

            </div>

          ) : (

            <div className="buyer-requirements-table">

              {/* Table Header */}
              <div className="table-header">

                <span>
                  Crop
                </span>

                <span>
                  Quantity
                </span>

                <span>
                  Grade
                </span>

                <span>
                  Price
                </span>

                <span>
                  Status
                </span>

              </div>

              {/* Requirements */}
              {requirements
                .slice(0, 5)
                .map((item) => (

                  <div
                    className="table-row"
                    key={item.id}
                  >

                    <span>
                      🌾 {item.cropName}
                    </span>

                    <span>
                      {Number(
                        item.requiredQuantity || 0
                      ).toLocaleString()}{" "}
                      {item.unit}
                    </span>

                    <span>
                      Grade {item.requiredGrade}
                    </span>

                    <span>
                      ₹
                      {Number(
                        item.offeredPrice || 0
                      ).toLocaleString()}
                    </span>

                    <span>

                      <span
                        className={
                          item.availability ===
                          "AVAILABLE"
                            ? "status-badge available"
                            : "status-badge"
                        }
                      >
                        {item.availability ||
                          "UNAVAILABLE"}
                      </span>

                    </span>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* =========================
            FIND FRESH PRODUCE
            ========================= */}
        <section className="allocation-banner">

          <div>

            <h2>
              🌾 Find Fresh Produce
            </h2>

            <p>
              Discover produce registered by farmers
              that matches your requirements.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/buyer/produce")
            }
          >
            Browse Produce →
          </button>

        </section>

      </main>

    </div>
  );
}

export default BuyerDashboard;