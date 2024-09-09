import express from "express";
import {
  getAdmins,
  getAdminById,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
  updateAdminImage,
} from "../controllers/AdminController/AdminController.js";

const router = express.Router();

router.get("/admins", getAdmins);

router.get("/admins/:id", getAdminById);

router.post("/admins", addAdmin);

router.put("/admins/:id", updateAdmin);

router.delete("/admins/:id", deleteAdmin);

router.put("/admins/:id/change-password", changeAdminPassword);

router.put("/admins/:id/image", updateAdminImage);


export default router;
