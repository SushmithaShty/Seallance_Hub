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

  return (
    <div className="myJobs-page" style={{ padding: "20px" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <div className="jobs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {myJobs.map((job) => (
              <div key={job._id} className="job-card" style={{ backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
                <div className="job-details" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>Title:</span>
                    <input
                      type="text"
                      value={job.title}
                      disabled={editingMode !== job._id}
                      onChange={(e) =>
                        handleInputChange(job._id, "title", e.target.value)
                      }
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>Country:</span>
                    <input
                      type="text"
                      value={job.country}
                      disabled={editingMode !== job._id}
                      onChange={(e) =>
                        handleInputChange(job._id, "country", e.target.value)
                      }
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>City:</span>
                    <input
                      type="text"
                      value={job.city}
                      disabled={editingMode !== job._id}
                      onChange={(e) =>
                        handleInputChange(job._id, "city", e.target.value)
                      }
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>Category:</span>
                    <select
                      value={job.category}
                      disabled={editingMode !== job._id}
                      onChange={(e) =>
                        handleInputChange(job._id, "category", e.target.value)
                      }
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                      <option value="Graphics & Design">Graphics & Design</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="Frontend Web Development">Frontend Web Development</option>
                      <option value="MERN Stack Development">MERN Stack Development</option>
                      <option value="Account & Finance">Account & Finance</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Video Animation">Video Animation</option>
                      <option value="MEAN Stack Development">MEAN Stack Development</option>
                      <option value="MEVN Stack Development">MEVN Stack Development</option>
                      <option value="Data Entry Operator">Data Entry Operator</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>Salary:</span>
                    {job.fixedSalary ? (
                      <input
                        type="number"
                        value={job.fixedSalary}
                        disabled={editingMode !== job._id}
                        onChange={(e) =>
                          handleInputChange(job._id, "fixedSalary", e.target.value)
                        }
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    ) : (
                      <>
                        <input
                          type="number"
                          value={job.salaryFrom}
                          disabled={editingMode !== job._id}
                          onChange={(e) =>
                            handleInputChange(job._id, "salaryFrom", e.target.value)
                          }
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}
                        />
                        <input
                          type="number"
                          value={job.salaryTo}
                          disabled={editingMode !== job._id}
                          onChange={(e) =>
                            handleInputChange(job._id, "salaryTo", e.target.value)
                          }
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                      </>
                    )}
                  </div>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>Expired:</span>
                    <select
                      value={job.expired}
                      disabled={editingMode !== job._id}
                      onChange={(e) =>
                        handleInputChange(job._id, "expired", e.target.value)
                      }
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                      <option value={true}>TRUE</option>
                      <option value={false}>FALSE</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>Description:</span>
                    <textarea
                      rows={5}
                      value={job.description}
                      disabled={editingMode !== job._id}
                      onChange={(e) =>
                        handleInputChange(job._id, "description", e.target.value)
                      }
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: "10px" }}>
                    <span>Location:</span>
                    <textarea
                      rows={5}
                      value={job.location}
                      disabled={editingMode !== job._id}
                      onChange={(e) =>
                        handleInputChange(job._id, "location", e.target.value)
                      }
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                  
                </div>
                <div className="job-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  {editingMode === job._id ? (
                    <>
                      <button
                        onClick={() => handleUpdateJob(job._id)}
                        className="btn btn-success"
                        style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderRadius: "4px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        <FaCheck style={{ marginRight: "5px" }} />
                        Update
                      </button>
                      <button
                        onClick={handleDisableEdit}
                        className="btn btn-danger"
                        style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderRadius: "4px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        <RiCloseLine style={{ marginRight: "5px" }} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEnableEdit(job._id)}
                        className="btn btn-primary"
                        style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderRadius: "4px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="btn btn-danger"
                        style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderRadius: "4px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}
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
          <p>No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
