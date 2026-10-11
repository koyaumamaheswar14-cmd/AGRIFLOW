import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ProcessorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = Number(user.userId);

  const [processors, setProcessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProcessor();
  }, []);

  const loadProcessor = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("================================");
      console.log("PROCESSOR DASHBOARD");
      console.log("Logged in user:", user);
      console.log("User ID:", userId);
      console.log("================================");

      if (!userId) {
        setError("User information not found. Please login again.");
        return;
      }

      // Get all processors
      const response = await api.get("/api/processors");

      console.log("ALL PROCESSORS:", response.data);

      const allProcessors = Array.isArray(response.data)
        ? response.data
        : [];

      // Find processors belonging to logged-in user
      const myProcessors = allProcessors.filter(
        (processor) => Number(processor.userId) === userId
      );

      console.log("MY PROCESSORS:", myProcessors);

      setProcessors(myProcessors);
    } catch (err) {
      console.error("PROCESSOR DASHBOARD ERROR:", err);
      console.error("STATUS:", err.response?.status);
      console.error("BACKEND RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load processor information."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="buyer-dashboard">

      {/* NAVBAR */}
      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          🌾 DigitalKisan
        </div>

        <div className="navbar-right">

          <span>
            {user.name || "Processor"}
          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN CONTENT */}
      <main className="dashboard-container">

        {/* HEADER */}
        <section className="welcome-section">

          <div>

            <h1>
              Processor Dashboard
            </h1>

            <p>
              Manage your processing facility and processing capacity.
            </p>

          </div>

          <button
            className="primary-action"
            onClick={() =>
              navigate("/processor/register")
            }
          >
            + Register Facility
          </button>

        </section>


        {/* LOADING */}
        {loading && (
          <div className="loading">
            Loading processor information...
          </div>
        )}


        {/* ERROR */}
        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* NO FACILITY */}
        {!loading &&
          !error &&
          processors.length === 0 && (

            <div className="empty-state">

              <div>
                🏭
              </div>

              <h3>
                No Processing Facility Registered
              </h3>

              <p>
                Register your processing facility to start
                receiving processing opportunities.
              </p>

              <button
                onClick={() =>
                  navigate("/processor/register")
                }
              >
                Register Facility
              </button>

            </div>
          )}


        {/* PROCESSOR FACILITIES */}
        {!loading &&
          !error &&
          processors.length > 0 && (

            <section className="dashboard-section">

              <div className="section-header">

                <h2>
                  My Processing Facilities
                </h2>

                <button
                  className="view-button"
                  onClick={() =>
                    navigate("/processor/produce")
                  }
                >
                  Available Produce →
                </button>

              </div>


              <div className="produce-cards">

                {processors.map((processor) => (

                  <div
                    className="produce-detail-card"
                    key={processor.id}
                  >

                    {/* CARD HEADER */}
                    <div className="produce-card-header">

                      <div className="crop-icon">
                        🏭
                      </div>

                      <div>

                        <h2>
                          {processor.processorName}
                        </h2>

                        <span
                          className={
                            processor.availability === "AVAILABLE"
                              ? "status-badge available"
                              : "status-badge"
                          }
                        >
                          {processor.availability}
                        </span>

                      </div>

                    </div>


                    {/* DETAILS */}
                    <div className="produce-info">

                      <div>

                        <span>
                          Processing Type
                        </span>

                        <strong>
                          {processor.processingType
                            ? processor.processingType
                                .replaceAll("_", " ")
                            : "Not provided"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Supported Crops
                        </span>

                        <strong>
                          {processor.supportedCrops ||
                            "Not provided"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Capacity
                        </span>

                        <strong>
                          {Number(
                            processor.processingCapacity || 0
                          ).toLocaleString()}{" "}
                          {processor.capacityUnit || ""}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Processing Cost
                        </span>

                        <strong>
                          ₹
                          {Number(
                            processor.processingCost || 0
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {processor.costUnit || ""}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Processed Product Price
                        </span>

                        <strong>
                          ₹
                          {Number(
                            processor.processedProductPrice || 0
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Phone
                        </span>

                        <strong>
                          {processor.phone ||
                            "Not provided"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Location
                        </span>

                        <strong>
                          {processor.district
                            ? `${processor.district}, ${
                                processor.state || ""
                              }`
                            : "Not provided"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Address
                        </span>

                        <strong>
                          {processor.address ||
                            "Not provided"}
                        </strong>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </section>
          )}


        {/* QUICK ACTIONS */}
        <section className="dashboard-section">

          <h2>
            Quick Actions
          </h2>

          <div className="quick-actions">

            <button
              onClick={() =>
                navigate("/processor/register")
              }
            >
              🏭
              <span>
                Register Facility
              </span>
            </button>


            <button
              onClick={() =>
                navigate("/processor/produce")
              }
            >
              🌾
              <span>
                Available Produce
              </span>
            </button>


            <button
              onClick={() =>
                navigate("/processor")
              }
            >
              📊
              <span>
                Dashboard
              </span>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProcessorDashboard;