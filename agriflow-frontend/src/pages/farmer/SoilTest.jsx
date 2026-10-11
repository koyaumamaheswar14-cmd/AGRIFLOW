import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function SoilTest() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const farmerId = user.userId;

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    farmerId: farmerId || "",
    fieldLocation: "",
    village: "",
    district: "",
    state: "",
    sampleDate: "",
  });

  useEffect(() => {
    loadSoilTests();
  }, []);

  const loadSoilTests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/soil/farmer/${farmerId}`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setTests(data);
    } catch (err) {
      console.error("SOIL TEST LOAD ERROR:", err);
      console.error("BACKEND RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Unable to load soil tests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const requestSoilTest = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        farmerId: Number(farmerId),
        fieldLocation: formData.fieldLocation,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        sampleDate: formData.sampleDate || null,
      };

      console.log("SOIL TEST REQUEST:", payload);

      await api.post("/api/soil", payload);

      setSuccess(
        "Soil test request submitted successfully."
      );

      setFormData({
        farmerId: farmerId || "",
        fieldLocation: "",
        village: "",
        district: "",
        state: "",
        sampleDate: "",
      });

      setShowForm(false);

      await loadSoilTests();
    } catch (err) {
      console.error("SOIL TEST REQUEST ERROR:", err);
      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to submit soil test request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "REQUESTED":
        return "soil-status requested";

      case "SAMPLE_COLLECTED":
        return "soil-status collected";

      case "PROCESSING":
        return "soil-status processing";

      case "COMPLETED":
        return "soil-status completed";

      default:
        return "soil-status";
    }
  };

  if (loading) {
    return (
      <div className="farmer-dashboard">
        <div className="dashboard-container">
          <p className="loading">
            Loading soil test records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="farmer-dashboard">

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-brand">
          🌾 <span>DigitalKisan</span>
        </div>

        <div className="navbar-right">
          <button onClick={() => navigate("/farmer")}>
            Dashboard
          </button>
        </div>
      </nav>

      <main className="dashboard-container">

        {/* Header */}
        <div className="page-heading">
          <div>
            <h1>Soil Test</h1>
            <p>
              Request a soil test and track your laboratory
              results.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/farmer")}
          >
            ← Dashboard
          </button>
        </div>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* Request Button */}
        {!showForm && (
          <section className="dashboard-section">
            <button
              className="primary-action"
              onClick={() => setShowForm(true)}
            >
              + Request Soil Test
            </button>
          </section>
        )}

        {/* Request Form */}
        {showForm && (
          <section className="dashboard-section">

            <div className="section-header">
              <div>
                <h2>🧪 Request Soil Test</h2>
                <p>
                  Enter the details of the field where the
                  soil sample will be collected.
                </p>
              </div>
            </div>

            <div className="form-card">
              <form onSubmit={requestSoilTest}>

                <div className="form-grid">

                  <div className="form-field">
                    <label>Field Location</label>

                    <input
                      type="text"
                      name="fieldLocation"
                      placeholder="Example: Field No. 1"
                      value={formData.fieldLocation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Village</label>

                    <input
                      type="text"
                      name="village"
                      placeholder="Enter village"
                      value={formData.village}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>District</label>

                    <input
                      type="text"
                      name="district"
                      placeholder="Enter district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>State</label>

                    <input
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Sample Date</label>

                    <input
                      type="date"
                      name="sampleDate"
                      value={formData.sampleDate}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-action"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Soil Test Request"}
                  </button>

                </div>

              </form>
            </div>

          </section>
        )}

        {/* Existing Tests */}
        <section className="dashboard-section">

          <div className="section-header">
            <div>
              <h2>📋 My Soil Tests</h2>
              <p>
                Track the progress of your soil test requests.
              </p>
            </div>
          </div>

          {tests.length === 0 ? (
            <div className="empty-state">
              <h3>No soil tests yet</h3>
              <p>
                Request your first soil test to start tracking
                your soil information.
              </p>
            </div>
          ) : (
            <div className="soil-test-list">

              {tests.map((test) => (
                <div
                  className="soil-test-card"
                  key={test.id}
                >

                  <div className="soil-test-header">

                    <div>
                      <h3>
                        Soil Test #{test.id}
                      </h3>

                      {test.sampleId && (
                        <p>
                          Sample ID:{" "}
                          <strong>
                            {test.sampleId}
                          </strong>
                        </p>
                      )}
                    </div>

                    <span
                      className={getStatusClass(
                        test.status
                      )}
                    >
                      {test.status?.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                  </div>

                  <div className="soil-test-details">

                    <p>
                      <strong>Field:</strong>{" "}
                      {test.fieldLocation || "-"}
                    </p>

                    <p>
                      <strong>Village:</strong>{" "}
                      {test.village || "-"}
                    </p>

                    <p>
                      <strong>District:</strong>{" "}
                      {test.district || "-"}
                    </p>

                    <p>
                      <strong>State:</strong>{" "}
                      {test.state || "-"}
                    </p>

                    <p>
                      <strong>Sample Date:</strong>{" "}
                      {test.sampleDate || "-"}
                    </p>

                  </div>

                  {/* Results */}
                  {test.status === "COMPLETED" && (
                    <div className="soil-results">

                      <h4>🧪 Laboratory Results</h4>

                      <div className="soil-result-grid">

                        <div>
                          <span>Nitrogen</span>
                          <strong>
                            {test.nitrogen ?? "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Phosphorus</span>
                          <strong>
                            {test.phosphorus ?? "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Potassium</span>
                          <strong>
                            {test.potassium ?? "-"}
                          </strong>
                        </div>

                        <div>
                          <span>pH</span>
                          <strong>
                            {test.ph ?? "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Organic Carbon</span>
                          <strong>
                            {test.organicCarbon ?? "-"}
                          </strong>
                        </div>

                      </div>

                      {test.remarks && (
                        <div className="soil-remarks">
                          <strong>Lab Remarks:</strong>{" "}
                          {test.remarks}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default SoilTest;