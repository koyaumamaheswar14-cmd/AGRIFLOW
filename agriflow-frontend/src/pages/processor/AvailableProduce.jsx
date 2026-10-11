import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AvailableProduce() {
  const navigate = useNavigate();

  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduce();
  }, []);

  const loadProduce = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/produce");

      console.log("AVAILABLE PRODUCE:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const availableProduce = data.filter(
        (item) => item.status === "AVAILABLE"
      );

      setProduce(availableProduce);
    } catch (err) {
      console.error("AVAILABLE PRODUCE ERROR:", err);
      console.error("BACKEND RESPONSE:", err.response?.data);

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

      {/* HEADER */}
      <div className="buyer-page-header">

        <button
          className="back-button"
          onClick={() => navigate("/processor")}
        >
          ← Back to Dashboard
        </button>

        <h1>Available Produce</h1>

        <p>
          View fresh produce available from farmers.
        </p>

      </div>


      {/* LOADING */}
      {loading && (
        <div className="loading">
          Loading available produce...
        </div>
      )}


      {/* ERROR */}
      {!loading && error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* EMPTY */}
      {!loading &&
        !error &&
        produce.length === 0 && (

          <div className="empty-state">

            <div>🌾</div>

            <h3>
              No Produce Available
            </h3>

            <p>
              There is currently no available
              produce registered by farmers.
            </p>

          </div>
        )}


      {/* PRODUCE LIST */}
      {!loading &&
        !error &&
        produce.length > 0 && (

          <div className="buyer-produce-grid">

            {produce.map((item) => (

              <div
                className="buyer-produce-card"
                key={item.id}
              >

                {/* CARD HEADER */}
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


                {/* DETAILS */}
                <div className="buyer-produce-details">

                  <div>

                    <span>
                      Quantity
                    </span>

                    <strong>
                      {Number(
                        item.quantity || 0
                      ).toLocaleString()}{" "}
                      {item.unit}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Quality
                    </span>

                    <strong>
                      Grade {item.grade}
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


                {/* LOCATION */}
                <div className="buyer-produce-location">

                  📍{" "}

                  {item.latitude != null &&
                  item.longitude != null
                    ? `${item.latitude}, ${item.longitude}`
                    : "Location not provided"}

                </div>


                {/* VIEW PRODUCE */}
                <button
                  className="buyer-view-button"
                  onClick={() =>
                    navigate(
                      `/buyer/produce/${item.id}`
                    )
                  }
                >
                  View Produce
                </button>

              </div>

            ))}

          </div>
        )}

    </div>
  );
}

export default AvailableProduce;