// Application Router

import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  acceptApplication,
  rejectApplication,
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);

// New endpoints for accepting and rejecting applications
router.put("/accept/:id", isAuthenticated, acceptApplication);
router.put("/reject/:id", isAuthenticated, rejectApplication);

export default router;
