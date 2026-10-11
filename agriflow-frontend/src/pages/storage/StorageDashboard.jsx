import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StorageDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = Number(user.userId);

  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStorage();
  }, []);

  const loadStorage = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        throw new Error(
          "User information not found. Please login again."
        );
      }

      const response = await api.get("/api/storage");

      console.log("ALL STORAGE:", response.data);

      const allStorage = Array.isArray(response.data)
        ? response.data
        : [];

      const myStorage = allStorage.filter(
        (storage) =>
          Number(storage.userId) === userId
      );

      console.log("MY STORAGE:", myStorage);

      setStorages(myStorage);
    } catch (err) {
      console.error("STORAGE DASHBOARD ERROR:", err);
      console.error("STATUS:", err.response?.status);
      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load storage information."
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
            {user.name || "Storage Provider"}
          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN */}
      <main className="dashboard-container">

        {/* HEADER */}
        <section className="welcome-section">

          <div>

            <h1>
              Storage Dashboard
            </h1>

            <p>
              Manage your storage facility,
              capacity and availability.
            </p>

          </div>

          <button
            className="primary-action"
            onClick={() =>
              navigate("/storage/register")
            }
          >
            + Register Storage
          </button>

        </section>


        {/* LOADING */}
        {loading && (
          <div className="loading">
            Loading storage information...
          </div>
        )}


        {/* ERROR */}
        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* NO STORAGE */}
        {!loading &&
          !error &&
          storages.length === 0 && (

            <div className="empty-state">

              <div>
                🏢
              </div>

              <h3>
                No Storage Facility Registered
              </h3>

              <p>
                Register your storage facility
                to start receiving storage
                opportunities.
              </p>

              <button
                onClick={() =>
                  navigate("/storage/register")
                }
              >
                Register Storage
              </button>

            </div>
          )}


        {/* STORAGE FACILITIES */}
        {!loading &&
          !error &&
          storages.length > 0 && (

            <section className="dashboard-section">

              <div className="section-header">

                <h2>
                  My Storage Facilities
                </h2>

                <button
                  className="view-button"
                  onClick={() =>
                    navigate("/storage/produce")
                  }
                >
                  Available Produce →
                </button>

              </div>


              <div className="produce-cards">

                {storages.map((storage) => (

                  <div
                    className="produce-detail-card"
                    key={storage.id}
                  >

                    {/* HEADER */}
                    <div className="produce-card-header">

                      <div className="crop-icon">
                        🏢
                      </div>

                      <div>

                        <h2>
                          {storage.storageName}
                        </h2>

                        <span
                          className={
                            storage.availability ===
                            "AVAILABLE"
                              ? "status-badge available"
                              : "status-badge"
                          }
                        >
                          {storage.availability}
                        </span>

                      </div>

                    </div>


                    {/* DETAILS */}
                    <div className="produce-info">

                      <div>

                        <span>
                          Storage Type
                        </span>

                        <strong>
                          {storage.storageType ||
                            "Not provided"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Capacity
                        </span>

                        <strong>
                          {Number(
                            storage.storageCapacity ||
                              0
                          ).toLocaleString()}{" "}
                          {storage.capacityUnit ||
                            ""}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Storage Cost
                        </span>

                        <strong>
                          ₹
                          {Number(
                            storage.storageCost ||
                              0
                          ).toFixed(2)}{" "}
                          {storage.costUnit || ""}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Phone
                        </span>

                        <strong>
                          {storage.phone ||
                            "Not provided"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Location
                        </span>

                        <strong>
                          {storage.district
                            ? `${storage.district}, ${
                                storage.state || ""
                              }`
                            : "Not provided"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Address
                        </span>

                        <strong>
                          {storage.address ||
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
                navigate("/storage/register")
              }
            >
              🏢
              <span>
                Register Storage
              </span>
            </button>


            <button
              onClick={() =>
                navigate("/storage/produce")
              }
            >
              🌾
              <span>
                Available Produce
              </span>
            </button>


            <button
              onClick={() =>
                navigate("/storage")
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

export default StorageDashboard;