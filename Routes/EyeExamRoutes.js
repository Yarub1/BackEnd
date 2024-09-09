// File: Routes/EyeExamRoutes.js

import express from "express";
import {
  createEyeExam,
  getEyeExamsByPatientId,
  updateEyeExam,
  deleteEyeExam,
  getAllEyeExams,
} from "../controllers/EyeExamController/EyeExamController.js";

const router = express.Router();

router.post("/patients/:patientId/eye-exams", createEyeExam);
router.get('/eye-exams', getAllEyeExams); 

router.get("/patients/:patientId/eye-exams", getEyeExamsByPatientId);
router.put("/eye-exams/:eyeExamId", updateEyeExam);
router.delete("/eye-exams/:eyeExamId", deleteEyeExam);

export default router;
