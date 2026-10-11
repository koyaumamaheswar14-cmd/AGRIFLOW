import React, { useEffect, useState } from "react";
import api from "../../services/api";

const FarmerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const farmerId = user?.userId;


  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      if (!farmerId) {
        setError(
          "Farmer information not found. Please login again."
        );
        return;
      }

      const response = await api.get(
        `/api/orders/farmer/${farmerId}`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setRequests(data);

    } catch (err) {
      console.error(
        "LOAD REQUESTS ERROR:",
        err
      );

      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load requests."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadRequests();
  }, [farmerId]);


  // =====================================================
  // ACCEPT REQUEST
  // =====================================================

  const acceptRequest = async (id) => {
    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      console.log(
        "ACCEPTING ORDER:",
        id
      );

      const response = await api.put(
        `/api/orders/${id}/accept`
      );

      console.log(
        "ACCEPT RESPONSE:",
        response.data
      );

      setSuccess(
        "Request accepted successfully."
      );

      // IMPORTANT:
      // Get the actual status from backend
      await loadRequests();

    } catch (err) {
      console.error(
        "ACCEPT REQUEST ERROR:",
        err
      );

      console.error(
        "STATUS:",
        err.response?.status
      );

      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to accept request."
      );

    } finally {
      setProcessingId(null);
    }
  };


  // =====================================================
  // REJECT REQUEST
  // =====================================================

  const rejectRequest = async (id) => {
    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      console.log(
        "REJECTING ORDER:",
        id
      );

      const response = await api.put(
        `/api/orders/${id}/reject`
      );

      console.log(
        "REJECT RESPONSE:",
        response.data
      );

      setSuccess(
        "Request rejected successfully."
      );

      // Reload actual backend data
      await loadRequests();

    } catch (err) {
      console.error(
        "REJECT REQUEST ERROR:",
        err
      );

      console.error(
        "STATUS:",
        err.response?.status
      );

      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to reject request."
      );

    } finally {
      setProcessingId(null);
    }
  };


  // =====================================================
  // REQUEST TYPE LABEL
  // =====================================================

  const getTypeLabel = (type) => {

    switch (type) {

      case "SELL":
        return "Purchase Request";

      case "PROCESS":
        return "Processing Request";

      case "STORE":
        return "Storage Request";

      default:
        return type || "Request";
    }
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "PENDING":
        return "status-pending";

      case "ACCEPTED":
        return "status-accepted";

      case "REJECTED":
        return "status-rejected";

      case "COMPLETED":
        return "status-completed";

      default:
        return "";
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="page-container">

        <div className="loading">
          Loading requests...
        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="page-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <h1>
            Incoming Requests
          </h1>

          <p>
            Manage purchase, processing, and storage
            requests for your produce.
          </p>

        </div>

        <button
          className="btn-secondary"
          onClick={loadRequests}
          disabled={loading}
        >
          🔄 Refresh
        </button>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (

        <div
          style={{
            background: "#e8f5e9",
            color: "#2e7d32",
            border: "1px solid #c8e6c9",
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
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <div className="error-message">

          ⚠️ {error}

        </div>

      )}


      {/* =================================================
          NO REQUESTS
      ================================================= */}

      {requests.length === 0 ? (

        <div className="empty-state">

          <div
            style={{
              fontSize: "50px",
              marginBottom: "15px",
            }}
          >
            📩
          </div>

          <h2>
            No Requests Yet
          </h2>

          <p>
            Buyers, processors, and storage providers
            can send requests for your produce here.
          </p>

        </div>

      ) : (

        <div className="requests-grid">

          {requests.map((request) => (

            <div
              className="request-card"
              key={request.id}
            >

              {/* =========================================
                  HEADER
              ========================================= */}

              <div className="request-card-header">

                <div>

                  <span className="request-type">

                    {getTypeLabel(
                      request.requestType
                    )}

                  </span>

                  <h2>
                    {request.cropName || "Produce"}
                  </h2>

                </div>


                <span
                  className={`request-status ${getStatusClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>

              </div>


              {/* =========================================
                  DETAILS
              ========================================= */}

              <div className="request-details">

                <div className="request-detail">

                  <span>
                    Requester
                  </span>

                  <strong>
                    {request.requesterName || "N/A"}
                  </strong>

                </div>


                <div className="request-detail">

                  <span>
                    Phone
                  </span>

                  <strong>
                    {request.requesterPhone || "N/A"}
                  </strong>

                </div>


                <div className="request-detail">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {request.quantity}{" "}
                    {request.unit}
                  </strong>

                </div>


                <div className="request-detail">

                  <span>
                    Grade
                  </span>

                  <strong>
                    {request.grade || "N/A"}
                  </strong>

                </div>


                {request.requestType === "SELL" &&
                  request.offeredPrice != null && (

                    <div className="request-detail">

                      <span>
                        Offered Price
                      </span>

                      <strong>
                        ₹{request.offeredPrice}
                      </strong>

                    </div>

                  )}


                {request.destinationName && (

                  <div className="request-detail">

                    <span>
                      Destination
                    </span>

                    <strong>
                      {request.destinationName}
                    </strong>

                  </div>

                )}

              </div>


              {/* =========================================
                  ACTIONS
              ========================================= */}

              {request.status === "PENDING" && (

                <div className="request-actions">

                  <button
                    className="btn-accept"
                    disabled={
                      processingId === request.id
                    }
                    onClick={() =>
                      acceptRequest(request.id)
                    }
                  >

                    {processingId === request.id
                      ? "Accepting..."
                      : "✓ Accept"}

                  </button>


                  <button
                    className="btn-reject"
                    disabled={
                      processingId === request.id
                    }
                    onClick={() =>
                      rejectRequest(request.id)
                    }
                  >

                    {processingId === request.id
                      ? "Processing..."
                      : "✕ Reject"}

                  </button>

                </div>

              )}


              {/* =========================================
                  ACCEPTED
              ========================================= */}

              {request.status === "ACCEPTED" && (

                <div
                  style={{
                    marginTop: "20px",
                    padding: "13px",
                    borderRadius: "10px",
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  ✓ Request Accepted
                </div>

              )}


              {/* =========================================
                  REJECTED
              ========================================= */}

              {request.status === "REJECTED" && (

                <div
                  style={{
                    marginTop: "20px",
                    padding: "13px",
                    borderRadius: "10px",
                    background: "#ffebee",
                    color: "#c62828",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  ✕ Request Rejected
                </div>

              )}


              {/* =========================================
                  COMPLETED
              ========================================= */}

              {request.status === "COMPLETED" && (

                <div
                  style={{
                    marginTop: "20px",
                    padding: "13px",
                    borderRadius: "10px",
                    background: "#e3f2fd",
                    color: "#1565c0",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  ✓ Order Completed
                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default FarmerRequests;