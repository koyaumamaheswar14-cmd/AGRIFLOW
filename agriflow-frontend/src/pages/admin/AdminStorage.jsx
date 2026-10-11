import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminStorage() {
  const navigate = useNavigate();

  const [storage, setStorage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStorage();
  }, []);

  const loadStorage = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/storage");

      setStorage(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("ADMIN STORAGE ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load storage facilities."
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
            className="admin-nav-item active"
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
            <h1>Storage Facilities</h1>

            <p>
              Monitor storage facilities registered
              on DigitalKisan.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadStorage}
          >
            ↻ Refresh
          </button>

        </header>

        {loading && (
          <div className="admin-loading">
            Loading storage facilities...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          storage.length === 0 && (
            <div className="admin-section empty-state">

              <div>🏢</div>

              <h3>
                No Storage Facilities Found
              </h3>

              <p>
                No storage facilities have been
                registered yet.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          storage.length > 0 && (
            <section className="admin-section">

              <div className="admin-section-heading">

                <div>
                  <h2>
                    Registered Storage Facilities
                  </h2>

                  <p>
                    {storage.length} storage facilit
                    {storage.length !== 1
                      ? "ies"
                      : "y"}{" "}
                    registered.
                  </p>
                </div>

              </div>

              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Facility</th>
                      <th>Storage Type</th>
                      <th>Capacity</th>
                      <th>Storage Cost</th>
                      <th>Location</th>
                      <th>Phone</th>
                      <th>Availability</th>
                    </tr>
                  </thead>

                  <tbody>

                    {storage.map((item) => (

                      <tr key={item.id}>

                        <td>
                          #{item.id}
                        </td>

                        <td>
                          <strong>
                            {item.storageName || "-"}
                          </strong>

                          <small className="admin-subtext">
                            User #{item.userId}
                          </small>
                        </td>

                        <td>
                          {item.storageType || "-"}
                        </td>

                        <td>
                          {formatNumber(
                            item.storageCapacity
                          )}{" "}
                          {item.capacityUnit || ""}
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.storageCost || 0
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}

                          {item.costUnit && (
                            <small className="admin-subtext">
                              /{" "}
                              {item.costUnit
                                .replaceAll("_", " ")
                                .toLowerCase()}
                            </small>
                          )}
                        </td>

                        <td>
                          <div>
                            {item.district || "-"}
                          </div>

                          <small className="admin-subtext">
                            {item.state || ""}
                          </small>
                        </td>

                        <td>
                          {item.phone || "-"}
                        </td>

                        <td>
                          <span
                            className={`admin-availability ${
                              item.availability ===
                              "AVAILABLE"
                                ? "admin-available"
                                : "admin-unavailable"
                            }`}
                          >
                            {item.availability ||
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

export default AdminStorage;