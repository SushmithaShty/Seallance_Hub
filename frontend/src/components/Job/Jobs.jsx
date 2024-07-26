import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { FaSearch } from "react-icons/fa";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const filteredJobs = jobs.jobs
    ? jobs.jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <section className="jobs page">
      <div className="container" style={{ textAlign: "center" }}>
        <h1>ALL AVAILABLE JOBS</h1>
        <div style={{ position: "relative", width: "400px", margin: "0 auto 20px" }}>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 40px 10px 10px", // Adjust padding to make space for the icon
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: "100%",
              outline: "none",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
          />
          <FaSearch style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "turquoise", fontSize: "16px" }} />
        </div>
        <div className="banner" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {filteredJobs.map((element) => {
            return (
              <div
                className="card"
                key={element._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "20px",
                  width: "300px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>{element.title}</p>
                <p style={{ color: "#555" }}>{element.category}</p>
                <p style={{ color: "#888" }}>{element.country}</p>
                <Link to={`/job/${element._id}`} style={{ textDecoration: "none", color: "#007bff" }}>
                  Job Details
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
