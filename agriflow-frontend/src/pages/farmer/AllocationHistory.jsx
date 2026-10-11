import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AllocationHistory() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const farmerId = Number(user.userId);

  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      if (!farmerId) {
        throw new Error("Farmer information not found.");
      }

      const response = await api.get(
        `/api/allocations/farmer/${farmerId}`
      );

      console.log("ALLOCATION HISTORY:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.allocations)
        ? response.data.allocations
        : Array.isArray(response.data?.recommendations)
        ? response.data.recommendations
        : [];

      setAllocations(data);
    } catch (err) {
      console.error("ALLOCATION HISTORY ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load allocation history."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getIcon = (type) => {
    if (type === "SELL") return "💰";
    if (type === "PROCESS") return "🏭";
    if (type === "STORE") return "🏢";
    return "📦";
  };

  const getTypeLabel = (type) => {
    if (type === "SELL") return "SELL";
    if (type === "PROCESS") return "PROCESS";
    if (type === "STORE") return "STORE";
    return type || "RECOMMENDED";
  };

  return (
    <div className="buyer-page">

      <div className="buyer-page-header">

        <button
          className="back-button"
          onClick={() => navigate("/farmer/allocation")}
        >
          ← Back to Allocation
        </button>

        <h1>
          Allocation History
        </h1>

        <p>
          View your previous post-harvest allocation
          recommendations.
        </p>

      </div>

      {loading && (
        <div className="loading">
          Loading allocation history...
        </div>
      )}

      {!loading && error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        allocations.length === 0 && (
          <div className="empty-state">

            <div>📊</div>

            <h3>
              No Allocation History
            </h3>

            <p>
              Your allocation recommendations will
              appear here after you calculate them.
            </p>

            <button
              onClick={() =>
                navigate("/farmer/allocation")
              }
            >
              Calculate Allocation
            </button>

          </div>
        )}

      {!loading &&
        !error &&
        allocations.length > 0 && (
          <section className="dashboard-section">

            <div className="section-header">

              <div>
                <h2>
                  Previous Recommendations
                </h2>

                <p>
                  {allocations.length} allocation{" "}
                  {allocations.length === 1
                    ? "record"
                    : "records"}{" "}
                  found.
                </p>
              </div>

            </div>

            <div className="produce-cards">

              {allocations.map((item, index) => {

                const type =
                  item.allocationType ||
                  item.type ||
                  item.recommendationType ||
                  "RECOMMENDED";

                return (
                  <div
                    className="produce-detail-card"
                    key={item.id || index}
                  >

                    <div className="produce-card-header">

                      <div className="crop-icon">
                        {getIcon(type)}
                      </div>

                      <div>

                        <h2>
                          {getTypeLabel(type)}
                        </h2>

                        <span className="status-badge available">
                          {item.status ||
                            "RECOMMENDED"}
                        </span>

                      </div>

                    </div>

                    <div className="produce-info">

                      <div>
                        <span>
                          Crop
                        </span>

                        <strong>
                          {item.cropName ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Quantity
                        </span>

                        <strong>
                          {Number(
                            item.allocatedQuantity || 0
                          ).toLocaleString()}{" "}
                          {item.unit || ""}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Destination
                        </span>

                        <strong>
                          {item.destinationName ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Distance
                        </span>

                        <strong>
                          {Number(
                            item.distanceKm || 0
                          ).toFixed(2)}{" "}
                          KM
                        </strong>
                      </div>

                      <div>
                        <span>
                          Expected Revenue
                        </span>

                        <strong>
                          ₹
                          {formatMoney(
                            item.expectedRevenue
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Transportation
                        </span>

                        <strong>
                          ₹
                          {formatMoney(
                            item.transportationCost
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Processing Cost
                        </span>

                        <strong>
                          ₹
                          {formatMoney(
                            item.processingCost
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Storage Cost
                        </span>

                        <strong>
                          ₹
                          {formatMoney(
                            item.storageCost
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Other Cost
                        </span>

                        <strong>
                          ₹
                          {formatMoney(
                            item.otherCost
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Net Value
                        </span>

                        <strong>
                          ₹
                          {formatMoney(
                            item.netValue
                          )}
                        </strong>
                      </div>

                    </div>

                    {item.storagePaymentMode ===
                      "PAY_AFTER_SELLING" && (
                      <div className="buyer-details-status">

                        <h3>
                          Storage Payment
                        </h3>

                        <p>
                          Pay after selling. Storage
                          cost will be deducted from
                          sale proceeds.
                        </p>

                      </div>
                    )}

                    <div className="buyer-details-status">

                      <h3>
                        Allocation Information
                      </h3>

                      <p>
                        This recommendation was generated
                        by comparing available buyers,
                        processors, storage facilities and
                        transportation costs.
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>
        )}

    </div>
  );
}

export default AllocationHistory;