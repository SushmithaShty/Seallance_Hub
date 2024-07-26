import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthorized) {
    return <Navigate to={'/'} />
  }

  return (
    <section className="authPage">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="header">
              <img src="/seallence.png" alt="logo" style={{ height: '30px', width: 'auto', paddingTop: '15px' }} />
              <div className="line" style={{ marginTop: '0' }}></div>
              <h3>Already Registered? Login</h3>
            </div>
            <form onSubmit={handleLogin}>
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
              <div className="form-group-a">
                <label htmlFor="email" className="visually-hidden">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group-a">
                <label htmlFor="password" className="visually-hidden">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'turquoise', padding: '10px 20px', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer' }}>Login</button>
              <p className="mt-3 text-center">
                <span className="line-left"></span>
                <Link to="/register" className="ml-2 mr-2 text-gray">Don't have an account?</Link>
                <span className="line-right"></span>
              </p>
            </form>
          </div>
          <div className="col-md-6 d-none d-md-block">
            <div className="secure-login">
              {/* Assuming 'secure-login-animate.svg' is in public folder */}
              <img src="/secure-login-animate.svg" alt="Secure Login Animation" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
