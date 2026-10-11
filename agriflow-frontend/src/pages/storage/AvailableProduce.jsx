import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AvailableProduce() {
  const navigate = useNavigate();

  const [produce, setProduce] = useState([]);
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = Number(user.userId);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        throw new Error(
          "User information not found. Please login again."
        );
      }

      // Get all storage facilities
      const storageResponse = await api.get("/api/storage");

      console.log("ALL STORAGE:", storageResponse.data);

      const allStorage = Array.isArray(storageResponse.data)
        ? storageResponse.data
        : [];

      const myStorage = allStorage.find(
        (item) => Number(item.userId) === userId
      );

      console.log("MY STORAGE:", myStorage);

      if (!myStorage) {
        throw new Error(
          "Storage facility not found for this account."
        );
      }

      setStorage(myStorage);

      // Get all farmer produce
      const produceResponse = await api.get("/api/produce");

      console.log("ALL PRODUCE:", produceResponse.data);

      const allProduce = Array.isArray(produceResponse.data)
        ? produceResponse.data
        : [];

      // Only available produce
      const availableProduce = allProduce.filter(
        (item) => item.status === "AVAILABLE"
      );

      setProduce(availableProduce);

    } catch (err) {
      console.error(
        "STORAGE AVAILABLE PRODUCE ERROR:",
        err
      );

      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.message ||
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
          onClick={() => navigate("/storage")}
        >
          ← Back to Dashboard
        </button>

        <h1>
          Available Produce
        </h1>

        <p>
          View farmer produce available for storage.
        </p>

      </div>


      {/* STORAGE INFO */}
      {!loading && storage && (
        <section className="dashboard-section">

          <h2>
            🏢 Your Storage Facility
          </h2>

          <div className="produce-detail-card">

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
                    storage.availability === "AVAILABLE"
                      ? "status-badge available"
                      : "status-badge"
                  }
                >
                  {storage.availability}
                </span>

              </div>

            </div>

            <div className="produce-info">

              <div>
                <span>Storage Type</span>
                <strong>
                  {storage.storageType || "Not provided"}
                </strong>
              </div>

              <div>
                <span>Capacity</span>
                <strong>
                  {Number(
                    storage.storageCapacity || 0
                  ).toLocaleString()}{" "}
                  {storage.capacityUnit || ""}
                </strong>
              </div>

              <div>
                <span>Storage Cost</span>
                <strong>
                  ₹
                  {Number(
                    storage.storageCost || 0
                  ).toFixed(2)}{" "}
                  {storage.costUnit || ""}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {storage.district || "Not provided"}
                </strong>
              </div>

            </div>

          </div>

        </section>
      )}


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


      {/* PRODUCE */}
      {!loading &&
        !error &&
        produce.length > 0 && (

          <div className="buyer-produce-grid">

            {produce.map((item) => (

              <div
                className="buyer-produce-card"
                key={item.id}
              >

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


                <div className="buyer-produce-location">

                  📍{" "}

                  {item.latitude != null &&
                  item.longitude != null
                    ? `${item.latitude}, ${item.longitude}`
                    : "Location not provided"}

                </div>


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