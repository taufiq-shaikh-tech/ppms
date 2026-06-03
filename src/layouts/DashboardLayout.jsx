// src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FloatingHealthChatbot from "../components/FloatingHealthChatbot";

export default function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </div>

      {/* Floating demo health chatbot – bottom right */}
      <FloatingHealthChatbot />
    </div>
  );
}