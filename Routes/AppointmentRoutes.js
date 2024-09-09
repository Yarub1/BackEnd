// File: routes/AppointmentRoutes.js
import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDate,
  completeAppointment,
} from "../controllers/AppointmentController/AppointmentController.js";

const router = express.Router();

router.post("/appointments", createAppointment);

router.get("/appointments", getAppointments);

router.get("/appointments/:id", getAppointmentById);

router.put("/appointments/:id", updateAppointment);

router.delete("/appointments/:id", deleteAppointment);

router.get("/appointments/date/:date", getAppointmentsByDate);

router.put("/appointments/complete/:id", completeAppointment);



export default router;
