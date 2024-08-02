import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const { user, isAuthorized, setIsAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      axios.get("http://localhost:4000/api/v1/user/getuser", {
        withCredentials: true,
      })
      .then((response) => {
        const { name, email, phone } = response.data.user;
        setName(name);
        setEmail(email);
        setPhone(phone);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    }
  }, [isAuthorized]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);

      const { data } = await axios.put(
        "http://localhost:4000/api/v1/user/updateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setLoading(false);
      setPassword(""); // Clear the password fields after update
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <section style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Update Profile</h1>
        <form onSubmit={handleUpdate}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="name" style={{ width: "120px" }}>Name:</label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="email" style={{ width: "120px" }}>Email:</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="phone" style={{ width: "120px" }}>Phone:</label>
              <input
                id="phone"
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="password" style={{ width: "120px" }}>New Password:</label>
              <input
                id="password"
                type="password"
                placeholder="New Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="confirmPassword" style={{ width: "120px" }}>Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => navigateTo("/")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Home
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "turquoise",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileUpdate;
