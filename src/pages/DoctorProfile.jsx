import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function DoctorProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "Dr. Neha Sharma",
    email: user?.email || "neha@example.com",
    phone: "+91 98765 00000",
    specialization: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    experience: "8 years",
    hospital: "Sun Fibo Multispeciality Hospital",
    about:
      "Experienced cardiologist focusing on preventive cardiology and long-term patient care.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Backend ke baad yahan doctor profile update API call hoga [web:126][web:127].
    alert("Doctor profile saved (frontend demo).");
  };

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">
        Update your professional information. Email address is fixed.
      </p>

      <form onSubmit={handleSave}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr",
            gap: "16px",
          }}
        >
          {/* Left: avatar + contact */}
          <div className="section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "#e0ecff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#0f66d1",
                }}
              >
                {profile.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                  {profile.name}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {profile.email}
                </div>
              </div>
            </div>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Full name
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Email (not editable)
              <input
                name="email"
                value={profile.email}
                readOnly
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                  backgroundColor: "#f9fafb",
                  color: "#6b7280",
                }}
              />
            </label>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Phone
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>
          </div>

          {/* Right: professional info */}
          <div className="section">
            <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
              Professional details
            </h3>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Specialization
              <input
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Qualification
              <input
                name="qualification"
                value={profile.qualification}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Experience
              <input
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Hospital / Clinic
              <input
                name="hospital"
                value={profile.hospital}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              About
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows={3}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>
          </div>
        </div>

        <div style={{ marginTop: "12px", textAlign: "right" }}>
          <button
            type="submit"
            style={{
              padding: "9px 18px",
              borderRadius: "999px",
              border: "none",
              background: "linear-gradient(90deg,#0f66d1,#1d4ed8)",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}