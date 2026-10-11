import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminFarmers() {
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/farmers");

      setFarmers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("ADMIN FARMERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load farmers."
      );
    } finally {
      setLoading(false);
    }
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
            className="admin-nav-item active"
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

      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>Farmers</h1>

            <p>
              View registered farmers on DigitalKisan.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadFarmers}
          >
            ↻ Refresh
          </button>

        </header>

        {loading && (
          <div className="admin-loading">
            Loading farmers...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          farmers.length === 0 && (
            <div className="admin-section empty-state">
              <div>👨‍🌾</div>

              <h3>No Farmers Found</h3>

              <p>
                No farmer profiles have been
                registered yet.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          farmers.length > 0 && (
            <section className="admin-section">

              <div className="admin-section-heading">

                <div>
                  <h2>
                    Registered Farmers
                  </h2>

                  <p>
                    {farmers.length} farmer
                    {farmers.length !== 1
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
                      <th>User ID</th>
                      <th>Phone</th>
                      <th>Village</th>
                      <th>District</th>
                      <th>State</th>
                      <th>Location</th>
                    </tr>
                  </thead>

                  <tbody>

                    {farmers.map((farmer) => (
                      <tr key={farmer.id}>

                        <td>
                          #{farmer.id}
                        </td>

                        <td>
                          #{farmer.userId}
                        </td>

                        <td>
                          {farmer.phone || "-"}
                        </td>

                        <td>
                          {farmer.village || "-"}
                        </td>

                        <td>
                          {farmer.district || "-"}
                        </td>

                        <td>
                          {farmer.state || "-"}
                        </td>

                        <td>
                          {farmer.latitude &&
                          farmer.longitude
                            ? `${farmer.latitude}, ${farmer.longitude}`
                            : "-"}
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

export default AdminFarmers;