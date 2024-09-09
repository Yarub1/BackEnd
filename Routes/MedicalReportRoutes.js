// File: back/Routes/MedicalReportRoutes.js
import express from "express";
import {
  createMedicalReport,
  getMedicalReports,
  getMedicalReportById,
  updateMedicalReport,
  deleteMedicalReport,
} from "../controllers/MedicalReportController/MedicalReportController.js";

const router = express.Router();

router.post("/medical-reports", createMedicalReport);
router.get("/medical-reports", getMedicalReports);
router.get("/medical-reports/:id", getMedicalReportById);
router.put("/medical-reports/:id", updateMedicalReport);
router.delete("/medical-reports/:id", deleteMedicalReport);

export default router;
