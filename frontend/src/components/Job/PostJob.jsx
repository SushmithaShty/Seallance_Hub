import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import 'bootstrap/dist/css/bootstrap.min.css';

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        salaryType === "Fixed Salary"
          ? { title, description, category, country, city, location, fixedSalary }
          : { title, description, category, country, city, location, salaryFrom, salaryTo },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigate("/");
    }
  }, [isAuthorized, user, navigate]);

  const formControlStyle = {
    marginBottom: "1rem",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ced4da",
  };

  const labelStyle = {
    marginBottom: "0.5rem",
    fontWeight: "bold",
  };

  const buttonStyle = {
    backgroundColor: 'turquoise',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <section className="authPage d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="header text-center mb-4">
              <h3>Post a New Job</h3>
              <div className="line" style={{ marginTop: '0' }}></div>
            </div>
            <form onSubmit={handleJobPost}>
              <div className="form-group" style={formControlStyle}>
                <label htmlFor="title" style={labelStyle}>Job Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  placeholder="Job Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group" style={formControlStyle}>
                <label htmlFor="category" style={labelStyle}>Category</label>
                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
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
              <div className="form-group" style={formControlStyle}>
                <label htmlFor="country" style={labelStyle}>Country</label>
                <input
                  type="text"
                  id="country"
                  className="form-control"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="form-group" style={formControlStyle}>
                <label htmlFor="city" style={labelStyle}>City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group" style={formControlStyle}>
                <label htmlFor="location" style={labelStyle}>Location</label>
                <input
                  type="text"
                  id="location"
                  className="form-control"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="form-group" style={formControlStyle}>
                <label htmlFor="salaryType" style={labelStyle}>Salary Type</label>
                <select
                  id="salaryType"
                  className="form-control"
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                >
                  <option value="default">Select Salary Type</option>
                  <option value="Fixed Salary">Fixed Salary</option>
                  <option value="Ranged Salary">Ranged Salary</option>
                </select>
              </div>

              {salaryType === "Fixed Salary" && (
                <div className="form-group" style={formControlStyle}>
                  <label htmlFor="fixedSalary" style={labelStyle}>Fixed Salary</label>
                  <input
                    type="number"
                    id="fixedSalary"
                    className="form-control"
                    placeholder="Fixed Salary"
                    value={fixedSalary}
                    onChange={(e) => setFixedSalary(e.target.value)}
                  />
                </div>
              )}

              {salaryType === "Ranged Salary" && (
                <>
                  <div className="form-group" style={formControlStyle}>
                    <label htmlFor="salaryFrom" style={labelStyle}>Salary From</label>
                    <input
                      type="number"
                      id="salaryFrom"
                      className="form-control"
                      placeholder="Salary From"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={formControlStyle}>
                    <label htmlFor="salaryTo" style={labelStyle}>Salary To</label>
                    <input
                      type="number"
                      id="salaryTo"
                      className="form-control"
                      placeholder="Salary To"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={formControlStyle}>
                <label htmlFor="description" style={labelStyle}>Job Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  placeholder="Job Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ height: "150px" }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={buttonStyle}>Post Job</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostJob;
