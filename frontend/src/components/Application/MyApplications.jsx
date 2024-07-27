import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModel";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint = user.role === "Employer"
          ? "http://localhost:4000/api/v1/application/employer/getall"
          : "http://localhost:4000/api/v1/application/jobseeker/getall";
    
        const res = await axios.get(endpoint, { withCredentials: true });
        console.log("Fetched Applications:", res.data); // Add this line
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    if (user) {
      fetchApplications();
    } else {
      navigateTo("/");
    }
  }, [user, isAuthorized, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setApplications((prevApplication) =>
        prevApplication.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const acceptApplication = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4000/api/v1/application/accept/${id}`, {}, { withCredentials: true });
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id ? { ...application, status: 'Approved' } : application
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  
  const rejectApplication = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4000/api/v1/application/reject/${id}`, {}, { withCredentials: true });
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id ? { ...application, status: 'Rejected' } : application
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length === 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                key={element._id}
                element={element}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length === 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <EmployerCard
                key={element._id}
                element={element}
                acceptApplication={acceptApplication}
                rejectApplication={rejectApplication}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;


const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  const getStatusColor = (status) => {
    if (status === "accepted") {
      return "green";
    } else if (status === "rejected") {
      return "red";
    } else {
      return "gray";
    }
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this application?");
    if (confirmed) {
      deleteApplication(id);
    }
  };

  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p><span>Name:</span> {element.name}</p>
          <p><span>Email:</span> {element.email}</p>
          <p><span>Phone:</span> {element.phone}</p>
          <p><span>Address:</span> {element.address}</p>
          <p><span>CoverLetter:</span> {element.coverLetter}</p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          <button
            onClick={() => handleDeleteClick(element._id)}
            style={{
              padding: "5px 10px",
              backgroundColor: "#ffcccc",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete Application
          </button>
        </div>
        <div
          style={{
            marginTop: "10px",
            padding: "5px",
            borderRadius: "5px",
            backgroundColor: getStatusColor(element.status),
            color: "white",
            textAlign: "center",
          }}
        >
          Status: {element.status}
        </div>
      </div>
    </>
  );
};


const EmployerCard = ({ element, openModal, acceptApplication, rejectApplication }) => {
  const [status, setStatus] = useState(element.status);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const handleAccept = () => {
    acceptApplication(element._id);
    setStatus("accepted");
    setButtonsDisabled(true);
  };

  const handleReject = () => {
    rejectApplication(element._id);
    setStatus("rejected");
    setButtonsDisabled(true);
  };

  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>
      <div className="resume">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
        />
      </div>
      <div className="actions" style={{ marginTop: "20px" }}>
        <button
          onClick={handleAccept}
          disabled={buttonsDisabled || status === "accepted"}
          style={{
            padding: "10px 20px",
            backgroundColor: buttonsDisabled || status === "accepted" ? "gray" : "green",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: buttonsDisabled || status === "accepted" ? "not-allowed" : "pointer",
            marginRight: "10px",
            opacity: buttonsDisabled || status === "accepted" ? 0.6 : 1,
          }}
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          disabled={buttonsDisabled || status === "rejected"}
          style={{
            padding: "10px 20px",
            backgroundColor: buttonsDisabled || status === "rejected" ? "gray" : "turquoise",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: buttonsDisabled || status === "rejected" ? "not-allowed" : "pointer",
            marginRight: "10px",
            opacity: buttonsDisabled || status === "rejected" ? 0.6 : 1,
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
