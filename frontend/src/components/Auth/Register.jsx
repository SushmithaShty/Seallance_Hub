import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <section className="authPage">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-8 col-sm-10">
            <div className="secure-login">
              <img src="/queue-animate.svg" alt="Secure Login Animation" className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-7 col-md-8 col-sm-10">
            <div className="header">
              <img src="/seallence.png" alt="logo" style={{ height: '30px', width: 'auto', paddingTop: '15px' }} />
              <div className="line"></div>
              <h3>Create a new account</h3>
            </div>
            <form onSubmit={handleRegister}>
              <div className="form-group-a">
                <label className="visually-hidden">Login As</label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="employer"
                    className="form-check-input"
                    checked={role === "Employer"}
                    onChange={() => setRole(role === "Employer" ? "" : "Employer")}
                  />
                  <label htmlFor="employer" className="form-check-label">Employer</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="jobSeeker"
                    className="form-check-input"
                    checked={role === "Job Seeker"}
                    onChange={() => setRole(role === "Job Seeker" ? "" : "Job Seeker")}
                  />
                  <label htmlFor="jobSeeker" className="form-check-label">Job Seeker</label>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control custom-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control custom-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control custom-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control custom-input"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'turquoise', padding: '10px 20px', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer' }}>Register</button>
              <p className="mt-3 text-center">
                <span className="line-left"></span>
                <Link to="/login" className="ml-2 mr-2 text-gray">Do you have an account?</Link>
                <span className="line-right"></span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
