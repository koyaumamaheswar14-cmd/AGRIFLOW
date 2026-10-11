import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function RegisterProcessor() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    userId: user.userId || "",
    processorName: "",
    phone: "",
    processingType: "",
    supportedCrops: "",
    processingCapacity: "",
    capacityUnit: "KG_PER_DAY",
    processingCost: "",
    costUnit: "PER_KG",
    processedProductPrice: "",
    address: "",
    district: "",
    state: "",
    latitude: "",
    longitude: "",
    availability: "AVAILABLE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        userId: Number(form.userId),
        processingCapacity: Number(form.processingCapacity),
        processingCost: Number(form.processingCost),
        processedProductPrice: Number(form.processedProductPrice),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      console.log("PROCESSOR REQUEST:", payload);

      await api.post("/api/processors", payload);

      setSuccess("Processing facility registered successfully!");

      setTimeout(() => {
        navigate("/processor");
      }, 1200);
    } catch (err) {
      console.error("PROCESSOR REGISTER ERROR:", err);
      console.error("BACKEND RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Failed to register processing facility."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-page">

      <div className="page-heading">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/processor")}
          >
            ← Back
          </button>

          <h1>Register Processing Facility</h1>

          <p>
            Add your processing facility details and available capacity.
          </p>
        </div>
      </div>

      <div className="form-card">

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-field">
              <label>Processor / Facility Name</label>
              <input
                type="text"
                name="processorName"
                value={form.processorName}
                onChange={handleChange}
                placeholder="e.g. Sri Lakshmi Food Processing"
                required
              />
            </div>

            <div className="form-field">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-field">
              <label>Processing Type</label>
              <select
                name="processingType"
                value={form.processingType}
                onChange={handleChange}
                required
              >
                <option value="">Select processing type</option>
                <option value="TOMATO_PUREE">Tomato Puree</option>
                <option value="CHILLI_DRYING">Chilli Drying</option>
                <option value="GRAIN_CLEANING">Grain Cleaning</option>
                <option value="MILLING">Milling</option>
                <option value="PULVERIZING">Pulverizing</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Supported Crops</label>
              <input
                type="text"
                name="supportedCrops"
                value={form.supportedCrops}
                onChange={handleChange}
                placeholder="e.g. Tomato, Chilli"
                required
              />
            </div>

            <div className="form-field">
              <label>Processing Capacity</label>
              <input
                type="number"
                name="processingCapacity"
                value={form.processingCapacity}
                onChange={handleChange}
                placeholder="e.g. 5000"
                min="0"
                required
              />
            </div>

            <div className="form-field">
              <label>Capacity Unit</label>
              <select
                name="capacityUnit"
                value={form.capacityUnit}
                onChange={handleChange}
              >
                <option value="KG_PER_DAY">KG per Day</option>
                <option value="TON_PER_DAY">TON per Day</option>
              </select>
            </div>

            <div className="form-field">
              <label>Processing Cost</label>
              <input
                type="number"
                step="0.01"
                name="processingCost"
                value={form.processingCost}
                onChange={handleChange}
                placeholder="e.g. 8.50"
                min="0"
                required
              />
            </div>

            <div className="form-field">
              <label>Cost Unit</label>
              <select
                name="costUnit"
                value={form.costUnit}
                onChange={handleChange}
              >
                <option value="PER_KG">Per KG</option>
                <option value="PER_TON">Per TON</option>
              </select>
            </div>

            <div className="form-field">
              <label>Processed Product Price</label>
              <input
                type="number"
                step="0.01"
                name="processedProductPrice"
                value={form.processedProductPrice}
                onChange={handleChange}
                placeholder="e.g. 55"
                min="0"
                required
              />
            </div>

            <div className="form-field">
              <label>Availability</label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
              >
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>

            <div className="form-field form-field-full">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter facility address"
                required
              />
            </div>

            <div className="form-field">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="e.g. Guntur"
                required
              />
            </div>

            <div className="form-field">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. Andhra Pradesh"
                required
              />
            </div>

            <div className="form-field">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="e.g. 16.32"
              />
            </div>

            <div className="form-field">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="e.g. 80.45"
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/processor")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-action"
              disabled={loading}
            >
              {loading
                ? "Registering..."
                : "Register Facility"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default RegisterProcessor;