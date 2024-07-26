import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      <nav className="navbar bg-white shadow" style={{ height: '80px' }}>
        <div className="container-fluid d-flex align-items-center h-100" style={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <div className="navbar-brand d-flex align-items-center">
            <img
              src="/seallence.png"
              alt="logo"
              style={{ height: "30px", width: "auto", paddingTop: "15px" }}
            />
          </div>

          {/* Centered Other Details */}
          <div className="d-flex align-items-center mx-auto">
            <button
              className="btn"
              onClick={() => {
                setDropdownOpen(false);
                navigateTo("/");
              }}
              style={{ color: '#333333', fontSize: '1rem', fontWeight: '500', marginRight: '1rem' }}
            >
             | HOME |
            </button>
            <button
              className="btn"
              onClick={() => {
                setDropdownOpen(false);
                navigateTo("/job/getall");
              }}
              style={{ color: '#333333', fontSize: '1rem', fontWeight: '500', marginRight: '1rem' }}
            >
            | ALL JOBS |
            </button>
            <button
              className="btn"
              onClick={() => {
                setDropdownOpen(false);
                navigateTo("/applications/me");
              }}
              style={{ color: '#333333', fontSize: '1rem', fontWeight: '500', marginRight: '1rem' }}
            >
              {user && user.role === "Employer"
                ? "| APPLICANT'S APPLICATIONS |"
                : "| MY APPLICATIONS |"}
            </button>
            {user && user.role === "Employer" && (
              <>
                <button
                  className="btn"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigateTo("/job/post");
                  }}
                  style={{ color: '#333333', fontSize: '1rem', fontWeight: '500', marginRight: '1rem' }}
                >
                | POST NEW JOB |
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigateTo("/job/me");
                  }}
                  style={{ color: '#333333', fontSize: '1rem', fontWeight: '500' }}
                >
                | VIEW YOUR JOBS |
                </button>
              </>
            )}
          </div>

          {/* Username and Dropdown */}
          <div className="d-flex align-items-center position-relative">
            {isAuthorized && user && (
              <div className="position-relative">
                <button
  className="btn ms-3"
  onClick={toggleDropdown}
  style={{
    fontSize: '1rem', // Increased font size
    fontWeight: '600', // Increased font weight for bolder text
    color: '#333333', // Dark gray text color
    backgroundColor: 'transparent', // Ensures no background color
    border: 'none', // Removes border
    padding: '0.5rem 1rem', // Adjust padding as needed
    borderRadius: '0.25rem', // Rounded corners
    fontStyle: 'italic' // Italic text style
  }}
>
  Hello, {user.name}
</button>


                {dropdownOpen && (
                  <div
                    className="dropdown-menu show"
                    style={{ position: 'absolute', top: '100%', right: '0', zIndex: 1050 }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigateTo("/Profile/Profile");
                      }}
                      style={{ fontSize: '0.875rem', fontWeight: '400', color: '#333333' }}
                    >
                      Profile
                    </button>
                    <button className="dropdown-item" onClick={handleLogout} style={{ fontSize: '0.875rem', fontWeight: '400', color: '#333333' }}>
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Card */}
      {dropdownOpen && (
        <div
          className="position-absolute"
          style={{ top: '80px', right: '20px', zIndex: 1050 }}
        >
          <div className="card" style={{ borderRadius: '15px', width: '300px', height: '180px' }}>
            <div className="card-body p-3">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  {/* <img
                    src={user.profileImg || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"}
                    alt="Profile"
                    className="img-fluid"
                    style={{ width: '80px', borderRadius: '10px' }}
                  /> */}
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333333' }}>{user.name}</h5>
                  <p className="mb-2 pb-1" style={{ fontSize: '0.875rem', color: 'gray' }}>{user.role}</p>
                  <div className="d-flex pt-1">
                    <button
                      type="button"
                      className="btn btn-outline-primary me-1 flex-grow-1"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigateTo("/Profile/Profile");
                      }}
                      style={{ fontSize: '0.875rem', fontWeight: '400' }}
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary flex-grow-1"
                      onClick={handleLogout}
                      style={{ fontSize: '0.875rem', fontWeight: '400' }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
