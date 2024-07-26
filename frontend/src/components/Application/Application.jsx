import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      toast.success("Application has been submitted successfully!");
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", padding: "20px", maxWidth: "600px", width: "100%" }}>
        <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Application Form</h3>
        <form onSubmit={handleApplication} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "10px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: "10px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ padding: "10px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            style={{ padding: "10px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "4px", height: "100px" }}
          />
          <div style={{ marginBottom: "15px" }}>
            <label style={{ textAlign: "start", display: "block", fontSize: "16px", marginBottom: "5px" }}>
              Select Resume
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              display: 'inline-block',
              backgroundColor: 'white',
              color: 'turquoise',
              border: '2px solid turquoise',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
              marginTop: '20px',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#40E0D0";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "turquoise";
            }}
          >
            Send Application
          </button>
          
        </form>
      </div>
    </section>
  );
};

export default Application;
