import express from "express";
import PatientController from "../controllers/PatientController/PatientController.js";

const router = express.Router();

router.post("/patients", PatientController.createPatient);
router.get("/patients", PatientController.getPatients);
router.get("/patients/:id", PatientController.getPatientById);
router.get("/patients/:id/role", PatientController.getPatientRole);
router.put("/patients/:id", PatientController.updatePatient);
router.delete("/patients/:id", PatientController.deletePatient);
router.post("/patients/deleteMany", PatientController.deleteManyPatients); 
router.put("/patients/:id/role", PatientController.updatePatientAndRole); 
router.post("/uploadImage", PatientController.uploadImage);
router.post("/uploadDocument", PatientController.uploadDocument); 
router.put("/patients/:id/update-image", PatientController.updatePatientImage);

export default router;
