import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function MyProduce() {
  const navigate = useNavigate();

  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const farmerId = user.userId;

  useEffect(() => {
    if (farmerId) {
      loadProduce();
    }
  }, [farmerId]);

  const loadProduce = async () => {
    try {
      const response = await api.get(
        `/api/produce/farmer/${farmerId}`
      );

      setProduce(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load your produce.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmer-dashboard">

      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          🌾 DigitalKisan
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/farmer")}
        >
          ← Dashboard
        </button>

      </nav>

      <main className="dashboard-container">

        <div className="page-heading">

          <div>
            <h1>My Produce</h1>

            <p>
              Manage all your registered harvested produce.
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

        </div>

        {loading && (
          <div className="loading">
            Loading your produce...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading && !error && produce.length === 0 && (
          <div className="empty-state">

            <div>🌱</div>

            <h3>No produce registered</h3>

            <p>
              Register your harvested produce to get started.
            </p>

            <button
              onClick={() =>
                navigate("/farmer/add-produce")
              }
            >
              Register Harvest
            </button>

          </div>
        )}

        {!loading && !error && produce.length > 0 && (

          <div className="produce-cards">

            {produce.map((item) => (

              <div
                className="produce-detail-card"
                key={item.id}
              >

                <div className="produce-card-header">

                  <div className="crop-icon">
                    🌱
                  </div>

                  <div>
                    <h2>{item.cropName}</h2>

                    <span className="status-badge">
                      {item.status}
                    </span>
                  </div>

                </div>

                <div className="produce-info">

                  <div>
                    <span>Quantity</span>
                    <strong>
                      {item.quantity} {item.unit}
                    </strong>
                  </div>

                  <div>
                    <span>Grade</span>
                    <strong>
                      {item.grade || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Harvest Date</span>
                    <strong>
                      {item.harvestDate || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>
                      {item.latitude && item.longitude
                        ? `${item.latitude}, ${item.longitude}`
                        : "—"}
                    </strong>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default MyProduce;