import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function FarmerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const farmerId = user.userId;

  const [produce, setProduce] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [soilTests, setSoilTests] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    if (!farmerId) {
      setError("Farmer information not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        produceResponse,
        allocationResponse,
        soilResponse,
        requestsResponse,
      ] = await Promise.all([
        api.get(`/api/produce/farmer/${farmerId}`),
        api.get(`/api/allocations/farmer/${farmerId}`),
        api.get(`/api/soil/farmer/${farmerId}`),
        api.get(`/api/orders/farmer/${farmerId}`),
      ]);

      // =========================
      // PRODUCE
      // =========================

      const produceData = Array.isArray(produceResponse.data)
        ? produceResponse.data
        : [];

      // =========================
      // ALLOCATIONS
      // =========================

      const allocationData = Array.isArray(
        allocationResponse.data
      )
        ? allocationResponse.data
        : [];

      // =========================
      // SOIL TESTS
      // =========================

      const soilData = Array.isArray(soilResponse.data)
        ? soilResponse.data
        : [];

      // =========================
      // ORDERS / REQUESTS
      // =========================

      const requestsData = Array.isArray(
        requestsResponse.data
      )
        ? requestsResponse.data
        : [];

      setProduce(produceData);
      setAllocations(allocationData);
      setSoilTests(soilData);
      setRequests(requestsData);

    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // AVAILABLE PRODUCE
  // =========================

  const availableProduce = produce.filter(
    (item) => item.status === "AVAILABLE"
  );


  // =========================
  // QUANTITY BY UNIT
  // =========================

  const quantityByUnit = availableProduce.reduce(
    (totals, item) => {

      const unit = item.unit || "KG";
      const quantity = Number(item.quantity || 0);

      totals[unit] =
        (totals[unit] || 0) + quantity;

      return totals;
    },
    {}
  );


  // =========================
  // SOIL TESTS
  // =========================

  const completedSoilTests = soilTests.filter(
    (item) => item.status === "COMPLETED"
  );


  // =========================
  // PENDING REQUESTS
  // =========================

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING"
  );


  // =========================
  // RECENT PRODUCE
  // =========================

  const recentProduce = [...produce]
    .sort((a, b) => {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    })
    .slice(0, 5);


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="farmer-dashboard">

        <div className="dashboard-container">

          <p className="loading">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }


  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="farmer-dashboard">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          🌾 <span>DigitalKisan</span>
        </div>

        <div className="navbar-right">

          <span className="welcome-user">
            👤 {user.name || "Farmer"}
          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>


      <main className="dashboard-container">

        {/* =========================
            WELCOME
        ========================= */}

        <section className="welcome-section">

          <div>

            <h1>
              Welcome, {user.name || "Farmer"}! 👋
            </h1>

            <p>
              Manage your harvested produce and make
              smarter post-harvest decisions.
            </p>

          </div>

          <button
            className="primary-action"
            onClick={() =>
              navigate("/farmer/add-produce")
            }
          >
            + Register Harvest
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

          {/* TOTAL PRODUCE */}

          <div className="stat-card">

            <div className="stat-icon">
              🌾
            </div>

            <div>

              <span>Total Produce</span>

              <strong>
                {produce.length}
              </strong>

            </div>

          </div>


          {/* AVAILABLE QUANTITY */}

          <div className="stat-card">

            <div className="stat-icon">
              📦
            </div>

            <div>

              <span>Available Quantity</span>

              <strong>

                {Object.entries(quantityByUnit).length > 0 ? (

                  Object.entries(quantityByUnit).map(
                    ([unit, quantity]) => (

                      <span
                        key={unit}
                        className="quantity-line"
                      >
                        {quantity.toLocaleString()} {unit}
                      </span>

                    )
                  )

                ) : (

                  <span className="quantity-line">
                    0 KG
                  </span>

                )}

              </strong>

            </div>

          </div>


          {/* ALLOCATIONS */}

          <div className="stat-card">

            <div className="stat-icon">
              📊
            </div>

            <div>

              <span>Allocations</span>

              <strong>
                {allocations.length}
              </strong>

            </div>

          </div>


          {/* INCOMING REQUESTS */}

          <div
            className="stat-card"
            onClick={() =>
              navigate("/farmer/requests")
            }
            style={{ cursor: "pointer" }}
          >

            <div className="stat-icon">
              📩
            </div>

            <div>

              <span>Incoming Requests</span>

              <strong>
                {pendingRequests.length}
              </strong>

            </div>

          </div>


          {/* COMPLETED SOIL TESTS */}

          <div className="stat-card">

            <div className="stat-icon">
              🧪
            </div>

            <div>

              <span>Completed Soil Tests</span>

              <strong>
                {completedSoilTests.length}
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
                Access DigitalKisan's main features.
              </p>

            </div>

          </div>


          <div className="quick-actions">

            {/* REGISTER HARVEST */}

            <button
              onClick={() =>
                navigate("/farmer/add-produce")
              }
            >
              🌾
              <span>
                Register Harvest
              </span>
            </button>


            {/* MARKETPLACE */}

            <button
              onClick={() =>
                navigate("/farmer/marketplace")
              }
            >
              🛒
              <span>
                Marketplace
              </span>
            </button>


            {/* ALLOCATION */}

            <button
              onClick={() =>
                navigate("/farmer/allocation")
              }
            >
              📊
              <span>
                Allocation Engine
              </span>
            </button>


            {/* SOIL TEST */}

            <button
              onClick={() =>
                navigate("/farmer/soil")
              }
            >
              🧪
              <span>
                Soil Test
              </span>
            </button>


            {/* WEATHER */}

            <button
              onClick={() =>
                navigate("/farmer/weather")
              }
            >
              🌦️
              <span>
                Weather Advisory
              </span>
            </button>


            {/* INCOMING REQUESTS */}

            <button
              onClick={() =>
                navigate("/farmer/requests")
              }
            >
              📩
              <span>
                Incoming Requests
              </span>
            </button>


            {/* MY PRODUCE */}

            <button
              onClick={() =>
                navigate("/farmer/produce")
              }
            >
              📋
              <span>
                My Produce
              </span>
            </button>

          </div>

        </section>


        {/* =========================
            RECENT PRODUCE
        ========================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Recent Harvested Produce
              </h2>

              <p>
                Your latest registered produce.
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                navigate("/farmer/produce")
              }
            >
              View All →
            </button>

          </div>


          {recentProduce.length === 0 ? (

            <div className="empty-state">

              <h3>
                No produce registered yet
              </h3>

              <p>
                Register your harvested produce to
                start using DigitalKisan.
              </p>

              <button
                className="primary-action"
                onClick={() =>
                  navigate("/farmer/add-produce")
                }
              >
                + Register Harvest
              </button>

            </div>

          ) : (

            <div className="produce-table">

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
                  Harvest Date
                </span>

                <span>
                  Status
                </span>

              </div>


              {recentProduce.map((item) => (

                <div
                  className="table-row"
                  key={item.id}
                >

                  <span>
                    🌾 {item.cropName}
                  </span>

                  <span>
                    {item.quantity} {item.unit}
                  </span>

                  <span>
                    Grade {item.grade}
                  </span>

                  <span>
                    {item.harvestDate || "-"}
                  </span>

                  <span>

                    <span className="status-badge">
                      {item.status}
                    </span>

                  </span>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =========================
            PENDING REQUEST BANNER
        ========================= */}

        {pendingRequests.length > 0 && (

          <section className="allocation-banner">

            <div>

              <h2>
                📩 You Have New Requests
              </h2>

              <p>
                {pendingRequests.length} request
                {pendingRequests.length > 1
                  ? "s are"
                  : " is"}{" "}
                waiting for your response.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/farmer/requests")
              }
            >
              View Requests →
            </button>

          </section>

        )}


        {/* =========================
            ALLOCATION BANNER
        ========================= */}

        <section className="allocation-banner">

          <div>

            <h2>
              💡 Optimize Your Harvest
            </h2>

            <p>
              Let DigitalKisan compare buyers,
              processors and storage facilities to
              find the best post-harvest option.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/farmer/allocation")
            }
          >
            Analyze Produce →
          </button>

        </section>

      </main>

    </div>
  );
}
export default FarmerDashboard;