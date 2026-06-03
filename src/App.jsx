import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PatientMessages from "./pages/PatientMessages";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorPatientDetail from "./pages/DoctorPatientDetail";
import DoctorAppointments from "./pages/DoctorAppointments";
import AdminDashboard from "./pages/AdminDashboard";

import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Appointments from "./pages/Appointments";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorProfile from "./pages/DoctorProfile";
import PatientComplaints from "./pages/PatientComplaints";

// ✅ new imports
import DoctorMessages from "./pages/DoctorMessages";
import AdminMessages from "./pages/AdminMessages";

function App() {
  return (
    <Routes>
      {/* Public routes without dashboard layout */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PATIENT layout – sidebar + topbar via DashboardLayout */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route path="/patient" element={<DashboardLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reports" element={<Reports />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="messages" element={<PatientMessages />} />
          <Route path="complaints" element={<PatientComplaints />} />
        </Route>
      </Route>

      {/* DOCTOR layout */}
      <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        <Route path="/doctor" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patient/:id" element={<DoctorPatientDetail />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="profile" element={<DoctorProfile />} />
          {/* ✅ new */}
          <Route path="messages" element={<DoctorMessages />} />
        </Route>
      </Route>

      {/* ADMIN layout */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* ✅ new */}
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;