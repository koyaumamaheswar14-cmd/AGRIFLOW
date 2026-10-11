import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AddProduce() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [formData, setFormData] = useState({
    farmerId: user.userId || "",
    cropName: "",
    quantity: "",
    unit: "KG",
    grade: "A",
    harvestDate: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        farmerId: Number(formData.farmerId),

        cropName: formData.cropName,

        quantity: Number(formData.quantity),

        unit: formData.unit,

        grade: formData.grade,

        harvestDate: formData.harvestDate,

        latitude: formData.latitude
          ? Number(formData.latitude)
          : null,

        longitude: formData.longitude
          ? Number(formData.longitude)
          : null,

        imageUrl: formData.imageUrl || null,
      };

      console.log("PRODUCE REQUEST:", payload);

      const response = await api.post(
        "/api/produce",
        payload
      );

      console.log(
        "PRODUCE RESPONSE:",
        response.data
      );

      setSuccess(
        "Harvest registered successfully!"
      );

      setTimeout(() => {
        navigate("/farmer/produce");
      }, 1200);

    } catch (err) {
      console.error(
        "ADD PRODUCE ERROR:",
        err
      );

      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        "Unable to register produce."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmer-dashboard">

      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          🌾 DigitalKisan
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/farmer")}
        >
          ← Dashboard
        </button>

      </nav>

      <main className="dashboard-container">

        <div className="page-heading">

          <div>
            <h1>Register Harvest</h1>

            <p>
              Add details about your harvested produce.
            </p>
          </div>

        </div>

        <div className="form-card">

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-field">

                <label>Crop Name</label>

                <input
                  type="text"
                  name="cropName"
                  placeholder="Example: Tomato"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-field">

                <label>Quantity</label>

                <input
                  type="number"
                  name="quantity"
                  placeholder="Example: 2000"
                  min="0.01"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-field">

                <label>Unit</label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="KG">Kilograms (KG)</option>
                  <option value="TON">Tonnes</option>
                  <option value="QUINTAL">Quintal</option>
                </select>

              </div>


              <div className="form-field">

                <label>Quality Grade</label>

                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                >
                  <option value="A">
                    Grade A - Premium
                  </option>

                  <option value="B">
                    Grade B - Standard
                  </option>

                  <option value="C">
                    Grade C - Lower Grade
                  </option>
                </select>

              </div>


              <div className="form-field">

                <label>Harvest Date</label>

                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-field">

                <label>Image URL (Optional)</label>

                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Optional image URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />

              </div>


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

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/farmer/produce")
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
                  : "Register Harvest"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AddProduce;