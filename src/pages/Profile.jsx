import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: "+91 98765 43210",
    age: 28,
    gender: "Male",
    bloodGroup: "B+",
    address: "Ward No. 4, Latur, Maharashtra, India",
    allergies: "No known drug allergies",
    conditions: "Mild hypertension",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Backend aane ke baad yahan profile update API call karenge [web:126][web:127][web:130].
    alert("Profile changes saved (frontend demo, email not editable).");
  };

  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle">
        View and update your personal details. Email address is fixed.
      </p>

      <form onSubmit={handleSave}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr",
            gap: "16px",
          }}
        >
          {/* Left: avatar + basic contact */}
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

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Address
              <textarea
                name="address"
                value={profile.address}
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

          {/* Right: medical details */}
          <div className="section">
            <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
              Medical details
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <label style={{ fontSize: "13px" }}>
                Age
                <input
                  name="age"
                  type="number"
                  value={profile.age}
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

              <label style={{ fontSize: "13px" }}>
                Gender
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    marginTop: "4px",
                    padding: "7px 10px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    fontSize: "13px",
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label style={{ fontSize: "13px" }}>
                Blood group
                <input
                  name="bloodGroup"
                  value={profile.bloodGroup}
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

            <label
              style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}
            >
              Existing conditions
              <textarea
                name="conditions"
                value={profile.conditions}
                onChange={handleChange}
                rows={2}
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
              Allergies
              <textarea
                name="allergies"
                value={profile.allergies}
                onChange={handleChange}
                rows={2}
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