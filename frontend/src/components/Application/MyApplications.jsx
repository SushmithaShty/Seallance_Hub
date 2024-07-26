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
    console.log("hello...")
    try {
      console.log(id)
      const res = await axios.put(`http://localhost:4000/api/v1/application/accept/${id}`,{} ,{ withCredentials: true });
      console.log(res)
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id ? { ...application, status: 'Approved' } : application
        )
      );
    } catch (error) {
      console.log("hello...")
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
  // Function to determine the status color based on the application status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
        <div
          style={{
            marginTop: '10px',
            padding: '5px',
            borderRadius: '5px',
            backgroundColor: getStatusColor(element.status),
            color: 'white',
            textAlign: 'center',
          }}
        >
          Status: {element.status}
        </div>
      </div>
    </>
  );
};



const EmployerCard = ({ element, openModal, rejectApplication }) => {
  const [status, setStatus] = useState(element.status); // Assuming `status` field in your data
  const [buttonsDisabled, setButtonsDisabled] = useState(false);


   const acceptApplication = async (id) => {
    console.log("CLICKED.......");
    console.log(id);

    try {
      const res = await axios.put(`http://localhost:4000/api/v1/application/accept/${id}`, {}, { withCredentials: true });
      console.log(res)
      console.log("Accept Response:", res.data); // Add this line
  
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id ? { ...application, status: 'Approved' } : application
        )
      );
    } catch (error) {
      console.error("Accept Application Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleAccept = () => {
    console.log("CLICKED..")
    acceptApplication(element._id);
    setStatus("Approved");
    setButtonsDisabled(true);
  };
  
  const handleReject = () => {
    rejectApplication(element._id);
    setStatus("Rejected");
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
          disabled={buttonsDisabled || status === "Approved"}
          style={{
            padding: "10px 20px",
            backgroundColor: buttonsDisabled || status === "Approved" ? "gray" : "green",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: buttonsDisabled || status === "Approved" ? "not-allowed" : "pointer",
            marginRight: "10px",
            opacity: buttonsDisabled || status === "Approved" ? 0.6 : 1,
          }}
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          disabled={buttonsDisabled || status === "Rejected"}
          style={{
            padding: "10px 20px",
            backgroundColor: buttonsDisabled || status === "Rejected" ? "gray" : "turquoise",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: buttonsDisabled || status === "Rejected" ? "not-allowed" : "pointer",
            marginRight: "10px",
            opacity: buttonsDisabled || status === "Rejected" ? 0.6 : 1,
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};






