import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import MyBookings from "./pages/MyBookings";
import FreelancerDashboard from "./pages/FreelancerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* AUTHENTICATION */}

      <Route
  path="/"
  element={<Home />}
/>

<Route
  path="/login"
  element={<Login />}
/>

        <Route
          path="/register"
          element={<Register />}
        />


        {/* CLIENT */}

        <Route
          path="/client"
          element={
            <ProtectedRoute
              allowedRoles={["client"]}
            >
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/bookings"
          element={
            <ProtectedRoute
              allowedRoles={["client"]}
            >
              <MyBookings />
            </ProtectedRoute>
          }
        />


        {/* FREELANCER */}

        <Route
          path="/freelancer"
          element={
            <ProtectedRoute
              allowedRoles={["freelancer"]}
            >
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;