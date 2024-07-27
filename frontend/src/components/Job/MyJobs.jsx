import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo, user]);

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");

    if (confirmDelete) {
      try {
        const res = await axios.delete(
          `http://localhost:4000/api/v1/job/delete/${jobId}`,
          { withCredentials: true }
        );
        toast.success(res.data.message);
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  // Define common styles
  const inputBoxStyles = {
    position: "relative",
    marginBottom: "15px"  // Reduced margin bottom
  };

  const inputStyles = {
    width: "100%",
    padding: "6px",       // Reduced padding
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #333", // Thinner border
    outline: "none",
    color: "#333",
    fontSize: "14px"      // Smaller font size
  };

  const labelStyles = {
    position: "absolute",
    top: "50%",
    left: "10px",
    color: "#aaa",
    pointerEvents: "none",
    transform: "translateY(-50%)",
    transition: "0.5s"
  };

  return (
    <div className="myJobs-page" style={{ padding: "20px" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <div className="jobs-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {myJobs.map((job) => (
              <div key={job._id} className="job-card" style={{ backgroundColor: "#ffffff", padding: "15px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "100%" }}>
                <div className="job-details" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="fields-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                    {['title', 'country', 'city', 'category', 'fixedSalary', 'salaryFrom', 'salaryTo', 'expired', 'description', 'location'].map((field, index) => (
                      <div key={index} className="field" style={inputBoxStyles}>
                        <span style={{ marginBottom: "5px", display: "block" }}>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                        {['fixedSalary', 'salaryFrom', 'salaryTo'].includes(field) ? (
                          <input
                            type="number"
                            value={job[field] || ''}
                            disabled={editingMode !== job._id}
                            onChange={(e) =>
                              handleInputChange(job._id, field, e.target.value)
                            }
                            style={inputStyles}
                          />
                        ) : field === 'expired' ? (
                          <select
                            value={job[field]}
                            disabled={editingMode !== job._id}
                            onChange={(e) =>
                              handleInputChange(job._id, field, e.target.value)
                            }
                            style={{ ...inputStyles, border: "1px solid #ccc", padding: "4px" }}  // Reduced padding
                          >
                            <option value={true}>TRUE</option>
                            <option value={false}>FALSE</option>
                          </select>
                        ) : field === 'description' || field === 'location' ? (
                          <textarea
                            rows={2}      // Reduced rows
                            value={job[field]}
                            disabled={editingMode !== job._id}
                            onChange={(e) =>
                              handleInputChange(job._id, field, e.target.value)
                            }
                            style={{ ...inputStyles, border: "1px solid #ccc", padding: "4px" }}  // Reduced padding
                          />
                        ) : (
                          <input
                            type="text"
                            value={job[field] || ''}
                            disabled={editingMode !== job._id}
                            onChange={(e) =>
                              handleInputChange(job._id, field, e.target.value)
                            }
                            style={inputStyles}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="job-actions" style={{ marginTop: "15px", textAlign: "right" }}>
                  {editingMode === job._id ? (
                    <>
                      <button
                        className="btn-save"
                        onClick={() => handleUpdateJob(job._id)}
                        style={{ padding: "8px 16px", backgroundColor: "#4caf50", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" }}  // Reduced padding
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={handleDisableEdit}
                        style={{ padding: "8px 16px", backgroundColor: "#f44336", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer" }}  // Reduced padding
                      >
                        <RiCloseLine />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => handleEnableEdit(job._id)}
                        style={{ padding: "8px 16px", backgroundColor: "#2196f3", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" }}  // Reduced padding
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteJob(job._id)}
                        style={{ padding: "8px 16px", backgroundColor: "#f44336", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer" }}  // Reduced padding
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
