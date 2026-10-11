import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ===============================
// AUTH
// ===============================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ===============================
// FARMER
// ===============================

import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import MyProduce from "./pages/farmer/MyProduce";
import AddProduce from "./pages/farmer/AddProduce";
import Marketplace from "./pages/farmer/Marketplace";
import Allocation from "./pages/farmer/Allocation";
import SoilTest from "./pages/farmer/SoilTest";
import Weather from "./pages/farmer/Weather";
import AllocationHistory from "./pages/farmer/AllocationHistory";
import FarmerRequests from "./pages/farmer/FarmerRequests";

// ===============================
// BUYER
// ===============================

import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import PostRequirement from "./pages/buyer/PostRequirement";
import BuyerAvailableProduce from "./pages/buyer/BuyerAvailableProduce";
import BuyerProduceDetails from "./pages/buyer/BuyerProduceDetails";

// ===============================
// PROCESSOR
// ===============================

import ProcessorDashboard from "./pages/processor/ProcessorDashboard";
import RegisterProcessor from "./pages/processor/RegisterProcessor";
import AvailableProduce from "./pages/processor/AvailableProduce";

// ===============================
// STORAGE
// ===============================

import StorageDashboard from "./pages/storage/StorageDashboard";
import RegisterStorage from "./pages/storage/RegisterStorage";
import StorageAvailableProduce from "./pages/storage/AvailableProduce";

// ===============================
// ADMIN
// ===============================

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFarmers from "./pages/admin/AdminFarmers";
import AdminBuyers from "./pages/admin/AdminBuyers";
import AdminProcessors from "./pages/admin/AdminProcessors";
import AdminStorage from "./pages/admin/AdminStorage";
import AdminProduce from "./pages/admin/AdminProduce";
import AdminSoilTests from "./pages/admin/AdminSoilTests";
import AdminAllocations from "./pages/admin/AdminAllocations";

import AdminProtectedRoute from "./components/AdminProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            ROOT
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ==================================================
            AUTH
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            FARMER
        ================================================== */}

        <Route
          path="/farmer"
          element={<FarmerDashboard />}
        />

        <Route
          path="/farmer/produce"
          element={<MyProduce />}
        />

        <Route
          path="/farmer/add-produce"
          element={<AddProduce />}
        />

        <Route
          path="/farmer/marketplace"
          element={<Marketplace />}
        />

        <Route
          path="/farmer/allocation"
          element={<Allocation />}
        />

        <Route
          path="/farmer/allocation-history"
          element={<AllocationHistory />}
        />

        <Route
          path="/farmer/soil"
          element={<SoilTest />}
        />

        <Route
          path="/farmer/weather"
          element={<Weather />}
        />

        {/* Incoming Buyer / Processor / Storage Requests */}

        <Route
          path="/farmer/requests"
          element={<FarmerRequests />}
        />


        {/* ==================================================
            BUYER
        ================================================== */}

        <Route
          path="/buyer"
          element={<BuyerDashboard />}
        />

        <Route
          path="/buyer/post-requirement"
          element={<PostRequirement />}
        />

        <Route
          path="/buyer/produce"
          element={<BuyerAvailableProduce />}
        />

        {/* Buyer Produce Details */}

        <Route
          path="/buyer/produce/:id"
          element={<BuyerProduceDetails />}
        />


        {/* ==================================================
            PROCESSOR
        ================================================== */}

        <Route
          path="/processor"
          element={<ProcessorDashboard />}
        />

        <Route
          path="/processor/register"
          element={<RegisterProcessor />}
        />

        <Route
          path="/processor/produce"
          element={<AvailableProduce />}
        />

        {/* 
          Same details page.
          It automatically detects PROCESSOR role
          and shows "Request Processing".
        */}

        <Route
          path="/processor/produce/:id"
          element={<BuyerProduceDetails />}
        />


        {/* ==================================================
            STORAGE
        ================================================== */}

        <Route
          path="/storage"
          element={<StorageDashboard />}
        />

        <Route
          path="/storage/register"
          element={<RegisterStorage />}
        />

        <Route
          path="/storage/produce"
          element={<StorageAvailableProduce />}
        />

        {/* 
          Same details page.
          It automatically detects STORAGE role
          and shows "Request Storage".
        */}

        <Route
          path="/storage/produce/:id"
          element={<BuyerProduceDetails />}
        />


        {/* ==================================================
            ADMIN
        ================================================== */}

        <Route element={<AdminProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/farmers"
            element={<AdminFarmers />}
          />

          <Route
            path="/admin/buyers"
            element={<AdminBuyers />}
          />

          <Route
            path="/admin/processors"
            element={<AdminProcessors />}
          />

          <Route
            path="/admin/storage"
            element={<AdminStorage />}
          />

          <Route
            path="/admin/produce"
            element={<AdminProduce />}
          />

          <Route
            path="/admin/soil-tests"
            element={<AdminSoilTests />}
          />

          <Route
            path="/admin/allocations"
            element={<AdminAllocations />}
          />

        </Route>


        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;