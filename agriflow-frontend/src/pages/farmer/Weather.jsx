import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Weather() {
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationLoading(false);
      },
      (err) => {
        console.error("LOCATION ERROR:", err);

        setError(
          "Unable to get your location. Please enter latitude and longitude manually."
        );

        setLocationLoading(false);
      }
    );
  };

  const getWeather = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setError("Please enter latitude and longitude.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const response = await api.get("/api/weather", {
        params: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
      });

      console.log("WEATHER RESPONSE:", response.data);

      setWeather(response.data);
    } catch (err) {
      console.error("WEATHER ERROR:", err);
      console.error(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to fetch weather information."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAdvisoryClass = (advisory) => {
    if (!advisory) return "weather-advisory";

    const value = String(advisory).toLowerCase();

    if (
      value.includes("unfavorable") ||
      value.includes("not favorable") ||
      value.includes("avoid")
    ) {
      return "weather-advisory unfavorable";
    }

    return "weather-advisory favorable";
  };

  const findValue = (...keys) => {
    if (!weather) return null;

    for (const key of keys) {
      if (
        weather[key] !== undefined &&
        weather[key] !== null
      ) {
        return weather[key];
      }
    }

    return null;
  };

  const temperature = findValue(
    "temperature",
    "temp"
  );

  const humidity = findValue("humidity");

  const windSpeed = findValue(
    "windSpeed",
    "wind_speed"
  );

  const rainfallProbability = findValue(
    "rainfallProbability",
    "rainProbability",
    "rainfall",
    "rain"
  );

  const condition = findValue(
    "condition",
    "weatherCondition",
    "description"
  );

  const advisory = findValue(
    "advisory",
    "sprayingAdvisory",
    "sprayAdvisory",
    "recommendation"
  );

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

        {/* Header */}
        <div className="page-heading">
          <div>
            <h1>Weather Advisory</h1>
            <p>
              Check weather conditions before performing
              agricultural activities such as spraying.
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

        {/* Location Form */}
        <section className="dashboard-section">

          <div className="section-header">
            <div>
              <h2>📍 Farm Location</h2>
              <p>
                Enter your farm coordinates to get the
                latest weather advisory.
              </p>
            </div>
          </div>

          <div className="form-card">

            <form onSubmit={getWeather}>

              <div className="form-grid">

                <div className="form-field">
                  <label>Latitude</label>

                  <input
                    type="number"
                    step="any"
                    placeholder="Example: 16.3067"
                    value={latitude}
                    onChange={(e) =>
                      setLatitude(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Longitude</label>

                  <input
                    type="number"
                    step="any"
                    placeholder="Example: 80.4365"
                    value={longitude}
                    onChange={(e) =>
                      setLongitude(e.target.value)
                    }
                    required
                  />
                </div>

              </div>

              <div className="form-actions">

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

                <button
                  type="submit"
                  className="primary-action"
                  disabled={loading}
                >
                  {loading
                    ? "Checking Weather..."
                    : "🌦️ Check Weather"}
                </button>

              </div>

            </form>

          </div>
        </section>

        {/* Weather Result */}
        {weather && (
          <section className="dashboard-section">

            <div className="section-header">
              <div>
                <h2>🌤️ Current Weather</h2>
                <p>
                  Weather information for your selected
                  farm location.
                </p>
              </div>
            </div>

            <div className="weather-grid">

              <div className="weather-card">
                <div className="weather-icon">
                  🌡️
                </div>

                <span>Temperature</span>

                <strong>
                  {temperature !== null
                    ? `${temperature} °C`
                    : "N/A"}
                </strong>
              </div>

              <div className="weather-card">
                <div className="weather-icon">
                  💧
                </div>

                <span>Humidity</span>

                <strong>
                  {humidity !== null
                    ? `${humidity}%`
                    : "N/A"}
                </strong>
              </div>

              <div className="weather-card">
                <div className="weather-icon">
                  💨
                </div>

                <span>Wind Speed</span>

                <strong>
                  {windSpeed !== null
                    ? `${windSpeed} km/h`
                    : "N/A"}
                </strong>
              </div>

              <div className="weather-card">
                <div className="weather-icon">
                  🌧️
                </div>

                <span>Rainfall Probability</span>

                <strong>
                  {rainfallProbability !== null
                    ? `${rainfallProbability}%`
                    : "N/A"}
                </strong>
              </div>

            </div>

            {/* Condition */}
            {condition && (
              <div className="weather-condition">
                <span>Current Condition</span>
                <strong>{condition}</strong>
              </div>
            )}

            {/* Advisory */}
            <div
              className={getAdvisoryClass(advisory)}
            >
              <div className="advisory-icon">
                {String(advisory || "")
                  .toLowerCase()
                  .includes("unfavorable")
                  ? "⚠️"
                  : "✅"}
              </div>

              <div>
                <h3>Spraying Advisory</h3>

                <p>
                  {advisory ||
                    "Weather advisory information received from the weather service."}
                </p>
              </div>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default Weather;