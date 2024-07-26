import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }

    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, [id, isAuthorized, navigateTo]);

  useEffect(() => {
    console.log("User:", user);
    console.log("User role:", user?.role);
  }, [user]);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '50px', // Reduced padding to move content further up
    backgroundColor: '#f5f5f5',
    marginTop: '-100px', // Increased negative margin to move the container up
  };

  const formStyle = {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    margin: '10px 0',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '0px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd',
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const tableRowStyle = {
    borderBottom: '1px solid #ddd',
  };

  const tableHeaderStyle = {
    textAlign: 'left',
    padding: '8px',
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '16px',
  };

  const tableDataStyle = {
    padding: '8px',
    backgroundColor: '#fff',
    color: '#555',
    fontSize: '16px',
  };

  const buttonStyle = {
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
  };

  const buttonHoverStyle = {
    backgroundColor: 'turquoise',
    color: 'white',
  };

  return (
    <section className="jobDetail page">
      <div className="container" style={containerStyle}>
        <div style={formStyle}>
          <h1 style={headingStyle}>Job Details</h1>
          <table style={tableStyle}>
            <tbody>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Title</th>
                <td style={tableDataStyle}>{job.title}</td>
              </tr>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Category</th>
                <td style={tableDataStyle}>{job.category}</td>
              </tr>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Country</th>
                <td style={tableDataStyle}>{job.country}</td>
              </tr>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>City</th>
                <td style={tableDataStyle}>{job.city}</td>
              </tr>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Location</th>
                <td style={tableDataStyle}>{job.location}</td>
              </tr>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Description</th>
                <td style={tableDataStyle}>{job.description}</td>
              </tr>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Job Posted On</th>
                <td style={tableDataStyle}>{job.jobPostedOn}</td>
              </tr>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Salary</th>
                <td style={tableDataStyle}>
                  {job.fixedSalary ? (
                    job.fixedSalary
                  ) : (
                    `${job.salaryFrom} - ${job.salaryTo}`
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link
              to={`/application/${job._id}`}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                e.target.style.color = buttonHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = buttonStyle.backgroundColor;
                e.target.style.color = buttonStyle.color;
              }}
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
