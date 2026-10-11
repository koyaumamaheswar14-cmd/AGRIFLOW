import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Marketplace() {
  const navigate = useNavigate();

  const [buyers, setBuyers] = useState([]);
  const [processors, setProcessors] = useState([]);
  const [storage, setStorage] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMarketplace();
  }, []);

  const loadMarketplace = async () => {
    try {
      setLoading(true);
      setError("");

      const [buyerResponse, processorResponse, storageResponse] =
        await Promise.all([
          api.get("/api/buyers"),
          api.get("/api/processors"),
          api.get("/api/storage"),
        ]);

      const buyerData = Array.isArray(buyerResponse.data)
        ? buyerResponse.data
        : [];

      const processorData = Array.isArray(processorResponse.data)
        ? processorResponse.data
        : [];

      const storageData = Array.isArray(storageResponse.data)
        ? storageResponse.data
        : [];

      setBuyers(
        buyerData.filter(
          (item) => item.availability === "AVAILABLE"
        )
      );

      setProcessors(
        processorData.filter(
          (item) => item.availability === "AVAILABLE"
        )
      );

      setStorage(
        storageData.filter(
          (item) => item.availability === "AVAILABLE"
        )
      );
    } catch (err) {
      console.error("MARKETPLACE ERROR:", err);
      console.error("BACKEND RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Unable to load marketplace data."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="farmer-dashboard">
        <div className="dashboard-container">
          <p className="loading">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="farmer-dashboard">

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-brand">
          🌾 <span>DigitalKisan</span>
        </div>

        <div className="navbar-right">
          <button onClick={() => navigate("/farmer")}>
            Dashboard
          </button>
        </div>
      </nav>

      <main className="dashboard-container">

        <div className="page-heading">
          <div>
            <h1>Marketplace</h1>
            <p>
              Find buyers, processors and storage facilities
              for your harvested produce.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/farmer")}
          >
            ← Dashboard
          </button>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* BUYERS */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>🛒 Buyers</h2>
              <p>Buyers currently looking for produce</p>
            </div>
          </div>

          {buyers.length === 0 ? (
            <div className="empty-state">
              No available buyers found.
            </div>
          ) : (
            <div className="produce-cards">
              {buyers.map((buyer) => (
                <div
                  className="produce-detail-card"
                  key={buyer.id}
                >
                  <div className="produce-card-header">
                    <div className="crop-icon">🛒</div>

                    <div>
                      <h3>{buyer.buyerName}</h3>

                      <span className="status-badge available">
                        AVAILABLE
                      </span>
                    </div>
                  </div>

                  <div className="produce-info">
                    <p>
                      <strong>Crop:</strong>{" "}
                      {buyer.cropName}
                    </p>

                    <p>
                      <strong>Required:</strong>{" "}
                      {buyer.requiredQuantity}{" "}
                      {buyer.unit}
                    </p>

                    <p>
                      <strong>Grade:</strong>{" "}
                      {buyer.requiredGrade}
                    </p>

                    <p>
                      <strong>Offered Price:</strong>{" "}
                      ₹{buyer.offeredPrice} /{" "}
                      {buyer.unit}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {buyer.district}, {buyer.state}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {buyer.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PROCESSORS */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>🏭 Processors</h2>
              <p>Processing facilities available for your produce</p>
            </div>
          </div>

          {processors.length === 0 ? (
            <div className="empty-state">
              No available processors found.
            </div>
          ) : (
            <div className="produce-cards">
              {processors.map((processor) => (
                <div
                  className="produce-detail-card"
                  key={processor.id}
                >
                  <div className="produce-card-header">
                    <div className="crop-icon">🏭</div>

                    <div>
                      <h3>{processor.processorName}</h3>

                      <span className="status-badge available">
                        AVAILABLE
                      </span>
                    </div>
                  </div>

                  <div className="produce-info">
                    <p>
                      <strong>Processing:</strong>{" "}
                      {processor.processingType}
                    </p>

                    <p>
                      <strong>Supported Crops:</strong>{" "}
                      {processor.supportedCrops}
                    </p>

                    <p>
                      <strong>Capacity:</strong>{" "}
                      {processor.processingCapacity}{" "}
                      {processor.capacityUnit}
                    </p>

                    <p>
                      <strong>Processing Cost:</strong>{" "}
                      ₹{processor.processingCost} /{" "}
                      {processor.costUnit}
                    </p>

                    <p>
                      <strong>Processed Product Price:</strong>{" "}
                      ₹{processor.processedProductPrice}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {processor.district},{" "}
                      {processor.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STORAGE */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>❄️ Storage Facilities</h2>
              <p>Available storage facilities</p>
            </div>
          </div>

          {storage.length === 0 ? (
            <div className="empty-state">
              No available storage facilities found.
            </div>
          ) : (
            <div className="produce-cards">
              {storage.map((facility) => (
                <div
                  className="produce-detail-card"
                  key={facility.id}
                >
                  <div className="produce-card-header">
                    <div className="crop-icon">❄️</div>

                    <div>
                      <h3>{facility.storageName}</h3>

                      <span className="status-badge available">
                        AVAILABLE
                      </span>
                    </div>
                  </div>

                  <div className="produce-info">
                    <p>
                      <strong>Storage Type:</strong>{" "}
                      {facility.storageType}
                    </p>

                    <p>
                      <strong>Capacity:</strong>{" "}
                      {facility.storageCapacity}{" "}
                      {facility.capacityUnit}
                    </p>

                    <p>
                      <strong>Storage Cost:</strong>{" "}
                      ₹{facility.storageCost} /{" "}
                      {facility.costUnit}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {facility.district},{" "}
                      {facility.state}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {facility.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default Marketplace;