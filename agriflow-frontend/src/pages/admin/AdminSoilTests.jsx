import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminSoilTests() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/soil");

      setTests(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("ADMIN SOIL TEST ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load soil tests."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "COMPLETED") {
      return "soil-status-completed";
    }

    if (status === "PROCESSING") {
      return "soil-status-processing";
    }

    if (status === "SAMPLE_COLLECTED") {
      return "soil-status-collected";
    }

    return "soil-status-requested";
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
            className="admin-nav-item active"
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
            <h1>Soil Tests</h1>

            <p>
              Monitor soil-testing requests and
              their current status.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadTests}
          >
            ↻ Refresh
          </button>

        </header>

        {loading && (
          <div className="admin-loading">
            Loading soil tests...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          tests.length === 0 && (
            <div className="admin-section empty-state">

              <div>🧪</div>

              <h3>No Soil Tests Found</h3>

              <p>
                No soil-testing requests have been
                registered yet.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          tests.length > 0 && (
            <section className="admin-section">

              <div className="admin-section-heading">

                <div>
                  <h2>
                    Soil Test Records
                  </h2>

                  <p>
                    {tests.length} soil test
                    {tests.length !== 1
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
                      <th>Farmer ID</th>
                      <th>Sample ID</th>
                      <th>Field Location</th>
                      <th>Village</th>
                      <th>District</th>
                      <th>Sample Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {tests.map((test) => (

                      <tr key={test.id}>

                        <td>
                          #{test.id}
                        </td>

                        <td>
                          #{test.farmerId || "-"}
                        </td>

                        <td>
                          {test.sampleId || "-"}
                        </td>

                        <td>
                          {test.fieldLocation || "-"}
                        </td>

                        <td>
                          {test.village || "-"}
                        </td>

                        <td>
                          {test.district || "-"}
                        </td>

                        <td>
                          {test.sampleDate || "-"}
                        </td>

                        <td>
                          <span
                            className={`admin-availability ${getStatusClass(
                              test.status
                            )}`}
                          >
                            {test.status || "UNKNOWN"}
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
s
    </div>
  );
}

export default AdminSoilTests;