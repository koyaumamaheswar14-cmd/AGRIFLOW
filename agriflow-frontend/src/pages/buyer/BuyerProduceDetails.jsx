import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const BuyerProduceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [produce, setProduce] = useState(null);
  const [profile, setProfile] = useState(null);

  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD PRODUCE
  // =====================================================

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const produceResponse = await api.get(
        `/api/produce/${id}`
      );

      setProduce(produceResponse.data);

      // =================================================
      // LOAD LOGGED-IN USER PROFILE
      // =================================================

      if (user.userId) {
        if (user.role === "BUYER") {
          const response = await api.get(
            `/api/buyers/user/${user.userId}`
          );

          const buyers = Array.isArray(response.data)
            ? response.data
            : [];

          setProfile(
            buyers.find(
              (buyer) =>
                buyer.availability === "AVAILABLE"
            ) || buyers[0] || null
          );
        }

        if (user.role === "PROCESSOR") {
          const response = await api.get(
            `/api/processors/user/${user.userId}`
          );

          const processors = Array.isArray(response.data)
            ? response.data
            : [];

          setProfile(
            processors.find(
              (processor) =>
                processor.availability === "AVAILABLE"
            ) || processors[0] || null
          );
        }

        if (user.role === "STORAGE") {
          const response = await api.get(
            `/api/storage/user/${user.userId}`
          );

          const storageList = Array.isArray(response.data)
            ? response.data
            : [];

          setProfile(
            storageList.find(
              (storage) =>
                storage.availability === "AVAILABLE"
            ) || storageList[0] || null
          );
        }
      }

    } catch (err) {
      console.error("PRODUCE DETAILS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load produce details."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // REQUEST TYPE
  // =====================================================

  const getRequestType = () => {
    if (user.role === "BUYER") {
      return "SELL";
    }

    if (user.role === "PROCESSOR") {
      return "PROCESS";
    }

    if (user.role === "STORAGE") {
      return "STORE";
    }

    return null;
  };


  // =====================================================
  // BUTTON TEXT
  // =====================================================

  const getButtonText = () => {
    if (user.role === "BUYER") {
      return "Request to Buy";
    }

    if (user.role === "PROCESSOR") {
      return "Request Processing";
    }

    if (user.role === "STORAGE") {
      return "Request Storage";
    }

    return "Send Request";
  };


  // =====================================================
  // REQUEST
  // =====================================================

  const sendRequest = async () => {
    try {
      setError("");
      setSuccess("");

      const requestType = getRequestType();

      if (!requestType) {
        setError(
          "Only buyers, processors, and storage providers can request produce."
        );
        return;
      }

      if (!profile) {
        setError(
          "Your business profile was not found. Please complete your profile first."
        );
        return;
      }

      const requestedQuantity = Number(quantity);

      if (!requestedQuantity || requestedQuantity <= 0) {
        setError(
          "Please enter a valid quantity."
        );
        return;
      }

      if (requestedQuantity > Number(produce.quantity)) {
        setError(
          `Only ${produce.quantity} ${produce.unit} is available.`
        );
        return;
      }

      setRequesting(true);

      // =================================================
      // COMMON DATA
      // =================================================

      const payload = {
        requestType,
        produceId: produce.id,
        farmerId: produce.farmerId,

        cropName: produce.cropName,

        quantity: requestedQuantity,

        unit: produce.unit,

        grade: produce.grade,

        requesterId: user.userId,

        requesterName:
          profile.buyerName ||
          profile.processorName ||
          profile.storageName ||
          user.name,

        requesterPhone:
          profile.phone || "",

        destinationId: profile.id,

        destinationName:
          profile.buyerName ||
          profile.processorName ||
          profile.storageName ||
          user.name,

        // Buyer has an offered price.
        // Processor/storage don't use selling price.
        offeredPrice:
          requestType === "SELL"
            ? Number(profile.offeredPrice || 0)
            : null,
      };

      console.log(
        "ORDER REQUEST PAYLOAD:",
        payload
      );

      const response = await api.post(
        "/api/orders",
        payload
      );

      console.log(
        "ORDER CREATED:",
        response.data
      );

      setSuccess(
        `${getButtonText()} sent successfully!`
      );

      setQuantity("");

    } catch (err) {
      console.error(
        "REQUEST ERROR:",
        err
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      setError(
        backendMessage ||
          "Unable to send request."
      );

    } finally {
      setRequesting(false);
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page-container">

        <div className="loading">
          Loading produce details...
        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR / NO PRODUCE
  // =====================================================

  if (!produce) {
    return (
      <div className="page-container">

        <div className="error-message">
          {error || "Produce not found."}
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>

      </div>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="page-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <h1>
            {produce.cropName}
          </h1>

          <p>
            View produce details and send a request.
          </p>

        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div
          style={{
            background: "#e8f5e9",
            color: "#2e7d32",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          ✓ {success}
        </div>
      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =================================================
          PRODUCE DETAILS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(320px, 400px)",
          gap: "25px",
          alignItems: "start",
        }}
      >

        {/* =================================================
            LEFT - PRODUCE
        ================================================= */}

        <div className="request-card">

          <span className="request-type">
            AVAILABLE PRODUCE
          </span>

          <h2>
            🌾 {produce.cropName}
          </h2>


          <div className="request-details">

            <div className="request-detail">

              <span>
                Available Quantity
              </span>

              <strong>
                {produce.quantity} {produce.unit}
              </strong>

            </div>


            <div className="request-detail">

              <span>
                Quality Grade
              </span>

              <strong>
                Grade {produce.grade}
              </strong>

            </div>


            <div className="request-detail">

              <span>
                Harvest Date
              </span>

              <strong>
                {produce.harvestDate || "-"}
              </strong>

            </div>


            <div className="request-detail">

              <span>
                Status
              </span>

              <strong>
                {produce.status}
              </strong>

            </div>


            <div className="request-detail">

              <span>
                Farmer ID
              </span>

              <strong>
                {produce.farmerId}
              </strong>

            </div>


            <div className="request-detail">

              <span>
                Location
              </span>

              <strong>
                {produce.latitude &&
                produce.longitude
                  ? `${produce.latitude}, ${produce.longitude}`
                  : "Not available"}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT - REQUEST
        ================================================= */}

        <div className="request-card">

          <span className="request-type">
            {user.role === "BUYER"
              ? "PURCHASE REQUEST"
              : user.role === "PROCESSOR"
              ? "PROCESSING REQUEST"
              : user.role === "STORAGE"
              ? "STORAGE REQUEST"
              : "REQUEST"}
          </span>


          <h2>
            Send Request
          </h2>


          {/* =================================================
              PROFILE
          ================================================= */}

          {profile && (

            <div
              style={{
                background: "#f8faf9",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "18px",
              }}
            >

              <div
                style={{
                  fontSize: "12px",
                  color: "#718096",
                  marginBottom: "5px",
                }}
              >
                Your Business
              </div>

              <strong
                style={{
                  color: "#263238",
                  fontSize: "16px",
                }}
              >
                {profile.buyerName ||
                  profile.processorName ||
                  profile.storageName}
              </strong>

            </div>

          )}


          {/* =================================================
              QUANTITY
          ================================================= */}

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#37474f",
            }}
          >
            Quantity ({produce.unit})
          </label>

          <input
            type="number"
            min="1"
            max={produce.quantity}
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            placeholder={`Maximum ${produce.quantity}`}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              border: "1px solid #cfd8dc",
              borderRadius: "10px",
              fontSize: "15px",
              marginBottom: "15px",
            }}
          />


          {/* =================================================
              BUYER PRICE
          ================================================= */}

          {user.role === "BUYER" &&
            profile?.offeredPrice != null && (

              <div
                style={{
                  background: "#f1f8f2",
                  padding: "14px",
                  borderRadius: "10px",
                  marginBottom: "18px",
                }}
              >

                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#607d8b",
                    marginBottom: "4px",
                  }}
                >
                  Your Offered Price
                </span>

                <strong
                  style={{
                    fontSize: "20px",
                    color: "#2e7d32",
                  }}
                >
                  ₹{profile.offeredPrice} /{" "}
                  {produce.unit}
                </strong>

              </div>

            )}


          {/* =================================================
              REQUEST BUTTON
          ================================================= */}

          {produce.status === "AVAILABLE" ? (

            <button
              className="btn-accept"
              style={{
                width: "100%",
              }}
              disabled={requesting}
              onClick={sendRequest}
            >
              {requesting
                ? "Sending Request..."
                : `✓ ${getButtonText()}`}
            </button>

          ) : (

            <button
              className="btn-reject"
              style={{
                width: "100%",
                cursor: "not-allowed",
              }}
              disabled
            >
              Produce Not Available
            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default BuyerProduceDetails;