import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    farmers: 0,
    buyers: 0,
    processors: 0,
    storage: 0,
    produce: 0,
    allocations: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        farmers,
        buyers,
        processors,
        storage,
        produce,
        allocations,
      ] = await Promise.all([
        api.get("/api/farmers"),
        api.get("/api/buyers"),
        api.get("/api/processors"),
        api.get("/api/storage"),
        api.get("/api/produce"),
        api.get("/api/allocations"),
      ]);

      setStats({
        farmers: Array.isArray(farmers.data)
          ? farmers.data.length
          : 0,

        buyers: Array.isArray(buyers.data)
          ? buyers.data.length
          : 0,

        processors: Array.isArray(processors.data)
          ? processors.data.length
          : 0,

        storage: Array.isArray(storage.data)
          ? storage.data.length
          : 0,

        produce: Array.isArray(produce.data)
          ? produce.data.length
          : 0,

        allocations: Array.isArray(allocations.data)
          ? allocations.data.length
          : allocations.data?.allocations?.length || 0,
      });
    } catch (err) {
      console.error("ADMIN STATS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: "📊",
      path: "/admin",
    },
    {
      label: "Farmers",
      icon: "👨‍🌾",
      path: "/admin/farmers",
    },
    {
      label: "Buyers",
      icon: "🛒",
      path: "/admin/buyers",
    },
    {
      label: "Processors",
      icon: "🏭",
      path: "/admin/processors",
    },
    {
      label: "Storage",
      icon: "🏢",
      path: "/admin/storage",
    },
    {
      label: "Produce",
      icon: "🌾",
      path: "/admin/produce",
    },
    {
      label: "Soil Tests",
      icon: "🧪",
      path: "/admin/soil-tests",
    },
    {
      label: "Allocations",
      icon: "📋",
      path: "/admin/allocations",
    },
  ];

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-icon">
            🌱
          </div>

          <div>
            <h2>DigitalKisan</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-navigation">

          {menuItems.map((item) => (
            <button
              key={item.path}
              className={
                item.path === "/admin"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() => navigate(item.path)}
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          ))}

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-user">

            <div className="admin-avatar">
              👤
            </div>

            <div>
              <strong>
                {user.name || "Administrator"}
              </strong>

              <span>
                {user.email || "Admin"}
              </span>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back,{" "}
              {user.name || "Administrator"}.
              Here's what's happening on DigitalKisan.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadStats}
          >
            ↻ Refresh
          </button>

        </header>

        {loading && (
          <div className="admin-loading">
            Loading dashboard...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>

            {/* STAT CARDS */}

            <section className="admin-stats-grid">

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  👨‍🌾
                </div>

                <div>
                  <span>Farmers</span>
                  <strong>{stats.farmers}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  🛒
                </div>

                <div>
                  <span>Buyers</span>
                  <strong>{stats.buyers}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  🏭
                </div>

                <div>
                  <span>Processors</span>
                  <strong>{stats.processors}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  🏢
                </div>

                <div>
                  <span>Storage</span>
                  <strong>{stats.storage}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  🌾
                </div>

                <div>
                  <span>Produce</span>
                  <strong>{stats.produce}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  📋
                </div>

                <div>
                  <span>Allocations</span>
                  <strong>{stats.allocations}</strong>
                </div>
              </div>

            </section>

            {/* QUICK ACCESS */}

            <section className="admin-section">

              <div className="admin-section-heading">
                <div>
                  <h2>Quick Access</h2>
                  <p>
                    Manage the major areas of the platform.
                  </p>
                </div>
              </div>

              <div className="admin-quick-grid">

                {menuItems.slice(1).map((item) => (
                  <button
                    key={item.path}
                    className="admin-quick-card"
                    onClick={() =>
                      navigate(item.path)
                    }
                  >
                    <span>
                      {item.icon}
                    </span>

                    <strong>
                      {item.label}
                    </strong>

                    <small>
                      View and manage
                    </small>

                    <b>→</b>
                  </button>
                ))}

              </div>

            </section>

            {/* PLATFORM STATUS */}

            <section className="admin-section">

              <div className="admin-section-heading">

                <div>
                  <h2>Platform Status</h2>
                  <p>
                    Current DigitalKisan system overview.
                  </p>
                </div>

              </div>

              <div className="admin-status-grid">

                <div className="admin-status-item">
                  <span className="admin-status-dot"></span>
                  <div>
                    <strong>
                      Authentication
                    </strong>
                    <p>Operational</p>
                  </div>
                </div>

                <div className="admin-status-item">
                  <span className="admin-status-dot"></span>
                  <div>
                    <strong>
                      Produce Management
                    </strong>
                    <p>Operational</p>
                  </div>
                </div>

                <div className="admin-status-item">
                  <span className="admin-status-dot"></span>
                  <div>
                    <strong>
                      Allocation Engine
                    </strong>
                    <p>Operational</p>
                  </div>
                </div>

                <div className="admin-status-item">
                  <span className="admin-status-dot"></span>
                  <div>
                    <strong>
                      Marketplace
                    </strong>
                    <p>Operational</p>
                  </div>
                </div>

              </div>

            </section>

          </>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;