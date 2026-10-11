import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function RegisterStorage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    userId: user.userId || "",
    storageName: "",
    phone: "",
    storageType: "",
    storageCapacity: "",
    capacityUnit: "KG",
    storageCost: "",
    costUnit: "PER_KG",
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
        storageCapacity: Number(form.storageCapacity),
        storageCost: Number(form.storageCost),
        latitude: form.latitude
          ? Number(form.latitude)
          : null,
        longitude: form.longitude
          ? Number(form.longitude)
          : null,
      };

      console.log(
        "STORAGE REGISTRATION REQUEST:",
        payload
      );

      const response = await api.post(
        "/api/storage",
        payload
      );

      console.log(
        "STORAGE REGISTERED:",
        response.data
      );

      setSuccess(
        "Storage facility registered successfully!"
      );

      setTimeout(() => {
        navigate("/storage");
      }, 1200);

    } catch (err) {

      console.error(
        "STORAGE REGISTRATION ERROR:",
        err
      );

      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Failed to register storage facility."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-page">

      {/* HEADER */}
      <div className="page-heading">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/storage")
            }
          >
            ← Back
          </button>

          <h1>
            Register Storage Facility
          </h1>

          <p>
            Add your storage facility details,
            capacity and storage cost.
          </p>

        </div>

      </div>


      {/* FORM */}
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

            {/* STORAGE NAME */}
            <div className="form-field">

              <label>
                Storage Facility Name
              </label>

              <input
                type="text"
                name="storageName"
                value={form.storageName}
                onChange={handleChange}
                placeholder="e.g. Guntur Cold Storage"
                required
              />

            </div>


            {/* PHONE */}
            <div className="form-field">

              <label>
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

            </div>


            {/* STORAGE TYPE */}
            <div className="form-field">

              <label>
                Storage Type
              </label>

              <select
                name="storageType"
                value={form.storageType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select storage type
                </option>

                <option value="COLD_STORAGE">
                  Cold Storage
                </option>

                <option value="WAREHOUSE">
                  Warehouse
                </option>

                <option value="GRAIN_STORAGE">
                  Grain Storage
                </option>

                <option value="REFRIGERATED">
                  Refrigerated Storage
                </option>

                <option value="OPEN_STORAGE">
                  Open Storage
                </option>

                <option value="OTHER">
                  Other
                </option>

              </select>

            </div>


            {/* CAPACITY */}
            <div className="form-field">

              <label>
                Storage Capacity
              </label>

              <input
                type="number"
                name="storageCapacity"
                value={form.storageCapacity}
                onChange={handleChange}
                placeholder="e.g. 10000"
                min="0"
                required
              />

            </div>


            {/* CAPACITY UNIT */}
            <div className="form-field">

              <label>
                Capacity Unit
              </label>

              <select
                name="capacityUnit"
                value={form.capacityUnit}
                onChange={handleChange}
              >

                <option value="KG">
                  KG
                </option>

                <option value="TON">
                  TON
                </option>

              </select>

            </div>


            {/* STORAGE COST */}
            <div className="form-field">

              <label>
                Storage Cost
              </label>

              <input
                type="number"
                step="0.01"
                name="storageCost"
                value={form.storageCost}
                onChange={handleChange}
                placeholder="e.g. 2.50"
                min="0"
                required
              />

            </div>


            {/* COST UNIT */}
            <div className="form-field">

              <label>
                Cost Unit
              </label>

              <select
                name="costUnit"
                value={form.costUnit}
                onChange={handleChange}
              >

                <option value="PER_KG">
                  Per KG
                </option>

                <option value="PER_TON">
                  Per TON
                </option>

                <option value="PER_DAY">
                  Per Day
                </option>

              </select>

            </div>


            {/* AVAILABILITY */}
            <div className="form-field">

              <label>
                Availability
              </label>

              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
              >

                <option value="AVAILABLE">
                  Available
                </option>

                <option value="UNAVAILABLE">
                  Unavailable
                </option>

              </select>

            </div>


            {/* ADDRESS */}
            <div className="form-field form-field-full">

              <label>
                Address
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter storage facility address"
                required
              />

            </div>


            {/* DISTRICT */}
            <div className="form-field">

              <label>
                District
              </label>

              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="e.g. Guntur"
                required
              />

            </div>


            {/* STATE */}
            <div className="form-field">

              <label>
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. Andhra Pradesh"
                required
              />

            </div>


            {/* LATITUDE */}
            <div className="form-field">

              <label>
                Latitude
              </label>

              <input
                type="number"
                step="any"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="e.g. 16.32"
              />

            </div>


            {/* LONGITUDE */}
            <div className="form-field">

              <label>
                Longitude
              </label>

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


          {/* ACTIONS */}
          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/storage")
              }
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
                : "Register Storage"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default RegisterStorage;