import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminBuyers() {
  const navigate = useNavigate();

  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/buyers");

      setBuyers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("ADMIN BUYERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load buyers."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityClass = (availability) => {
    return availability === "AVAILABLE"
      ? "admin-available"
      : "admin-unavailable";
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-icon">
            🌱
          </div>

          <div>
            <h2>DigitalKisan</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-navigation">

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin")}
          >
            <span className="admin-nav-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/farmers")}
          >
            <span className="admin-nav-icon">👨‍🌾</span>
            <span>Farmers</span>
          </button>

          <button
            className="admin-nav-item active"
            onClick={() => navigate("/admin/buyers")}
          >
            <span className="admin-nav-icon">🛒</span>
            <span>Buyers</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/processors")}
          >
            <span className="admin-nav-icon">🏭</span>
            <span>Processors</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/storage")}
          >
            <span className="admin-nav-icon">🏢</span>
            <span>Storage</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/produce")}
          >
            <span className="admin-nav-icon">🌾</span>
            <span>Produce</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/soil-tests")}
          >
            <span className="admin-nav-icon">🧪</span>
            <span>Soil Tests</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/allocations")}
          >
            <span className="admin-nav-icon">📋</span>
            <span>Allocations</span>
          </button>

        </nav>

      </aside>

      {/* MAIN CONTENT */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>Buyers</h1>

            <p>
              Monitor buyer requirements registered
              on DigitalKisan.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadBuyers}
          >
            ↻ Refresh
          </button>

        </header>

        {loading && (
          <div className="admin-loading">
            Loading buyers...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          buyers.length === 0 && (
            <div className="admin-section empty-state">

              <div>🛒</div>

              <h3>No Buyers Found</h3>

              <p>
                No buyer requirements have been
                registered yet.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          buyers.length > 0 && (
            <section className="admin-section">

              <div className="admin-section-heading">

                <div>
                  <h2>
                    Buyer Requirements
                  </h2>

                  <p>
                    {buyers.length} requirement
                    {buyers.length !== 1
                      ? "s"
                      : ""}{" "}
                    registered.
                  </p>
                </div>

              </div>

              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Buyer</th>
                      <th>Crop</th>
                      <th>Quantity</th>
                      <th>Grade</th>
                      <th>Offered Price</th>
                      <th>Location</th>
                      <th>Availability</th>
                    </tr>
                  </thead>

                  <tbody>

                    {buyers.map((buyer) => (
                      <tr key={buyer.id}>

                        <td>
                          #{buyer.id}
                        </td>

                        <td>
                          <strong>
                            {buyer.buyerName || "-"}
                          </strong>

                          <small className="admin-subtext">
                            User #{buyer.userId}
                          </small>
                        </td>

                        <td>
                          {buyer.cropName || "-"}
                        </td>

                        <td>
                          {Number(
                            buyer.requiredQuantity || 0
                          ).toLocaleString("en-IN")}{" "}
                          {buyer.unit || ""}
                        </td>

                        <td>
                          {buyer.requiredGrade
                            ? `Grade ${buyer.requiredGrade}`
                            : "-"}
                        </td>

                        <td>
                          ₹
                          {Number(
                            buyer.offeredPrice || 0
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td>
                          <div>
                            {buyer.district || "-"}
                          </div>

                          <small className="admin-subtext">
                            {buyer.state || ""}
                          </small>
                        </td>

                        <td>
                          <span
                            className={`admin-availability ${getAvailabilityClass(
                              buyer.availability
                            )}`}
                          >
                            {buyer.availability ||
                              "UNKNOWN"}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </section>
          )}

      </main>

    </div>
  );
}

export default AdminBuyers;