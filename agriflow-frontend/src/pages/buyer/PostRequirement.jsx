import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function PostRequirement() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const buyerId = user.userId;

  const [formData, setFormData] = useState({
    userId: buyerId || "",
    buyerName: user.name || "",
    phone: "",
    cropName: "",
    requiredQuantity: "",
    unit: "KG",
    requiredGrade: "A",
    offeredPrice: "",
    address: "",
    district: "",
    state: "",
    latitude: "",
    longitude: "",
    availability: "AVAILABLE",
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((previous) => ({
          ...previous,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));

        setLocationLoading(false);
      },
      (err) => {
        console.error("LOCATION ERROR:", err);

        setError(
          "Unable to get your location. Please enter coordinates manually."
        );

        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        userId: Number(buyerId),
        buyerName: formData.buyerName.trim(),
        phone: formData.phone.trim(),
        cropName: formData.cropName.trim(),
        requiredQuantity: Number(
          formData.requiredQuantity
        ),
        unit: formData.unit,
        requiredGrade: formData.requiredGrade,
        offeredPrice: Number(formData.offeredPrice),
        address: formData.address.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        latitude:
          formData.latitude === ""
            ? null
            : Number(formData.latitude),
        longitude:
          formData.longitude === ""
            ? null
            : Number(formData.longitude),
        availability: formData.availability,
      };

      console.log("POST REQUIREMENT REQUEST:", payload);

      const response = await api.post(
        "/api/buyers",
        payload
      );

      console.log(
        "POST REQUIREMENT RESPONSE:",
        response.data
      );

      setSuccess(
        "Buying requirement posted successfully!"
      );

      setTimeout(() => {
        navigate("/buyer");
      }, 1200);
    } catch (err) {
      console.error("POST REQUIREMENT ERROR:", err);
      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to post requirement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-dashboard">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          🛒 <span>DigitalKisan</span>
        </div>

        <div className="navbar-right">

          <button
            onClick={() => navigate("/buyer")}
          >
            Dashboard
          </button>

        </div>

      </nav>

      <main className="dashboard-container">

        {/* Heading */}
        <div className="page-heading">

          <div>
            <h1>Post Buying Requirement</h1>

            <p>
              Tell farmers what produce you are
              looking to purchase.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/buyer")}
          >
            ← Dashboard
          </button>

        </div>

        {/* Messages */}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* Form */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>📋 Requirement Details</h2>

              <p>
                Enter the produce you need and your
                buying terms.
              </p>
            </div>

          </div>

          <div className="form-card">

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* Buyer Name */}
                <div className="form-field">
                  <label>Buyer Name</label>

                  <input
                    type="text"
                    name="buyerName"
                    placeholder="Enter buyer/company name"
                    value={formData.buyerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-field">
                  <label>Phone</label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Crop */}
                <div className="form-field">
                  <label>Crop</label>

                  <input
                    type="text"
                    name="cropName"
                    placeholder="Example: Tomato"
                    value={formData.cropName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="form-field">
                  <label>Required Quantity</label>

                  <input
                    type="number"
                    name="requiredQuantity"
                    placeholder="Example: 500"
                    min="0.01"
                    step="0.01"
                    value={formData.requiredQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Unit */}
                <div className="form-field">
                  <label>Unit</label>

                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="KG">KG</option>
                    <option value="TON">TON</option>
                    <option value="QUINTAL">
                      QUINTAL
                    </option>
                  </select>
                </div>

                {/* Grade */}
                <div className="form-field">
                  <label>Required Grade</label>

                  <select
                    name="requiredGrade"
                    value={formData.requiredGrade}
                    onChange={handleChange}
                  >
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>

                {/* Price */}
                <div className="form-field">
                  <label>Offered Price</label>

                  <input
                    type="number"
                    name="offeredPrice"
                    placeholder="Example: 50"
                    min="0"
                    step="0.01"
                    value={formData.offeredPrice}
                    onChange={handleChange}
                    required
                  />

                  <small>
                    Price per selected unit
                  </small>
                </div>

                {/* Availability */}
                <div className="form-field">
                  <label>Availability</label>

                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                  >
                    <option value="AVAILABLE">
                      AVAILABLE
                    </option>

                    <option value="UNAVAILABLE">
                      UNAVAILABLE
                    </option>
                  </select>
                </div>

                {/* Address */}
                <div className="form-field form-field-full">
                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Market / company address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* District */}
                <div className="form-field">
                  <label>District</label>

                  <input
                    type="text"
                    name="district"
                    placeholder="Enter district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* State */}
                <div className="form-field">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Latitude */}
                <div className="form-field">
                  <label>Latitude</label>

                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Example: 16.3067"
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>

                {/* Longitude */}
                <div className="form-field">
                  <label>Longitude</label>

                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="Example: 80.4365"
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* Location */}
              <div className="location-action">

                <button
                  type="button"
                  className="back-button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading
                    ? "Getting Location..."
                    : "📍 Use My Current Location"}
                </button>

              </div>

              {/* Actions */}
              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate("/buyer")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-action"
                  disabled={loading}
                >
                  {loading
                    ? "Posting..."
                    : "Post Requirement"}
                </button>

              </div>

            </form>

          </div>

        </section>

      </main>
    </div>
  );
}

export default PostRequirement;