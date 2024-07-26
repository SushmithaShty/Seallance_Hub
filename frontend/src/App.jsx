import React, { useContext, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import Profile from "./components/Profile/UpdateProfile";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setLoading(false); // Set loading to false once the request completes
      }
    };
    fetchUser();
  }, [setIsAuthorized, setUser]);

  useEffect(() => {
    let interval;
    if (location.pathname === "/home") {
      interval = setInterval(() => {
        window.location.reload();
      }, 60000); // Refresh every 60 seconds
    }
    return () => clearInterval(interval); // Clear the interval when the component unmounts or pathname changes
  }, [location.pathname]);

  const noNavbarRoutes = ["/login", "/register"];

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthorized ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={isAuthorized ? <Home /> : <Navigate to="/login" />} />
        <Route path="/job/getall" element={isAuthorized ? <Jobs /> : <Navigate to="/login" />} />
        <Route path="/job/:id" element={isAuthorized ? <JobDetails /> : <Navigate to="/login" />} />
        <Route path="/application/:id" element={isAuthorized ? <Application /> : <Navigate to="/login" />} />
        <Route path="/applications/me" element={isAuthorized ? <MyApplications /> : <Navigate to="/login" />} />
        <Route path="/job/post" element={isAuthorized ? <PostJob /> : <Navigate to="/login" />} />
        <Route path="/job/me" element={isAuthorized ? <MyJobs /> : <Navigate to="/login" />} />
        <Route path="/profile/Profile" element={isAuthorized ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

const Main = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Main;
