import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminAllocations() {
  const navigate = useNavigate();

  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAllocations();
  }, []);

  const loadAllocations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/allocations");

      console.log("ADMIN ALLOCATIONS:", response.data);

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response.data?.allocations)) {
        data = response.data.allocations;
      } else if (Array.isArray(response.data?.recommendations)) {
        data = response.data.recommendations;
      }

      setAllocations(data);
    } catch (err) {
      console.error("ADMIN ALLOCATIONS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Unable to load allocations."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "SELL":
        return "💰";
      case "PROCESS":
        return "🏭";
      case "STORE":
        return "🏢";
      default:
        return "📦";
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case "SELL":
        return "allocation-type-sell";
      case "PROCESS":
        return "allocation-type-process";
      case "STORE":
        return "allocation-type-store";
      default:
        return "allocation-type-default";
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/admin")}
          >
            ← Back to Dashboard
          </button>

          <h1>Allocations</h1>

          <p>
            Monitor all post-harvest produce allocations
            across the platform.
          </p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={loadAllocations}
        >
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className="admin-loading">
          Loading allocations...
        </div>
      )}

      {!loading && error && (
        <div className="admin-error">
          <strong>Failed to load allocations</strong>
          <p>{error}</p>

          <button onClick={loadAllocations}>
            Try Again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        allocations.length === 0 && (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📋</div>

            <h3>No Allocations Found</h3>

            <p>
              No produce allocations have been created
              yet.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        allocations.length > 0 && (
          <>
            <div className="admin-summary-grid">
              <div className="admin-summary-card">
                <span>Total Allocations</span>
                <strong>{allocations.length}</strong>
              </div>

              <div className="admin-summary-card">
                <span>Sell</span>
                <strong>
                  {
                    allocations.filter(
                      (item) =>
                        item.allocationType === "SELL"
                    ).length
                  }
                </strong>
              </div>

              <div className="admin-summary-card">
                <span>Process</span>
                <strong>
                  {
                    allocations.filter(
                      (item) =>
                        item.allocationType ===
                        "PROCESS"
                    ).length
                  }
                </strong>
              </div>

              <div className="admin-summary-card">
                <span>Store</span>
                <strong>
                  {
                    allocations.filter(
                      (item) =>
                        item.allocationType ===
                        "STORE"
                    ).length
                  }
                </strong>
              </div>
            </div>

            <section className="admin-section">
              <div className="admin-section-header">
                <div>
                  <h2>Allocation Records</h2>

                  <p>
                    {allocations.length} allocation{" "}
                    {allocations.length === 1
                      ? "record"
                      : "records"}{" "}
                    found.
                  </p>
                </div>
              </div>

              <div className="admin-allocation-list">
                {allocations.map((item, index) => {
                  const type =
                    item.allocationType ||
                    item.type ||
                    "UNKNOWN";

                  return (
                    <div
                      className="admin-allocation-card"
                      key={item.id || index}
                    >
                      <div className="admin-allocation-header">
                        <div className="admin-allocation-title">
                          <div className="admin-allocation-icon">
                            {getTypeIcon(type)}
                          </div>

                          <div>
                            <h3>
                              {item.cropName ||
                                "Unknown Crop"}
                            </h3>

                            <span
                              className={`admin-allocation-type ${getTypeClass(
                                type
                              )}`}
                            >
                              {type}
                            </span>
                          </div>
                        </div>

                        <span className="admin-status-badge">
                          {item.status || "ALLOCATED"}
                        </span>
                      </div>

                      <div className="admin-allocation-grid">
                        <div>
                          <span>Allocation ID</span>
                          <strong>
                            #{item.id || "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Produce ID</span>
                          <strong>
                            #{item.produceId || "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Farmer ID</span>
                          <strong>
                            #{item.farmerId || "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Quantity</span>
                          <strong>
                            {Number(
                              item.allocatedQuantity || 0
                            ).toLocaleString()}{" "}
                            {item.unit || ""}
                          </strong>
                        </div>

                        <div>
                          <span>Destination</span>
                          <strong>
                            {item.destinationName ||
                              "-"}
                          </strong>
                        </div>

                        <div>
                          <span>Distance</span>
                          <strong>
                            {Number(
                              item.distanceKm || 0
                            ).toFixed(2)}{" "}
                            KM
                          </strong>
                        </div>

                        <div>
                          <span>Expected Revenue</span>
                          <strong>
                            ₹
                            {formatMoney(
                              item.expectedRevenue
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Transportation</span>
                          <strong>
                            ₹
                            {formatMoney(
                              item.transportationCost
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Processing Cost</span>
                          <strong>
                            ₹
                            {formatMoney(
                              item.processingCost
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Storage Cost</span>
                          <strong>
                            ₹
                            {formatMoney(
                              item.storageCost
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Other Cost</span>
                          <strong>
                            ₹
                            {formatMoney(
                              item.otherCost
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Net Value</span>
                          <strong className="net-value">
                            ₹
                            {formatMoney(
                              item.netValue
                            )}
                          </strong>
                        </div>
                      </div>

                      {item.storagePaymentMode ===
                        "PAY_AFTER_SELLING" && (
                        <div className="admin-allocation-note">
                          <strong>
                            Storage Payment:
                          </strong>

                          <span>
                            Pay after selling. Storage
                            cost will be deducted from
                            sale proceeds.
                          </span>
                        </div>
                      )}

                      {item.createdAt && (
                        <div className="admin-allocation-footer">
                          Created:{" "}
                          {new Date(
                            item.createdAt
                          ).toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
    </div>
  );
}

export default AdminAllocations;