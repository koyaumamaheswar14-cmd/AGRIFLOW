import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Allocation() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const farmerId = Number(user.userId);

  const [produce, setProduce] = useState([]);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [allocation, setAllocation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduce();
  }, []);

  const loadProduce = async () => {
    try {
      setLoading(true);
      setError("");

      if (!farmerId) {
        throw new Error("Farmer information not found. Please login again.");
      }

      const response = await api.get(
        `/api/produce/farmer/${farmerId}`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setProduce(
        data.filter(
          (item) => item.status === "AVAILABLE"
        )
      );
    } catch (err) {
      console.error("PRODUCE LOAD ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your produce."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateAllocation = async (item) => {
    try {
      setCalculating(true);
      setError("");
      setAllocation(null);
      setSelectedProduce(item);

      const payload = {
        produceId: item.id,
        farmerId: item.farmerId,
        cropName: item.cropName,
        quantity: Number(item.quantity),
        unit: item.unit,
        grade: item.grade,
        farmerLatitude: item.latitude,
        farmerLongitude: item.longitude,
      };

      console.log("ALLOCATION REQUEST:", payload);

      const response = await api.post(
        "/api/allocations/calculate-split",
        payload
      );

      console.log("ALLOCATION RESPONSE:", response.data);

      setAllocation(response.data);
    } catch (err) {
      console.error("ALLOCATION ERROR:", err);
      console.error("BACKEND RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to calculate allocation."
      );
    } finally {
      setCalculating(false);
    }
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getAllocations = () => {
    if (!allocation) {
      return [];
    }

    if (Array.isArray(allocation)) {
      return allocation;
    }

    if (Array.isArray(allocation.allocations)) {
      return allocation.allocations;
    }

    if (Array.isArray(allocation.recommendations)) {
      return allocation.recommendations;
    }

    return [];
  };

  const allocations = getAllocations();

  const totalRevenue =
    allocation?.totalExpectedRevenue ??
    allocations.reduce(
      (sum, item) =>
        sum + Number(item.expectedRevenue || 0),
      0
    );

  const totalTransport =
    allocation?.totalTransportationCost ??
    allocations.reduce(
      (sum, item) =>
        sum + Number(item.transportationCost || 0),
      0
    );

  const totalProcessing =
    allocation?.totalProcessingCost ??
    allocations.reduce(
      (sum, item) =>
        sum + Number(item.processingCost || 0),
      0
    );

  const totalStorage =
    allocation?.totalStorageCost ??
    allocations.reduce(
      (sum, item) =>
        sum + Number(item.storageCost || 0),
      0
    );

  const totalOther =
    allocation?.totalOtherCost ??
    allocations.reduce(
      (sum, item) =>
        sum + Number(item.otherCost || 0),
      0
    );

  const totalNetValue =
    allocation?.totalNetValue ??
    allocations.reduce(
      (sum, item) =>
        sum + Number(item.netValue || 0),
      0
    );

  const totalCosts =
    Number(totalTransport) +
    Number(totalProcessing) +
    Number(totalStorage) +
    Number(totalOther);

  const getType = (item) =>
    item.allocationType ||
    item.type ||
    item.recommendationType ||
    "";

  const getTypeLabel = (type) => {
    if (type === "SELL") return "SELL";
    if (type === "PROCESS") return "PROCESS";
    if (type === "STORE") return "STORE";
    return type || "RECOMMENDED";
  };

  const getIcon = (type) => {
    if (type === "SELL") return "💰";
    if (type === "PROCESS") return "🏭";
    if (type === "STORE") return "🏢";
    return "📦";
  };

  return (
    <div className="buyer-page">

      <div className="buyer-page-header">

        <button
          className="back-button"
          onClick={() => navigate("/farmer")}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1>Post-Harvest Allocation</h1>

            <p>
              Compare buyers, processors and storage
              options to find the best post-harvest decision.
            </p>
          </div>

          <button
            className="buyer-view-button"
            onClick={() => navigate("/farmer/allocation-history")}
          >
            📋 Allocation History
          </button>
        </div>

      </div>

      {loading && (
        <div className="loading">
          Loading your available produce...
        </div>
      )}

      {!loading && error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        produce.length === 0 && (
          <div className="empty-state">

            <div>🌾</div>

            <h3>
              No Available Produce
            </h3>

            <p>
              Add available produce before calculating
              an allocation.
            </p>

            <button
              onClick={() =>
                navigate("/farmer/add-produce")
              }
            >
              Add Produce
            </button>

          </div>
        )}

      {!loading &&
        produce.length > 0 && (
          <section className="dashboard-section">

            <div className="section-header">

              <div>
                <h2>
                  Select Produce
                </h2>

                <p>
                  Choose the produce you want to
                  allocate.
                </p>
              </div>

            </div>

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
                        Produce ID
                      </span>

                      <strong>
                        #{item.id}
                      </strong>
                    </div>

                  </div>

                  <button
                    className="buyer-view-button"
                    disabled={calculating}
                    onClick={() =>
                      calculateAllocation(item)
                    }
                  >
                    {calculating &&
                    selectedProduce?.id === item.id
                      ? "Calculating..."
                      : "Calculate Best Allocation"}
                  </button>

                </div>
              ))}

            </div>

          </section>
        )}

      {calculating && (
        <div className="loading">
          Comparing buyers, processors, storage and
          transportation costs...
        </div>
      )}

      {allocation && (
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>
                Best Post-Harvest Decision
              </h2>

              {selectedProduce && (
                <p>
                  {selectedProduce.cropName} —{" "}
                  {Number(
                    selectedProduce.quantity || 0
                  ).toLocaleString()}{" "}
                  {selectedProduce.unit}
                </p>
              )}
            </div>

          </div>

          <div className="allocation-summary-grid">

            <div className="buyer-detail-item">
              <span>
                Expected Revenue
              </span>

              <strong>
                ₹{formatMoney(totalRevenue)}
              </strong>
            </div>

            <div className="buyer-detail-item">
              <span>
                Total Costs
              </span>

              <strong>
                ₹{formatMoney(totalCosts)}
              </strong>
            </div>

            <div className="buyer-detail-item">
              <span>
                Transportation
              </span>

              <strong>
                ₹{formatMoney(totalTransport)}
              </strong>
            </div>

            <div className="buyer-detail-item">
              <span>
                Processing
              </span>

              <strong>
                ₹{formatMoney(totalProcessing)}
              </strong>
            </div>

            <div className="buyer-detail-item">
              <span>
                Storage
              </span>

              <strong>
                ₹{formatMoney(totalStorage)}
              </strong>
            </div>

            <div className="buyer-detail-item">
              <span>
                Net Value
              </span>

              <strong>
                ₹{formatMoney(totalNetValue)}
              </strong>
            </div>

          </div>

          <div className="produce-cards">

            {allocations.map((item, index) => {

              const type = getType(item);

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
                        Allocated Quantity
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
                        the sale proceeds.
                      </p>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {allocations.length > 0 && (
            <div className="buyer-details-status">

              <h3>
                Allocation Summary
              </h3>

              <p>
                The allocation engine compared
                available buyers, processors,
                storage options and transportation
                costs.
              </p>

              <p>
                <strong>
                  Recommended quantity:
                </strong>{" "}
                {allocations
                  .reduce(
                    (sum, item) =>
                      sum +
                      Number(
                        item.allocatedQuantity || 0
                      ),
                    0
                  )
                  .toLocaleString()}{" "}
                {selectedProduce?.unit}
              </p>

              <p>
                <strong>
                  Total Net Value:
                </strong>{" "}
                ₹{formatMoney(totalNetValue)}
              </p>

            </div>
          )}

        </section>
      )}

    </div>
  );
}

export default Allocation;