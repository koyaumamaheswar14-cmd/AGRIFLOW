import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ProcessorProduceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [produce, setProduce] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Get produce
      const produceResponse = await api.get(
        `/api/produce/${id}`
      );

      console.log("PROCESSOR PRODUCE DETAILS:", produceResponse.data);

      setProduce(produceResponse.data);

      // Get all processors and find logged-in processor
      const processorResponse = await api.get(
        "/api/processors"
      );

      const processors = Array.isArray(processorResponse.data)
        ? processorResponse.data
        : [];

      const myProcessor = processors.find(
        (item) =>
          Number(item.userId) === Number(user.userId)
      );

      setProcessor(myProcessor || null);

    } catch (err) {
      console.error("PRODUCE DETAILS ERROR:", err);
      console.error("BACKEND RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Unable to load produce details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="buyer-page">
        <p className="loading">
          Loading produce details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="buyer-page">

        <button
          className="back-button"
          onClick={() =>
            navigate("/processor/produce")
          }
        >
          ← Back to Available Produce
        </button>

        <div className="dashboard-error">
          {error}
        </div>

      </div>
    );
  }

  if (!produce) {
    return (
      <div className="buyer-page">

        <button
          className="back-button"
          onClick={() =>
            navigate("/processor/produce")
          }
        >
          ← Back to Available Produce
        </button>

        <div className="empty-state">

          <div>🌾</div>

          <h2>
            Produce Not Found
          </h2>

          <p>
            The requested produce could not be found.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="buyer-page">

      {/* BACK */}
      <button
        className="back-button"
        onClick={() =>
          navigate("/processor/produce")
        }
      >
        ← Back to Available Produce
      </button>


      {/* PAGE */}
      <div className="buyer-produce-details-page">

        {/* HEADER */}
        <div className="buyer-details-top">

          <div className="buyer-details-crop-icon">
            🌾
          </div>

          <div>

            <h1>
              {produce.cropName}
            </h1>

            <span
              className={
                produce.status === "AVAILABLE"
                  ? "status-badge available"
                  : "status-badge"
              }
            >
              {produce.status}
            </span>

          </div>

        </div>


        {/* PRODUCE INFORMATION */}
        <div className="buyer-details-grid">

          <div className="buyer-detail-item">
            <span>
              Available Quantity
            </span>

            <strong>
              {Number(
                produce.quantity || 0
              ).toLocaleString()}{" "}
              {produce.unit}
            </strong>
          </div>


          <div className="buyer-detail-item">
            <span>
              Quality Grade
            </span>

            <strong>
              Grade {produce.grade}
            </strong>
          </div>


          <div className="buyer-detail-item">
            <span>
              Harvest Date
            </span>

            <strong>
              {produce.harvestDate ||
                "Not provided"}
            </strong>
          </div>


          <div className="buyer-detail-item">
            <span>
              Farmer ID
            </span>

            <strong>
              #{produce.farmerId}
            </strong>
          </div>


          <div className="buyer-detail-item">
            <span>
              Latitude
            </span>

            <strong>
              {produce.latitude ??
                "Not provided"}
            </strong>
          </div>


          <div className="buyer-detail-item">
            <span>
              Longitude
            </span>

            <strong>
              {produce.longitude ??
                "Not provided"}
            </strong>
          </div>

        </div>


        {/* FARM LOCATION */}
        <div className="buyer-details-location">

          <h3>
            📍 Farm Location
          </h3>

          {produce.latitude != null &&
          produce.longitude != null ? (
            <p>
              {produce.latitude},{" "}
              {produce.longitude}
            </p>
          ) : (
            <p>
              Location information not available.
            </p>
          )}

        </div>


        {/* PROCESSOR INFORMATION */}
        {processor && (
          <div className="buyer-details-status">

            <h3>
              🏭 Your Processing Facility
            </h3>

            <p>
              <strong>
                {processor.processorName}
              </strong>
            </p>

            <p>
              Supported Crops:{" "}
              {processor.supportedCrops}
            </p>

            <p>
              Processing Type:{" "}
              {processor.processingType?.replaceAll(
                "_",
                " "
              )}
            </p>

            <p>
              Processing Capacity:{" "}
              {Number(
                processor.processingCapacity || 0
              ).toLocaleString()}{" "}
              {processor.capacityUnit}
            </p>

            <p>
              Processing Cost: ₹
              {Number(
                processor.processingCost || 0
              ).toFixed(2)}{" "}
              {processor.costUnit}
            </p>

          </div>
        )}


        {/* STATUS */}
        <div className="buyer-details-status">

          <h3>
            Produce Status
          </h3>

          <p>
            This produce is currently{" "}
            <strong>
              {produce.status}
            </strong>.
          </p>

        </div>


        {/* ACTIONS */}
        <div className="buyer-details-actions">

          <button
            className="back-button"
            onClick={() =>
              navigate("/processor/produce")
            }
          >
            ← Back
          </button>


          {produce.status === "AVAILABLE" && (
            <button
              className="primary-action"
              onClick={() =>
                alert(
                  "Processing request flow will be connected next."
                )
              }
            >
              Request Processing
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProcessorProduceDetails;