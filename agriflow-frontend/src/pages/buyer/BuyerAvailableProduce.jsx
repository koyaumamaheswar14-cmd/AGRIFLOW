import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function BuyerAvailableProduce() {
  const navigate = useNavigate();

  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduce();
  }, []);

  const fetchProduce = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/produce");

      console.log("AVAILABLE PRODUCE:", response.data);

      const availableProduce = Array.isArray(response.data)
        ? response.data.filter(
            (item) => item.status === "AVAILABLE"
          )
        : [];

      setProduce(availableProduce);
    } catch (err) {
      console.error("PRODUCE ERROR:", err);
      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Failed to load available produce."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-page">

      {/* =========================
          HEADER
          ========================= */}
      <div className="buyer-page-header">

        <button
          className="back-button"
          onClick={() => navigate("/buyer")}
        >
          ← Back to Dashboard
        </button>

        <div>
          <h1>Available Produce</h1>

          <p>
            Discover fresh produce registered by farmers.
          </p>
        </div>

      </div>

      {/* =========================
          LOADING
          ========================= */}
      {loading && (
        <div className="loading">
          Loading available produce...
        </div>
      )}

      {/* =========================
          ERROR
          ========================= */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* =========================
          EMPTY STATE
          ========================= */}
      {!loading &&
        !error &&
        produce.length === 0 && (
          <div className="empty-state">

            <div className="empty-icon">
              🌾
            </div>

            <h2>
              No Produce Available
            </h2>

            <p>
              There is currently no available produce
              registered by farmers.
            </p>

            <button
              className="primary-action"
              onClick={() => navigate("/buyer")}
            >
              ← Back to Dashboard
            </button>

          </div>
        )}

      {/* =========================
          PRODUCE CARDS
          ========================= */}
      {!loading && produce.length > 0 && (
        <div className="buyer-produce-grid">

          {produce.map((item) => (

            <div
              className="buyer-produce-card"
              key={item.id}
            >

              {/* Crop Header */}
              <div className="buyer-produce-header">

                <div className="buyer-crop-icon">
                  🌾
                </div>

                <div>

                  <h2>
                    {item.cropName}
                  </h2>

                  <span className="status-badge available">
                    AVAILABLE
                  </span>

                </div>

              </div>

              {/* Produce Details */}
              <div className="buyer-produce-details">

                <div>
                  <span>
                    Quantity
                  </span>

                  <strong>
                    {Number(
                      item.quantity || 0
                    ).toLocaleString()}{" "}
                    {item.unit || "KG"}
                  </strong>
                </div>

                <div>
                  <span>
                    Quality
                  </span>

                  <strong>
                    Grade {item.grade || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>
                    Harvest Date
                  </span>

                  <strong>
                    {item.harvestDate ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    Farmer ID
                  </span>

                  <strong>
                    #{item.farmerId}
                  </strong>
                </div>

              </div>

              {/* Location */}
              <div className="buyer-produce-location">

                📍{" "}

                {item.latitude != null &&
                item.longitude != null
                  ? `${item.latitude}, ${item.longitude}`
                  : "Location not provided"}

              </div>

              {/* View Details */}
              <button
                className="buyer-view-button"
                onClick={() =>
                  navigate(
                    `/buyer/produce/${item.id}`
                  )
                }
              >
                View Produce →
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default BuyerAvailableProduce;