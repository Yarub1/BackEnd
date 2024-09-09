// File: back/Routes/SupplierRoutes.js
import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/SupplierController/SupplierController.js";

const router = express.Router();

router.post("/suppliers", createSupplier);
router.get("/suppliers", getSuppliers);
router.get("/suppliers/:id", getSupplierById);
router.put("/suppliers/:id", updateSupplier);
router.delete("/suppliers/:id", deleteSupplier);

export default router;
