import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminProcessors() {
  const navigate = useNavigate();

  const [processors, setProcessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProcessors();
  }, []);

  const loadProcessors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/processors");

      setProcessors(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("ADMIN PROCESSORS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load processors."
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
          <div className="admin-brand-icon">🌱</div>

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
            className="admin-nav-item active"
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
            <h1>Processors</h1>

            <p>
              Monitor processing facilities registered
              on DigitalKisan.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadProcessors}
          >
            ↻ Refresh
          </button>

        </header>

        {loading && (
          <div className="admin-loading">
            Loading processors...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          processors.length === 0 && (
            <div className="admin-section empty-state">
              <div>🏭</div>

              <h3>No Processors Found</h3>

              <p>
                No processing facilities have been
                registered yet.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          processors.length > 0 && (
            <section className="admin-section">

              <div className="admin-section-heading">

                <div>
                  <h2>
                    Registered Processors
                  </h2>

                  <p>
                    {processors.length} processing
                    facilit
                    {processors.length !== 1
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
                      <th>Processor</th>
                      <th>Processing Type</th>
                      <th>Supported Crops</th>
                      <th>Capacity</th>
                      <th>Processing Cost</th>
                      <th>Product Price</th>
                      <th>Location</th>
                      <th>Availability</th>
                    </tr>
                  </thead>

                  <tbody>

                    {processors.map((processor) => (

                      <tr key={processor.id}>

                        <td>
                          #{processor.id}
                        </td>

                        <td>
                          <strong>
                            {processor.processorName || "-"}
                          </strong>

                          <small className="admin-subtext">
                            User #{processor.userId}
                          </small>
                        </td>

                        <td>
                          {processor.processingType || "-"}
                        </td>

                        <td>
                          {processor.supportedCrops || "-"}
                        </td>

                        <td>
                          {Number(
                            processor.processingCapacity || 0
                          ).toLocaleString("en-IN")}{" "}
                          {processor.capacityUnit || ""}
                        </td>

                        <td>
                          ₹
                          {Number(
                            processor.processingCost || 0
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          {processor.costUnit
                            ? ` / ${processor.costUnit
                                .replace("_", " ")
                                .toLowerCase()}`
                            : ""}
                        </td>

                        <td>
                          ₹
                          {Number(
                            processor.processedProductPrice || 0
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td>
                          <div>
                            {processor.district || "-"}
                          </div>

                          <small className="admin-subtext">
                            {processor.state || ""}
                          </small>
                        </td>

                        <td>
                          <span
                            className={`admin-availability ${
                              processor.availability ===
                              "AVAILABLE"
                                ? "admin-available"
                                : "admin-unavailable"
                            }`}
                          >
                            {processor.availability ||
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

export default AdminProcessors;