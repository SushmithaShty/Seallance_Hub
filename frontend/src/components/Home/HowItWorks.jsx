import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  return (
    <>
      <div className="howitworks">
        <div className="container">
          <h3>How Seallance_Hub Works</h3>
          <div className="banner">
            <div className="card">
              <FaUserPlus />
              <p>Create Account</p>
              <p>
                 Sign up and create your profile to start exploring job opportunities and connect with employers.
              </p>

            </div>
            <div className="card">
              <MdFindInPage />
              <p>Find a Job/Post a Job</p>
              <p>
                Browse through thousands of job listings or post job openings to find the right candidates.
              </p>

            </div>
            <div className="card">
              <IoMdSend />
              <p>Apply For Job/Recruit Suitable Candidates</p>
              <p>
                    Submit applications for jobs that match your skills or manage and recruit suitable candidates for your openings.
                  </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
