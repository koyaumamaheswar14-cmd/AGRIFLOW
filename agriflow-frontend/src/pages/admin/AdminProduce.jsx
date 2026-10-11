import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminProduce() {
  const navigate = useNavigate();

  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduce();
  }, []);

  const loadProduce = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/produce");

      setProduce(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("ADMIN PRODUCE ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load produce."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

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
            className="admin-nav-item"
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
            className="admin-nav-item active"
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
            <h1>Produce</h1>

            <p>
              Monitor produce registered by farmers
              on DigitalKisan.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadProduce}
          >
            ↻ Refresh
          </button>

        </header>

        {loading && (
          <div className="admin-loading">
            Loading produce...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          produce.length === 0 && (
            <div className="admin-section empty-state">

              <div>🌾</div>

              <h3>No Produce Found</h3>

              <p>
                No produce has been registered by
                farmers yet.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          produce.length > 0 && (
            <section className="admin-section">

              <div className="admin-section-heading">

                <div>
                  <h2>
                    Registered Produce
                  </h2>

                  <p>
                    {produce.length} produce record
                    {produce.length !== 1
                      ? "s"
                      : ""}{" "}
                    found.
                  </p>
                </div>

              </div>

              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Crop</th>
                      <th>Quantity</th>
                      <th>Grade</th>
                      <th>Harvest Date</th>
                      <th>Farmer ID</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {produce.map((item) => (

                      <tr key={item.id}>

                        <td>
                          #{item.id}
                        </td>

                        <td>
                          <strong>
                            {item.cropName || "-"}
                          </strong>
                        </td>

                        <td>
                          {formatNumber(item.quantity)}{" "}
                          {item.unit || ""}
                        </td>

                        <td>
                          {item.grade
                            ? `Grade ${item.grade}`
                            : "-"}
                        </td>

                        <td>
                          {item.harvestDate || "-"}
                        </td>

                        <td>
                          #{item.farmerId || "-"}
                        </td>

                        <td>
                          {item.latitude &&
                          item.longitude ? (
                            <>
                              <div>
                                {item.latitude}
                              </div>

                              <small className="admin-subtext">
                                {item.longitude}
                              </small>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          <span
                            className={`admin-availability ${
                              item.status === "AVAILABLE"
                                ? "admin-available"
                                : "admin-unavailable"
                            }`}
                          >
                            {item.status || "UNKNOWN"}
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

export default AdminProduce;